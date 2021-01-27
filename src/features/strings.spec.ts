import { lex } from "../lex";
import { ReadExSyntaxError } from "../util.ts/ReadExSyntaxError";
import { StringAst, StringsFeature } from "./strings";

describe("StringsFeature.lex", () => {
  const feature = new StringsFeature();

  it("should pick out a double quote string", () => {
    expect(feature.lex('"hello there"')).toEqual({
      token: { type: "STRING", value: "hello there" },
      consumed: 13,
    });
  });

  it("should pick out a single quote string", () => {
    expect(feature.lex("'hello there'")).toEqual({
      token: { type: "STRING", value: "hello there" },
      consumed: 13,
    });
  });

  it("should ignore other things", () => {
    expect(feature.lex("hello there")).toBeNull();
  });

  it("should ignore single quotes in a double quote string", () => {
    expect(feature.lex('"isn\'t a problem"')).toEqual({
      token: { type: "STRING", value: "isn't a problem" },
      consumed: 17,
    });
  });

  it("should ignore double quotes in a single quote string", () => {
    expect(feature.lex("'is not a \"problem\"'")).toEqual({
      token: { type: "STRING", value: 'is not a "problem"' },
      consumed: 20,
    });
  });

  it("should ignore subsequent characters", () => {
    expect(feature.lex('"hello there" "... " "general kenobi"')).toEqual({
      token: { type: "STRING", value: "hello there" },
      consumed: 13,
    });
  });

  it("should error on unclosed strings", () => {
    expect(() => feature.lex('"hello there')).toThrow(ReadExSyntaxError);
  });
});

describe("StringsFeature.parse", () => {
  const feature = new StringsFeature();

  it("should convert a string to an equivalent ast", () => {
    expect(feature.parseTerm(lex('"hello there"'))).toEqual({
      ast: new StringAst("hello there"),
      consumed: 1,
    });
  });

  it("should ignore non-strings", () => {
    expect(
      feature.parseTerm([{ type: "FOO" }, ...lex('"hello there"')])
    ).toBeNull();
  });

  it("should convert multiple strings to a single ast", () => {
    expect(
      feature.parseTerm(lex('"hello " "there" " General Kenobi"'))
    ).toEqual({
      ast: new StringAst("hello there General Kenobi"),
      consumed: 3,
    });
  });
});
