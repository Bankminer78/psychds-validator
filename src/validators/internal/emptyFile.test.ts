import { assertEquals } from '../../deps/asserts.ts'
import { psychDSContext } from '../../schema/context.ts'
import { psychDSFileDeno } from '../../files/deno.ts'
import { FileTree } from '../../types/filetree.ts'
import { DatasetIssues } from '../../issues/datasetIssues.ts'
import { FileIgnoreRules } from '../../files/ignore.ts'
import { loadSchema } from '../../setup/loadSchema.ts'
import { emptyFile } from './emptyFile.ts'
import { GenericSchema } from '../../types/schema.ts'

const PATH = 'test_data/valid_datasets/bfi-dataset'
const schema = await loadSchema()
const fileTree = new FileTree(PATH, '/')
const issues = new DatasetIssues(schema as unknown as GenericSchema)
const ignore = new FileIgnoreRules([])

Deno.test("test emptyFile", async (t) => {
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