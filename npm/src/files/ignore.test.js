import * as dntShim from "../_dnt.test_shims.js";
import { assertEquals } from '../deps/asserts.js';
import { FileIgnoreRules } from './ignore.js';
dntShim.Deno.test('Deno implementation of FileIgnoreRules', async (t) => {
    await t.step('handles basic .psychdsignore rules', () => {
        const files = [
            '/sub-01/anat/sub-01_T1w.nii.gz',
            '/dataset_description.json',
            '/README',
            '/participants.tsv',
            '/.git/HEAD',
            '/sub-01/anat/non-bidsy-file.xyz',
            '/data/study-1_data.csv'
        ];
        const rules = ['.git', '**/*.xyz'];
        const ignore = new FileIgnoreRules(rules);
        const filtered = files.filter((path) => !ignore.test(path));
        assertEquals(filtered, [
            '/sub-01/anat/sub-01_T1w.nii.gz',
            '/dataset_description.json',
            '/README',
            '/participants.tsv',
            '/data/study-1_data.csv'
        ]);
    });
});
