// Copyright 2018-2023 the Deno authors. All rights reserved. MIT license.
/**
 * Convert the generator function into a TransformStream.
 *
 * ```ts
 * import { readableStreamFromIterable } from "https://deno.land/std@$STD_VERSION/streams/readable_stream_from_iterable.ts";
 * import { toTransformStream } from "https://deno.land/std@$STD_VERSION/streams/to_transform_stream.ts";
 *
 * const readable = readableStreamFromIterable([0, 1, 2])
 *   .pipeThrough(toTransformStream(async function* (src) {
 *     for await (const chunk of src) {
 *       yield chunk * 100;
 *     }
 *   }));
 *
 * for await (const chunk of readable) {
 *   console.log(chunk);
 * }
 * // output: 0, 100, 200
 * ```
 *
 * @param transformer A function to transform.
 * @param writableStrategy An object that optionally defines a queuing strategy for the stream.
 * @param readableStrategy An object that optionally defines a queuing strategy for the stream.
 */
export function toTransformStream(transformer, writableStrategy, readableStrategy) {
    const { writable, readable, } = new TransformStream(undefined, writableStrategy);
    const iterable = transformer(readable);
    const iterator = iterable[Symbol.asyncIterator]?.() ??
        iterable[Symbol.iterator]?.();
    return {
        writable,
        readable: new ReadableStream({
            async pull(controller) {
                let result;
                try {
                    result = await iterator.next();
                }
                catch (error) {
                    // Propagate error to stream from iterator
                    // If the stream status is "errored", it will be thrown, but ignore.
                    await readable.cancel(error).catch(() => { });
                    controller.error(error);
                    return;
                }
                if (result.done) {
                    controller.close();
                    return;
                }
                controller.enqueue(result.value);
            },
            async cancel(reason) {
                // Propagate cancellation to readable and iterator
                if (typeof iterator.throw == "function") {
                    try {
                        await iterator.throw(reason);
                    }
                    catch {
                        /* `iterator.throw()` always throws on site. We catch it. */
                    }
                }
                await readable.cancel(reason);
            },
        }, readableStrategy),
    };
}
