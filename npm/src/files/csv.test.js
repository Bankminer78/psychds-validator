import * as dntShim from "../_dnt.test_shims.js";
import { assertEquals } from '../deps/asserts.js';
import { psychDSFileDeno } from './deno.js';
import { FileIgnoreRules } from './ignore.js';
import { parseCSV } from './csv.js';
const ignore = new FileIgnoreRules([]);
dntShim.Deno.test('Test parseCSV', async (t) => {
    await t.step('csv exists', async () => {
        const file = new psychDSFileDeno("test_data/testfiles", 'csv.csv', ignore);
        const result = await file
            .text()
            .then((text) => parseCSV(text))
            .catch((_error) => {
            return {
                'columns': new Map(),
                'issues': []
            };
        });
        assertEquals(result['issues'], []);
    });
    await t.step('Header missing', async () => {
        const file = new psychDSFileDeno("test_data/testfiles", 'noHeader.csv', ignore);
        const result = await file
            .text()
            .then((text) => parseCSV(text))
            .catch((_error) => {
            return {
                'columns': new Map(),
                'issues': []
            };
        });
        assertEquals(result['issues'][0], 'NoHeader');
    });
    await t.step('Header row mismatch', async () => {
        const file = new psychDSFileDeno("test_data/testfiles", 'headerRowMismatch.csv', ignore);
        const result = await file
            .text()
            .then((text) => parseCSV(text))
            .catch((_error) => {
            return {
                'columns': new Map(),
                'issues': []
            };
        });
        assertEquals(result['issues'][0], 'HeaderRowMismatch');
    });
    await t.step('Row_id values not unique', async () => {
        const file = new psychDSFileDeno("test_data/testfiles", 'rowidValuesNotUnique.csv', ignore);
        const result = await file
            .text()
            .then((text) => parseCSV(text))
            .catch((_error) => {
            return {
                'columns': new Map(),
                'issues': []
            };
        });
        assertEquals(result['issues'][0], 'RowidValuesNotUnique');
    });
});
