import { assertEquals } from "https://deno.land/std@0.101.0/testing/asserts.ts";
import { WritableStream } from "./WritableStream.ts";
import { Buffer } from "https://deno.land/std@0.101.0/node/buffer.ts";

Deno.test("should decode fragmented unicode characters", () => {
    let result = ""
    const ontext = (text: string) => { result = text }
    const stream = new WritableStream({ ontext });

    stream.write(Buffer.from("€"));
    stream.end();

    assertEquals(result, "€");
});
