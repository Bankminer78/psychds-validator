import { emptyFile } from './internal/emptyFile.js'
import { filenameIdentify,findFileRules, checkDirRules } from './filenameIdentify.js'
import { filenameValidate, checkMissingRules } from './filenameValidate.js'
import { applyRules } from '../schema/applyRules.js'
import { CheckFunction } from '../types/check.js'
import { FileTree } from '../types/filetree.js'
import { ValidatorOptions } from '../setup/options.js'
import { ValidationResult } from '../types/validation-result.js'
import { DatasetIssues } from '../issues/datasetIssues.js'
import {
  IssueFile
} from '../types/issues.js'
import { Summary } from '../summary/summary.js'
import { loadSchema } from '../setup/loadSchema.js'
import { psychDSFile } from '../types/file.js'
import { psychDSContextDataset } from '../schema/context.js'
import { walkFileTree } from '../schema/walk.js'
import { GenericSchema } from '../types/schema.js'


const CHECKS: CheckFunction[] = [
    emptyFile,
    filenameIdentify,
    filenameValidate,
    applyRules,
  ]

/**
 * Full psych-DS schema validation entrypoint
 */
export async function validate(
  fileTree: FileTree,
  options: ValidatorOptions,
): Promise<ValidationResult> {
  const summary = new Summary()
  const schema = await loadSchema(options.schema)
  const issues = new DatasetIssues(schema as unknown as GenericSchema)

  summary.schemaVersion = schema.schema_version
  
  /* There should be a dataset_description in root, this will tell us if we
   * are dealing with a derivative dataset
   */
  const ddFile = fileTree.files.find(
    (file: psychDSFile) => file.name === 'dataset_description.json',
  )

  let dsContext
  if (ddFile) {
    try{
      const description = ddFile.expanded
      dsContext = new psychDSContextDataset(options, ddFile,description)
    }
    catch(_error){
      dsContext = new psychDSContextDataset(options,ddFile)
      issues.addSchemaIssue(
        'InvalidJsonFormatting',
        [ddFile]
      )
    }
  
  } else {
    dsContext = new psychDSContextDataset(options)
  }

  // generate rulesRecord object to keep track of which schema rules 
  // are not satisfied by a file in the dataset.
  const rulesRecord: Record<string,boolean> = {}
  findFileRules(schema,rulesRecord)

  for await (const context of walkFileTree(fileTree, issues, dsContext)) {
    // json-ld processing is now done in the readFileTree stage,
    // so there may be some issues (like json-ld grammar errors)
    // that are discovered before the issue object is created.
    // Check all files found for any of these issues and add them.
    if (context.file.issueInfo.length > 0){
      context.file.issueInfo.forEach((iss) => {
        issues.addSchemaIssue(
          iss.key,
          [{
            ...context.file,
            evidence: iss.evidence ? iss.evidence : ''
            } as IssueFile]
          
        )
      })
    }
    // TODO - Skip ignored files for now (some tests may reference ignored files)
    if (context.file.ignored) {
      continue
    }
    await context.asyncLoads()
    if(context.extension === ".csv"){
        summary.suggestedColumns  = [...new Set([...summary.suggestedColumns,...Object.keys(context.columns)])]
    }
        
    // Run majority of checks
    for (const check of CHECKS) {
      // TODO - Resolve this double casting?
      await check(schema as unknown as GenericSchema, context)
    }

    for (const rule of context.filenameRules) {
        rulesRecord[rule] = true
    }

    await summary.update(context)
  }

  // Since directories don't get their own psychDS context, any directories found
  // within the root directory are added the psychDSContextDataset's baseDirs property.
  // Since these won't show up in the filetree exploration as files eligible to apply rules to,
  // we need to check them explicitly.
  checkDirRules(schema,rulesRecord,dsContext.baseDirs)
  checkMissingRules(schema as unknown as GenericSchema,rulesRecord,issues)

  //filters out issues that apply to unfound objects
  issues.filterIssues(rulesRecord)

  const output: ValidationResult = {
    valid: [...issues.values()].filter(issue => issue.severity === "error").length === 0,
    issues,
    summary: summary.formatOutput(),
  }
  return output
}