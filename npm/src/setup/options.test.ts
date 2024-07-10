import * as dntShim from "../_dnt.test_shims.js";
import { assertEquals } from '../deps/asserts.js'
import { parseOptions } from './options.js'

dntShim.Deno.test('options parsing', async (t) => {
  await t.step('verify basic arguments work', async () => {
    const options = await parseOptions(['my_dataset', '--json'])
    assertEquals(options, {
      datasetPath: 'my_dataset',
      debug: 'ERROR',
      json: true,
      schema: 'latest',
    })
  })
})