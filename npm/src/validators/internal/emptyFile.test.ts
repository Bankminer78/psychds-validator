import * as dntShim from "../../_dnt.test_shims.js";
import { assertEquals } from '../../deps/asserts.js'
import { psychDSContext } from '../../schema/context.js'
import { psychDSFileDeno } from '../../files/deno.js'
import { FileTree } from '../../types/filetree.js'
import { DatasetIssues } from '../../issues/datasetIssues.js'
import { FileIgnoreRules } from '../../files/ignore.js'
import { loadSchema } from '../../setup/loadSchema.js'
import { emptyFile } from './emptyFile.js'
import { GenericSchema } from '../../types/schema.js'

const PATH = 'test_data/valid_datasets/bfi-dataset'
const schema = await loadSchema()
const fileTree = new FileTree(PATH, '/')
const issues = new DatasetIssues(schema as unknown as GenericSchema)
const ignore = new FileIgnoreRules([])

dntShim.Deno.test("test emptyFile", async (t) => {
    await t.step("file is empty", async () => {
        const PATH = 'test_data/testfiles'
        const fileName = 'emptyfile'
        const file = new psychDSFileDeno(PATH, fileName, ignore)
        const context = new psychDSContext(fileTree, file, issues)
        await emptyFile(schema as unknown as GenericSchema,context)
        assertEquals(
            context.issues
              .getFileIssueKeys(context.file.path)
              .includes('EMPTY_FILE'),
            true,
          )
    })

    await t.step("file is not empty", async () => {
        const fileName = 'dataset_description.json'
        const file = new psychDSFileDeno(PATH, fileName, ignore)
        const context = new psychDSContext(fileTree, file, issues)
        await emptyFile(schema as unknown as GenericSchema,context)
        assertEquals(
            context.issues
              .getFileIssueKeys(context.file.path)
              .includes('EMPTY_FILE'),
            false,
          )
    })
})