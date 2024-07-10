// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { getLevelByName, getLevelName, LogLevels } from "./levels.js";
/**
 * An object that encapsulates provided message and arguments as well some
 * metadata that can be later used when formatting a message.
 */
export class LogRecord {
    msg;
    #args;
    #datetime;
    level;
    levelName;
    loggerName;
    constructor(options) {
        this.msg = options.msg;
        this.#args = [...options.args];
        this.level = options.level;
        this.loggerName = options.loggerName;
        this.#datetime = new Date();
        this.levelName = getLevelName(options.level);
    }
    get args() {
        return [...this.#args];
    }
    get datetime() {
        return new Date(this.#datetime.getTime());
    }
}
export class Logger {
    #level;
    #handlers;
    #loggerName;
    constructor(loggerName, levelName, options = {}) {
        this.#loggerName = loggerName;
        this.#level = getLevelByName(levelName);
        this.#handlers = options.handlers || [];
    }
    get level() {
        return this.#level;
    }
    set level(level) {
        this.#level = level;
    }
    get levelName() {
        return getLevelName(this.#level);
    }
    set levelName(levelName) {
        this.#level = getLevelByName(levelName);
    }
    get loggerName() {
        return this.#loggerName;
    }
    set handlers(hndls) {
        this.#handlers = hndls;
    }
    get handlers() {
        return this.#handlers;
    }
    /** If the level of the logger is greater than the level to log, then nothing
     * is logged, otherwise a log record is passed to each log handler.  `msg` data
     * passed in is returned.  If a function is passed in, it is only evaluated
     * if the msg will be logged and the return value will be the result of the
     * function, not the function itself, unless the function isn't called, in which
     * case undefined is returned.  All types are coerced to strings for logging.
     */
    #_log(level, msg, ...args) {
        if (this.level > level) {
            return msg instanceof Function ? undefined : msg;
        }
        let fnResult;
        let logMessage;
        if (msg instanceof Function) {
            fnResult = msg();
            logMessage = this.asString(fnResult);
        }
        else {
            logMessage = this.asString(msg);
        }
        const record = new LogRecord({
            msg: logMessage,
            args: args,
            level: level,
            loggerName: this.loggerName,
        });
        this.#handlers.forEach((handler) => {
            handler.handle(record);
        });
        return msg instanceof Function ? fnResult : msg;
    }
    asString(data) {
        if (typeof data === "string") {
            return data;
        }
        else if (data === null ||
            typeof data === "number" ||
            typeof data === "bigint" ||
            typeof data === "boolean" ||
            typeof data === "undefined" ||
            typeof data === "symbol") {
            return String(data);
        }
        else if (data instanceof Error) {
            return data.stack;
        }
        else if (typeof data === "object") {
            return JSON.stringify(data);
        }
        return "undefined";
    }
    debug(msg, ...args) {
        return this.#_log(LogLevels.DEBUG, msg, ...args);
    }
    info(msg, ...args) {
        return this.#_log(LogLevels.INFO, msg, ...args);
    }
    warning(msg, ...args) {
        return this.#_log(LogLevels.WARNING, msg, ...args);
    }
    error(msg, ...args) {
        return this.#_log(LogLevels.ERROR, msg, ...args);
    }
    critical(msg, ...args) {
        return this.#_log(LogLevels.CRITICAL, msg, ...args);
    }
}
