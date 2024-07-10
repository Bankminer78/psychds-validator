// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
import { Buffer } from "../io/buffer.js";
import { writeAll } from "./write_all.js";
/**
 * Create a `Reader` from a `ReadableStreamDefaultReader`.
 *
 * @example
 * ```ts
 * import { copy } from "https://deno.land/std@$STD_VERSION/streams/copy.ts";
 * import { readerFromStreamReader } from "https://deno.land/std@$STD_VERSION/streams/reader_from_stream_reader.ts";
 *
 * const res = await fetch("https://deno.land");
 * const file = await Deno.open("./deno.land.html", { create: true, write: true });
 *
 * const reader = readerFromStreamReader(res.body!.getReader());
 * await copy(reader, file);
 * file.close();
 * ```
 */
export function readerFromStreamReader(streamReader) {
    const buffer = new Buffer();
    return {
        async read(p) {
            if (buffer.empty()) {
                const res = await streamReader.read();
                if (res.done) {
                    return null; // EOF
                }
                await writeAll(buffer, res.value);
            }
            return buffer.read(p);
        },
    };
}
