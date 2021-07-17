import { assertions } from "./deps.ts";
import Tokenizer from "./Tokenizer.ts";

class CallbackLogger {
  log: string[] = [];

  onattribdata(value: string) {
    this.log.push(`onattribdata: '${value}'`);
  }
  onattribend() {
    this.log.push(`onattribend`);
  }
  onattribname(name: string) {
    this.log.push(`onattribname: '${name}'`);
  }
  oncdata(data: string) {
    this.log.push(`oncdata: '${data}'`);
  }
  onclosetag(name: string) {
    this.log.push(`onclosetag: '${name}'`);
  }
  oncomment(data: string) {
    this.log.push(`oncomment: '${data}'`);
  }
  ondeclaration(content: string) {
    this.log.push(`ondeclaration: '${content}'`);
  }
  onend() {
    this.log.push(`onend`);
  }
  onerror(error: Error, state?: unknown) {
    this.log.push(`onerror: '${error}', '${state}'`);
  }
  onopentagend() {
    this.log.push(`onopentagend`);
  }
  onopentagname(name: string) {
    this.log.push(`onopentagname: '${name}'`);
  }
  onprocessinginstruction(instruction: string) {
    this.log.push(`onprocessinginstruction: '${instruction}'`);
  }
  onselfclosingtag() {
    this.log.push(`onselfclosingtag`);
  }
  ontext(value: string) {
    this.log.push(`ontext: '${value}'`);
  }
}

Deno.test("should support self-closing special tags", () => {
  const logger = new CallbackLogger();
  const tokenizer = new Tokenizer(
    {
      xmlMode: false,
      decodeEntities: false,
    },
    logger,
  );

  const selfClosingScriptInput = "<script /><div></div>";
  const selfClosingScriptOutput = [
    "onopentagname: 'script'",
    "onselfclosingtag",
    "onopentagname: 'div'",
    "onopentagend",
    "onclosetag: 'div'",
    "onend",
  ];

  tokenizer.write(selfClosingScriptInput);
  tokenizer.end();
  assertions.assertEquals(logger.log, selfClosingScriptOutput);
  tokenizer.reset();
  logger.log = [];

  const selfClosingStyleInput = "<style /><div></div>";
  const selfClosingStyleOutput = [
    "onopentagname: 'style'",
    "onselfclosingtag",
    "onopentagname: 'div'",
    "onopentagend",
    "onclosetag: 'div'",
    "onend",
  ];

  tokenizer.write(selfClosingStyleInput);
  tokenizer.end();
  assertions.assertEquals(logger.log, selfClosingStyleOutput);
  tokenizer.reset();
  logger.log = [];

  const selfClosingTitleInput = "<title /><div></div>";
  const selfClosingTitleOutput = [
    "onopentagname: 'title'",
    "onselfclosingtag",
    "onopentagname: 'div'",
    "onopentagend",
    "onclosetag: 'div'",
    "onend",
  ];

  tokenizer.write(selfClosingTitleInput);
  tokenizer.end();
  assertions.assertEquals(logger.log, selfClosingTitleOutput);
  tokenizer.reset();
  logger.log = [];
});

Deno.test("should support standard special tags", () => {
  const logger = new CallbackLogger();
  const tokenizer = new Tokenizer(
    {
      xmlMode: false,
      decodeEntities: false,
    },
    logger,
  );

  const normalScriptInput = "<script></script><div></div>";
  const normalScriptOutput = [
    "onopentagname: 'script'",
    "onopentagend",
    "onclosetag: 'script'",
    "onopentagname: 'div'",
    "onopentagend",
    "onclosetag: 'div'",
    "onend",
  ];

  tokenizer.write(normalScriptInput);
  tokenizer.end();
  assertions.assertEquals(logger.log, normalScriptOutput);
  tokenizer.reset();
  logger.log = [];

  const normalStyleInput = "<style></style><div></div>";
  const normalStyleOutput = [
    "onopentagname: 'style'",
    "onopentagend",
    "onclosetag: 'style'",
    "onopentagname: 'div'",
    "onopentagend",
    "onclosetag: 'div'",
    "onend",
  ];

  tokenizer.write(normalStyleInput);
  tokenizer.end();
  assertions.assertEquals(logger.log, normalStyleOutput);
  tokenizer.reset();
  logger.log = [];

  const normalTitleInput = "<title></title><div></div>";
  const normalTitleOutput = [
    "onopentagname: 'title'",
    "onopentagend",
    "onclosetag: 'title'",
    "onopentagname: 'div'",
    "onopentagend",
    "onclosetag: 'div'",
    "onend",
  ];

  tokenizer.write(normalTitleInput);
  tokenizer.end();
  assertions.assertEquals(logger.log, normalTitleOutput);
  tokenizer.reset();
  logger.log = [];
});
