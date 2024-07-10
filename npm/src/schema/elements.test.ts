import * as dntShim from "../_dnt.test_shims.js";
import { assert } from '../deps/asserts.js'
import { psychDSFileDeno } from "../files/deno.js";
import { FileIgnoreRules } from "../files/ignore.js";
import { readElements } from './elements.js'

const PATH = 'test_data/valid_datasets/bfi-dataset'
const ignore = new FileIgnoreRules([])

dntShim.Deno.test('test readElementss', async (t) => {
  await t.step('has Elements', () => {
    const fileName = '/data/raw_data/study-bfi_data.csv'
    const file = new psychDSFileDeno(PATH, fileName, ignore)
    const context = readElements(file.name)
    assert(context.suffix === 'data', 'failed to match suffix')
    assert(context.extension === '.csv', 'failed to match extension')
  })
  
})
