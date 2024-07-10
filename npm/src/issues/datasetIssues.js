import { Issue, } from '../types/issues.js';
// Code is deprecated, return something unusual but JSON serializable
const CODE_DEPRECATED = Number.MIN_SAFE_INTEGER;
/**
 * Format an internal file reference with context as IssueFileOutput
 */
const issueFile = (issue, f) => {
    const evidence = f.evidence || '';
    const reason = issue.reason || '';
    const line = f.line || 0;
    const character = f.character || 0;
    return {
        key: issue.key,
        code: CODE_DEPRECATED,
        file: { path: f.path, name: f.name, relativePath: f.path },
        evidence,
        line,
        character,
        severity: issue.severity,
        reason,
        helpUrl: issue.helpUrl,
    };
};
/**
 * Management class for dataset issues
 */
export class DatasetIssues extends Map {
    //added optional schema hook so addSchemaIssue can reference the error list from schema model
    schema;
    constructor(schema) {
        super();
        this.schema = schema ? schema : {};
    }
    add({ key, reason, severity = 'error', requires = [], files = [], }) {
        const existingIssue = this.get(key);
        // Handle both the shorthand psychDSFile array or full IssueFile
        if (existingIssue) {
            for (const f of files) {
                existingIssue.files.set(f.path, f);
            }
            return existingIssue;
        }
        else {
            const newIssue = new Issue({
                key,
                severity,
                reason,
                requires,
                files,
            });
            this.set(key, newIssue);
            return newIssue;
        }
    }
    // Shorthand to test if an issue has occurred
    hasIssue({ key }) {
        if (this.has(key)) {
            return true;
        }
        return false;
    }
    //adds issue from errors.yaml file of schema model
    addSchemaIssue(key, files) {
        if (this.schema) {
            this.add({
                key: this.schema[`rules.errors.${key}.code`],
                reason: this.schema[`rules.errors.${key}.reason`],
                severity: this.schema[`rules.errors.${key}.level`],
                requires: this.schema[`rules.errors.${key}.requires`],
                files: files
            });
        }
    }
    fileInIssues(path) {
        const matchingIssues = [];
        for (const [_, issue] of this) {
            if (issue.files.get(path)) {
                matchingIssues.push(issue);
            }
        }
        return matchingIssues;
    }
    /**
     * Report Issue keys related to a file
     * @param path File path relative to dataset root
     * @returns Array of matching issue keys
     */
    getFileIssueKeys(path) {
        return this.fileInIssues(path).map((issue) => issue.key);
    }
    //removes any issues that pertain to objects that were not founds
    filterIssues(rulesRecord) {
        for (const [_, issue] of this) {
            if (!issue.requires.every((req) => rulesRecord[req])) {
                this.delete(_);
            }
        }
    }
    /**
     * Format output
     *
     * Converts from new internal representation to old IssueOutput structure
     */
    formatOutput() {
        const output = {
            errors: [],
            warnings: [],
        };
        for (const [_, issue] of this) {
            const outputIssue = {
                severity: issue.severity,
                key: issue.key,
                code: CODE_DEPRECATED,
                additionalFileCount: 0,
                reason: issue.reason,
                files: Array.from(issue.files.values()).map((f) => issueFile(issue, f)),
                helpUrl: issue.helpUrl,
            };
            if (issue.severity === 'warning') {
                output.warnings.push(outputIssue);
            }
            else {
                output.errors.push(outputIssue);
            }
        }
        return output;
    }
}
