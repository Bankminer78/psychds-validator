import * as dntShim from "./_dnt.shims.js";
import { parseOptions } from './setup/options.js';
import { setupLogging } from './utils/logger.js';
import { resolve } from './deps/path.js';
import { validate } from './validators/psychds.js';
import { consoleFormat } from './utils/output.js';
import { readFileTree } from './files/deno.js';
/*
 * main function for validator. Grabs arguments from command line, constructs file tree,
 * validates dataset, and returns either json object or formatted output text.
 *
 * CLI Arguments:
 * datasetPath: path to root of dataset to validate
 * --verbose -v: don't cut off output text if too long
 * --showWarnings -w: display warnings in addition to errors
 * --json: return output as json object
 * --schema: specify schema version
 *
*/
export async function main() {
    const options = await parseOptions(dntShim.Deno.args);
    setupLogging(options.debug);
    const absolutePath = resolve(options.datasetPath);
    const tree = await readFileTree(absolutePath);
    const schemaResult = await validate(tree, options);
    if (options.json) {
        console.log(JSON.stringify(schemaResult, (_, value) => {
            if (value instanceof Map) {
                return Array.from(value.values());
            }
            else {
                return value;
            }
        }));
    }
    else {
        console.log(consoleFormat(schemaResult, {
            verbose: options.verbose ? options.verbose : false,
            showWarnings: options.showWarnings ? options.showWarnings : false
        }));
    }
}
