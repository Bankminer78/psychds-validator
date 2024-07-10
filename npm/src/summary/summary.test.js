import * as dntShim from "../_dnt.test_shims.js";
import { Summary } from './summary.js';
import { assertEquals } from '../deps/asserts.js';
dntShim.Deno.test('Summary class and helper functions', async (t) => {
    await t.step('Constructor succeeds, format outPut', () => {
        const sum = new Summary();
        assertEquals(Object.keys(sum.formatOutput()).length, 6);
    });
});
