import * as dntShim from "../_dnt.test_shims.js";
import { assertEquals } from '../deps/asserts.js';
import { psychDSContext } from '../schema/context.js';
import { extensionMismatch, checkMissingRules, keywordCheck } from './filenameValidate.js';
import { psychDSFileDeno, readFileTree } from '../files/deno.js';
import { DatasetIssues } from '../issues/datasetIssues.js';
import { FileIgnoreRules } from '../files/ignore.js';
import { loadSchema } from '../setup/loadSchema.js';
const PATH = 'test_data/valid_datasets/bfi-dataset';
const schema = (await loadSchema());
const fileTree = await readFileTree(PATH);
const issues = new DatasetIssues(schema);
const ignore = new FileIgnoreRules([]);
dntShim.Deno.test('test extensionMismatch', async (t) => {
    await t.step('extensions match', async () => {
        const fileName = 'dataset_description.json';
        const file = new psychDSFileDeno(PATH, fileName, ignore);
        const context = new psychDSContext(fileTree, file, issues);
        await extensionMismatch('rules.files.common.core.dataset_description', schema, context);
        assertEquals(context.issues.has('EXTENSION_MISMATCH'), false);
    });
    await t.step('extensions mismatch', async () => {
        const fileName = 'dataset_description.json';
        const file = new psychDSFileDeno(PATH, fileName, ignore);
        const context = new psychDSContext(fileTree, file, issues);
        await extensionMismatch('rules.files.common.core.README', schema, context);
        assertEquals(context.issues.has('EXTENSION_MISMATCH'), true);
    });
});
dntShim.Deno.test('test checkMissingRules', async (t) => {
    await t.step('rule satisfied', () => {
        const fileName = 'dataset_description.json';
        const file = new psychDSFileDeno(PATH, fileName, ignore);
        const context = new psychDSContext(fileTree, file, issues);
        const rulesRecord = {};
        rulesRecord['rules.files.common.core.dataset_description'] = true;
        checkMissingRules(schema, rulesRecord, context.issues);
        assertEquals(context.issues.has('MISSING_DATASET_DESCRIPTION'), false);
    });
    await t.step('rule not satisfied', () => {
        const fileName = 'dataset_description.json';
        const file = new psychDSFileDeno(PATH, fileName, ignore);
        const context = new psychDSContext(fileTree, file, issues);
        const rulesRecord = {};
        rulesRecord['rules.files.common.core.dataset_description'] = false;
        checkMissingRules(schema, rulesRecord, context.issues);
        assertEquals(context.issues.has('MISSING_DATASET_DESCRIPTION'), true);
    });
});
dntShim.Deno.test('test keywordCheck', async (t) => {
    await t.step('rule satisfied', () => {
        const fileName = 'study-bfi_data.csv';
        const file = new psychDSFileDeno(`${PATH}/data/raw_data`, fileName, ignore);
        const context = new psychDSContext(fileTree, file, issues);
        keywordCheck('rules.files.tabular_data.data.Datafile', schema, context);
        assertEquals(context.issues.has('KEYWORD_FORMATTING_ERROR'), false);
    });
    await t.step('formatting broken', () => {
        const fileName = 'study_data.csv';
        const file = new psychDSFileDeno(`test_data/testfiles/`, fileName, ignore);
        const context = new psychDSContext(fileTree, file, issues);
        keywordCheck('rules.files.tabular_data.data.Datafile', schema, context);
        assertEquals(context.issues.has('KEYWORD_FORMATTING_ERROR'), true);
    });
    await t.step('rule not satisfied', () => {
        const fileName = 'fake-v1_data.csv';
        const file = new psychDSFileDeno(`test_data/testfiles/`, fileName, ignore);
        const context = new psychDSContext(fileTree, file, issues);
        keywordCheck('rules.files.tabular_data.data.Datafile', schema, context);
        assertEquals(context.issues.has('UNOFFICIAL_KEYWORD_WARNING'), true);
    });
});
