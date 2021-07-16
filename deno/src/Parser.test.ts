import { assert, assertEquals } from "https://deno.land/std@0.101.0/testing/asserts.ts";
import { Parser } from "./Parser.ts";
import Tokenizer from "./Tokenizer.ts";

Deno.test("should work without callbacks", () => {
    const cbs: Record<string, (t?: string) => void> = {};
    const p = new Parser(cbs, {
        xmlMode: true,
        lowerCaseAttributeNames: true,
    });

    p.end("<a foo><bar></a><!-- --><![CDATA[]]]><?foo?><!bar><boo/>boohay");
    p.write("foo");

    // Check for an error
    p.end();
    let err = false;
    cbs.onerror = () => (err = true);
    p.write("foo");
    assertEquals(err, true);
    err = false;
    p.end();
    assertEquals(err, true);

    p.reset();

    // Remove method
    cbs.onopentag = () => {
        /* Ignore */
    };
    p.write("<a foo");
    delete cbs.onopentag;
    p.write(">");

    // Pause/resume
    let processed = false;
    cbs.ontext = (t) => {
        assertEquals(t, "foo");
        processed = true;
    };
    p.pause();
    p.write("foo");
    assertEquals(processed, false);
    p.resume();
    assertEquals(processed, true);
    processed = false;
    p.pause();
    assertEquals(processed, false);
    p.resume();
    assertEquals(processed, false);
    p.pause();
    p.end("foo");
    assertEquals(processed, false);
    p.resume();
    assertEquals(processed, true);
});

Deno.test("should back out of numeric entities (#125)", () => {
    let finished = false;
    let text = "";
    const p = new Parser({
        ontext(data) {
            text += data;
        },
        onend() {
            finished = true;
        },
    });

    p.end("id=770&#anchor");

    assertEquals(finished, true);
    assertEquals(text, "id=770&#anchor");

    p.reset();
    text = "";
    finished = false;

    p.end("0&#xn");

    assertEquals(finished, true);
    assertEquals(text, "0&#xn");
});

Deno.test("should update the position", () => {
    const p = new Parser(null);

    p.write("foo");

    assertEquals(p.startIndex, 0);
    assertEquals(p.endIndex, 2);

    p.write("<bar>");

    assertEquals(p.startIndex, 3);
    assertEquals(p.endIndex, 7);
});

Deno.test("Parser should update the position when a single tag is spread across multiple chunks", () => {
    const p = new Parser(null);

    p.write("<div ");
    p.write("foo=bar>");

    assertEquals(p.startIndex, 0);
    assertEquals(p.endIndex, 12);
})

Deno.test("Parser should parse <__proto__>", () => {
    const p = new Parser(null);

    // Should not throw
    p.write("<__proto__>")
})

Deno.test("should support custom tokenizer", () => {
    class CustomTokenizer extends Tokenizer {}

    const p = new Parser(
        {
            onparserinit(parser: Parser) {
                // @ts-expect-error Accessing private tokenizer here
                assert(parser.tokenizer instanceof CustomTokenizer);
            },
        },
        { Tokenizer: CustomTokenizer }
    );

    p.end();
});
