import * as dntShim from "../_dnt.test_shims.js";

import { assertEquals } from '../deps/asserts.js'
import { loadSchema } from '../setup/loadSchema.js'
import { applyRules  } from './applyRules.js'
import { DatasetIssues } from '../issues/datasetIssues.js'
import { Issue } from '../types/issues.js'
import { FileIgnoreRules } from "../files/ignore.js";
import { psychDSFileDeno, readFileTree } from "../files/deno.js";
import { psychDSContext, psychDSContextDataset } from "./context.js";
import { GenericSchema } from "../types/schema.js";
import { psychDSFile } from "../types/file.js";
import { ValidatorOptions } from "../setup/options.js";
import jsonld from 'jsonld';

const PATH = 'test_data/valid_datasets/bfi-dataset'
const schema = await loadSchema()
const fileTree = await readFileTree(PATH)
const issues = new DatasetIssues(schema as unknown as GenericSchema)
const ignore = new FileIgnoreRules([])


const invPATH = 'test_data/invalid_datasets/bfi-dataset'
const invFileTree = await readFileTree(invPATH)

const noCtxPATH = 'test_data/invalid_datasets/bfi-dataset_nocontext'
const noCtxFileTree = await readFileTree(noCtxPATH)


const noTypePATH = 'test_data/invalid_datasets/bfi-dataset_notype'
const noTypeFileTree = await readFileTree(noTypePATH)

const wrongTypePATH = 'test_data/invalid_datasets/bfi-dataset_wrongtype'
const wrongTypeFileTree = await readFileTree(wrongTypePATH)




dntShim.Deno.test({
  name:'applyRules test', 
  sanitizeResources: false,
  fn: async(t) => {
    await t.step('Columns Found', async () => {
      const fileName = '/data/raw_data/study-bfi_data.csv'
      const ddFile = fileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        const description = ddFile.expanded
        dsContext = new psychDSContextDataset({datasetPath:invPATH} as ValidatorOptions, ddFile, description)
      }
      
      const file = new psychDSFileDeno(PATH, fileName, ignore)
      file.fileText = await file.text()
      const issues = new DatasetIssues(schema as unknown as GenericSchema)
      const context = new psychDSContext(fileTree, file, issues,dsContext)
      await context.asyncLoads()
      context.validColumns = ["A1","A2","A3","A4","A5","C1","C2","C3","C4","C5","E1","E2","E3","E4","E5","N1","N2","N3","N4","N5","O1","O2","O3","O4","O5","gender","education","age"]

      await applyRules(schema as unknown as GenericSchema,context)
      assertEquals(context.issues.has('CSV_COLUMN_MISSING'),false)
    })
    await t.step('Columns Not Found', async () => {
        const fileName = '/data/raw_data/study-bfi_data.csv'

        const ddFile = fileTree.files.find(
          (file: psychDSFile) => file.name === 'dataset_description.json',
        )
        let dsContext
        if (ddFile) {
          const description = ddFile.expanded
          dsContext = new psychDSContextDataset({datasetPath:invPATH} as ValidatorOptions, ddFile, description)
        }
        const file = new psychDSFileDeno(PATH, fileName, ignore)
        file.fileText = await file.text()
        const issues = new DatasetIssues(schema as unknown as GenericSchema)
        const context = new psychDSContext(fileTree, file, issues,dsContext)
        await context.asyncLoads()
        context.validColumns = []

        await applyRules(schema as unknown as GenericSchema,context)
        assertEquals(context.issues.has('CSV_COLUMN_MISSING'),true)
    })
    await t.step('Fields found', async () => {
        const ddFile = fileTree.files.find(
          (file: psychDSFile) => file.name === 'dataset_description.json',
        )
        let dsContext
        if (ddFile) {
          const description = ddFile.expanded
          dsContext = new psychDSContextDataset({datasetPath:PATH} as ValidatorOptions, ddFile, description)
        }
      
        const fileName = '/data/raw_data/study-bfi_data.csv'
        const file = new psychDSFileDeno(PATH, fileName, ignore)
        const issues = new DatasetIssues(schema as unknown as GenericSchema)
        const context = new psychDSContext(fileTree, file, issues,dsContext)
        await context.asyncLoads()
        context.validColumns = []

        await applyRules(schema as unknown as GenericSchema,context)
        assertEquals(context.issues.has('JSON_KEY_REQUIRED'),false)
    })
    await t.step('Fields missing', async () => {
      const ddFile = invFileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        const description = ddFile.expanded
        dsContext = new psychDSContextDataset({datasetPath:invPATH} as ValidatorOptions, ddFile, description)
      }
      const fileName = '/data/raw_data/study-bfi_data.csv'
      const file = new psychDSFileDeno(invPATH, fileName, ignore)
      const issues = new DatasetIssues(schema as unknown as GenericSchema)
      const context = new psychDSContext(invFileTree, file, issues,dsContext)
      await context.asyncLoads()

      context.validColumns = []
      await applyRules(schema as unknown as GenericSchema,context)
      assertEquals(context.issues.has('JSON_KEY_REQUIRED'),true)
    })
    await t.step('Context missing', async () => {
      const ddFile = noCtxFileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        const description = ddFile.expanded
        dsContext = new psychDSContextDataset({datasetPath:noCtxPATH} as ValidatorOptions, ddFile, description)
      }
      const fileName = '/data/raw_data/study-bfi_data.csv'
      const file = new psychDSFileDeno(noCtxPATH, fileName, ignore)
      const issues = new DatasetIssues(schema as unknown as GenericSchema)
      const context = new psychDSContext(noCtxFileTree, file, issues,dsContext)
      
      await context.asyncLoads()

      context.validColumns = []
      await applyRules(schema as unknown as GenericSchema,context)
      assertEquals(context.issues.has('JSON_KEY_REQUIRED'),true)
    })
    await t.step('@type missing', async () => {
      const ddFile = noTypeFileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        const description = ddFile.expanded
        dsContext = new psychDSContextDataset({datasetPath:noTypePATH} as ValidatorOptions, ddFile, description)
      }
      const fileName = '/data/raw_data/study-bfi_data.csv'
      const file = new psychDSFileDeno(noTypePATH, fileName, ignore)
      const issues = new DatasetIssues(schema as unknown as GenericSchema)
      const context = new psychDSContext(noTypeFileTree, file, issues,dsContext)
      
      await context.asyncLoads()

      context.validColumns = []
      await applyRules(schema as unknown as GenericSchema,context)
      assertEquals(context.issues.has('MISSING_DATASET_TYPE'),true)
    })
    await t.step('@type incorrect', async () => {
      const ddFile = wrongTypeFileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        const description = ddFile.expanded
        dsContext = new psychDSContextDataset({datasetPath:wrongTypePATH} as ValidatorOptions, ddFile, description)
      }
      const fileName = '/data/raw_data/study-bfi_data.csv'

      const file = new psychDSFileDeno(wrongTypePATH, fileName, ignore)
      const issues = new DatasetIssues(schema as unknown as GenericSchema)
      const context = new psychDSContext(wrongTypeFileTree, file, issues,dsContext)
      
      await context.asyncLoads()

      context.validColumns = []
      await applyRules(schema as unknown as GenericSchema,context)
      assertEquals(context.issues.has('INCORRECT_DATASET_TYPE'),true)
    })
    await t.step('non-schema.org field found', async () => {
      const ddFile = fileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        let description: any = await ddFile.text()
          description = description
            .replace('https://schema.org','http://schema.org')
            .replace('https://www.schema.org','http://schema.org')
        let json = (await JSON.parse(description)) as object
          json = {
            ...json,
            'testProp':''
          }
          description = (await jsonld.expand(json))[0]
        dsContext = new psychDSContextDataset({datasetPath:PATH} as ValidatorOptions, ddFile, description)
      }

      const fileName = '/data/raw_data/study-bfi_data.csv'

      const file = new psychDSFileDeno(PATH, fileName, ignore)
      const issues = new DatasetIssues(schema as unknown as GenericSchema)
      const context = new psychDSContext(fileTree, file, issues,dsContext)
      await context.asyncLoads()
      context.validColumns = []

      await applyRules(schema as unknown as GenericSchema,context)
      assertEquals(context.issues.has('INVALID_SCHEMAORG_PROPERTY'),true)
    })

    await t.step('invalid object type', async () => {
      const ddFile = invFileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        const description = ddFile.expanded
        dsContext = new psychDSContextDataset({datasetPath:invPATH} as ValidatorOptions, ddFile, description)
      }
      const fileName = '/data/raw_data/study-bfi_data.csv'

      const file = new psychDSFileDeno(invPATH, fileName, ignore)
      const issues = new DatasetIssues(schema as unknown as GenericSchema)
      const context = new psychDSContext(invFileTree, file, issues,dsContext)
      
      await context.asyncLoads()

      context.validColumns = []
      await applyRules(schema as unknown as GenericSchema,context)
      assertEquals(context.issues.has('INVALID_OBJECT_TYPE'),true)
    })

    await t.step('missing object type', async () => {
      const ddFile = invFileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        const description = ddFile.expanded
        dsContext = new psychDSContextDataset({datasetPath:invPATH} as ValidatorOptions, ddFile, description)
      }
      const fileName = '/data/raw_data/study-bfi_data.csv'

      const file = new psychDSFileDeno(invPATH, fileName, ignore)
      const issues = new DatasetIssues(schema as unknown as GenericSchema)
      const context = new psychDSContext(invFileTree, file, issues,dsContext)
      
      await context.asyncLoads()

      context.validColumns = []
      await applyRules(schema as unknown as GenericSchema,context)
      assertEquals(context.issues.has('OBJECT_TYPE_MISSING'),true)
    })
    await t.step('unknown namespace', async () => {
      const ddFile = invFileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        const description = ddFile.expanded
        dsContext = new psychDSContextDataset({datasetPath:invPATH} as ValidatorOptions, ddFile, description)
      }
      const fileName = '/data/raw_data/study-bfi_data.csv'

      const file = new psychDSFileDeno(invPATH, fileName, ignore)
      const issues = new DatasetIssues(schema as unknown as GenericSchema)
      const context = new psychDSContext(invFileTree, file, issues,dsContext)
      
      await context.asyncLoads()

      context.validColumns = []
      await applyRules(schema as unknown as GenericSchema,context)
      assertEquals(context.issues.has('UNKNOWN_NAMESPACE'),true)
    })
    await t.step('correct sidecar identified', async () => {
      const ddFile = fileTree.files.find(
        (file: psychDSFile) => file.name === 'dataset_description.json',
      )
      let dsContext
      if (ddFile) {
        const description = ddFile.expanded
        dsContext = new psychDSContextDataset({datasetPath:PATH} as ValidatorOptions, ddFile, description)
      }

      const fileName = '/data/raw_data/study-bfi_data.csv'

      const file = new psychDSFileDeno(PATH, fileName, ignore)
      const context = new psychDSContext(fileTree, file, issues,dsContext)
      await context.asyncLoads()
      context.validColumns = []

      await applyRules(schema as unknown as GenericSchema,context)
      if(context.issues.has('INVALID_SCHEMAORG_PROPERTY'))
        assertEquals((context.issues.get('INVALID_SCHEMAORG_PROPERTY') as Issue).files.has('/data/raw_data/study-bfi_data.json'),true)
    })
  }

    
})