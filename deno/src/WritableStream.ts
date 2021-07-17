import { Handler, Parser, ParserOptions } from "./Parser.ts";
import { Buffer, StringDecoder, Writable } from "./deps.ts";

// Following the example in https://nodejs.org/api/stream.html#stream_decoding_buffers_in_a_writable_stream
function isBuffer(_chunk: string | Buffer, encoding: string): _chunk is Buffer {
  return encoding === "buffer";
}

/**
 * WritableStream makes the `Parser` interface available as a NodeJS stream.
 *
 * @see Parser
 */
export class WritableStream extends Writable {
  private readonly _parser: Parser;
  private readonly _decoder = new StringDecoder();

  constructor(cbs: Partial<Handler>, options?: ParserOptions) {
    super({ decodeStrings: false });
    this._parser = new Parser(cbs, options);
    this._final = (
      callback: (error?: Error | null | undefined) => void,
    ) => {
      this._parser.end(this._decoder.end());
      callback();
    };
  }

  _write(chunk: string | Buffer, encoding: string, cb: () => void): void {
    this._parser.write(
      isBuffer(chunk, encoding) ? this._decoder.write(chunk) : chunk,
    );
    cb();
  }
}
