import { setup, handlers, getLogger, } from '../deps/logger.js';
/**
 * Setup a console logger used with the --debug flag
 */
export function setupLogging(level) {
    setup({
        handlers: {
            console: new handlers.ConsoleHandler(level),
        },
        loggers: {
            '@psychds/validator': {
                level,
                handlers: ['console'],
            },
        },
    });
}
export function parseStack(stack) {
    const lines = stack.split('\n');
    const caller = lines[2].trim();
    const token = caller.split('at ');
    return token[1];
}
const loggerProxyHandler = {
    // deno-lint-ignore no-explicit-any
    get: function (_, prop) {
        const logger = getLogger('@psychds/validator');
        const stack = new Error().stack;
        if (stack) {
            const callerLocation = parseStack(stack);
            logger.debug(`Logger invoked at "${callerLocation}"`);
        }
        const logFunc = logger[prop];
        return logFunc.bind(logger);
    },
};
const logger = new Proxy(getLogger('@psychds/validator'), loggerProxyHandler);
export { logger };
