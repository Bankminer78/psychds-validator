// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import * as dntShim from "../../../../_dnt.shims.js";
import { getLevelByName, LogLevels } from "./levels.js";
import { blue, bold, red, yellow } from "../fmt/colors.js";
import { exists, existsSync } from "../fs/exists.js";
import { BufWriterSync } from "../io/buf_writer.js";
const DEFAULT_FORMATTER = "{levelName} {msg}";
export class BaseHandler {
    level;
    levelName;
    formatter;
    constructor(levelName, options = {}) {
        this.level = getLevelByName(levelName);
        this.levelName = levelName;
        this.formatter = options.formatter || DEFAULT_FORMATTER;
    }
    handle(logRecord) {
        if (this.level > logRecord.level)
            return;
        const msg = this.format(logRecord);
        return this.log(msg);
    }
    format(logRecord) {
        if (this.formatter instanceof Function) {
            return this.formatter(logRecord);
        }
        return this.formatter.replace(/{([^\s}]+)}/g, (match, p1) => {
            const value = logRecord[p1];
            // do not interpolate missing values
            if (value == null) {
                return match;
            }
            return String(value);
        });
    }
    log(_msg) { }
    setup() { }
    destroy() { }
}
/**
 * This is the default logger. It will output color coded log messages to the
 * console via `console.log()`.
 */
export class ConsoleHandler extends BaseHandler {
    format(logRecord) {
        let msg = super.format(logRecord);
        switch (logRecord.level) {
            case LogLevels.INFO:
                msg = blue(msg);
                break;
            case LogLevels.WARNING:
                msg = yellow(msg);
                break;
            case LogLevels.ERROR:
                msg = red(msg);
                break;
            case LogLevels.CRITICAL:
                msg = bold(red(msg));
                break;
            default:
                break;
        }
        return msg;
    }
    log(msg) {
        console.log(msg);
    }
}
export class WriterHandler extends BaseHandler {
    _writer;
    #encoder = new TextEncoder();
}
/**
 * This handler will output to a file using an optional mode (default is `a`,
 * e.g. append). The file will grow indefinitely. It uses a buffer for writing
 * to file. Logs can be manually flushed with `fileHandler.flush()`. Log
 * messages with a log level greater than error are immediately flushed. Logs
 * are also flushed on process completion.
 *
 * Behavior of the log modes is as follows:
 *
 * - `'a'` - Default mode. Appends new log messages to the end of an existing log
 *   file, or create a new log file if none exists.
 * - `'w'` - Upon creation of the handler, any existing log file will be removed
 *   and a new one created.
 * - `'x'` - This will create a new log file and throw an error if one already
 *   exists.
 *
 * This handler requires `--allow-write` permission on the log file.
 */
export class FileHandler extends WriterHandler {
    _file;
    _buf;
    _filename;
    _mode;
    _openOptions;
    _encoder = new TextEncoder();
    #unloadCallback = (() => {
        this.destroy();
    }).bind(this);
    constructor(levelName, options) {
        super(levelName, options);
        this._filename = options.filename;
        // default to append mode, write only
        this._mode = options.mode ? options.mode : "a";
        this._openOptions = {
            createNew: this._mode === "x",
            create: this._mode !== "x",
            append: this._mode === "a",
            truncate: this._mode !== "a",
            write: true,
        };
    }
    setup() {
        this._file = dntShim.Deno.openSync(this._filename, this._openOptions);
        this._writer = this._file;
        this._buf = new BufWriterSync(this._file);
        addEventListener("unload", this.#unloadCallback);
    }
    handle(logRecord) {
        super.handle(logRecord);
        // Immediately flush if log level is higher than ERROR
        if (logRecord.level > LogLevels.ERROR) {
            this.flush();
        }
    }
    log(msg) {
        if (this._encoder.encode(msg).byteLength + 1 > this._buf.available()) {
            this.flush();
        }
        this._buf.writeSync(this._encoder.encode(msg + "\n"));
    }
    flush() {
        if (this._buf?.buffered() > 0) {
            this._buf.flush();
        }
    }
    destroy() {
        this.flush();
        this._file?.close();
        this._file = undefined;
        removeEventListener("unload", this.#unloadCallback);
    }
}
/**
 * This handler extends the functionality of the {@linkcode FileHandler} by
 * "rotating" the log file when it reaches a certain size. `maxBytes` specifies
 * the maximum size in bytes that the log file can grow to before rolling over
 * to a new one. If the size of the new log message plus the current log file
 * size exceeds `maxBytes` then a roll-over is triggered. When a roll-over
 * occurs, before the log message is written, the log file is renamed and
 * appended with `.1`. If a `.1` version already existed, it would have been
 * renamed `.2` first and so on. The maximum number of log files to keep is
 * specified by `maxBackupCount`. After the renames are complete the log message
 * is written to the original, now blank, file.
 *
 * Example: Given `log.txt`, `log.txt.1`, `log.txt.2` and `log.txt.3`, a
 * `maxBackupCount` of 3 and a new log message which would cause `log.txt` to
 * exceed `maxBytes`, then `log.txt.2` would be renamed to `log.txt.3` (thereby
 * discarding the original contents of `log.txt.3` since 3 is the maximum number
 * of backups to keep), `log.txt.1` would be renamed to `log.txt.2`, `log.txt`
 * would be renamed to `log.txt.1` and finally `log.txt` would be created from
 * scratch where the new log message would be written.
 *
 * This handler uses a buffer for writing log messages to file. Logs can be
 * manually flushed with `fileHandler.flush()`. Log messages with a log level
 * greater than ERROR are immediately flushed. Logs are also flushed on process
 * completion.
 *
 * Additional notes on `mode` as described above:
 *
 * - `'a'` Default mode. As above, this will pick up where the logs left off in
 *   rotation, or create a new log file if it doesn't exist.
 * - `'w'` in addition to starting with a clean `filename`, this mode will also
 *   cause any existing backups (up to `maxBackupCount`) to be deleted on setup
 *   giving a fully clean slate.
 * - `'x'` requires that neither `filename`, nor any backups (up to
 *   `maxBackupCount`), exist before setup.
 *
 * This handler requires both `--allow-read` and `--allow-write` permissions on
 * the log files.
 */
export class RotatingFileHandler extends FileHandler {
    #maxBytes;
    #maxBackupCount;
    #currentFileSize = 0;
    constructor(levelName, options) {
        super(levelName, options);
        this.#maxBytes = options.maxBytes;
        this.#maxBackupCount = options.maxBackupCount;
    }
    async setup() {
        if (this.#maxBytes < 1) {
            this.destroy();
            throw new Error("maxBytes cannot be less than 1");
        }
        if (this.#maxBackupCount < 1) {
            this.destroy();
            throw new Error("maxBackupCount cannot be less than 1");
        }
        await super.setup();
        if (this._mode === "w") {
            // Remove old backups too as it doesn't make sense to start with a clean
            // log file, but old backups
            for (let i = 1; i <= this.#maxBackupCount; i++) {
                try {
                    await dntShim.Deno.remove(this._filename + "." + i);
                }
                catch (error) {
                    if (!(error instanceof dntShim.Deno.errors.NotFound)) {
                        throw error;
                    }
                }
            }
        }
        else if (this._mode === "x") {
            // Throw if any backups also exist
            for (let i = 1; i <= this.#maxBackupCount; i++) {
                if (await exists(this._filename + "." + i)) {
                    this.destroy();
                    throw new dntShim.Deno.errors.AlreadyExists("Backup log file " + this._filename + "." + i + " already exists");
                }
            }
        }
        else {
            this.#currentFileSize = (await dntShim.Deno.stat(this._filename)).size;
        }
    }
    log(msg) {
        const msgByteLength = this._encoder.encode(msg).byteLength + 1;
        if (this.#currentFileSize + msgByteLength > this.#maxBytes) {
            this.rotateLogFiles();
            this.#currentFileSize = 0;
        }
        super.log(msg);
        this.#currentFileSize += msgByteLength;
    }
    rotateLogFiles() {
        this._buf.flush();
        this._file.close();
        for (let i = this.#maxBackupCount - 1; i >= 0; i--) {
            const source = this._filename + (i === 0 ? "" : "." + i);
            const dest = this._filename + "." + (i + 1);
            if (existsSync(source)) {
                dntShim.Deno.renameSync(source, dest);
            }
        }
        this._file = dntShim.Deno.openSync(this._filename, this._openOptions);
        this._writer = this._file;
        this._buf = new BufWriterSync(this._file);
    }
}
