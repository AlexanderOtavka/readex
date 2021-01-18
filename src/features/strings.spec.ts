import { LexError } from "../lex";
import { StringsFeature } from "./strings";

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
    expect(() => feature.lex('"hello there')).toThrow(LexError);
  });
});
