import { lex } from "../lex";
import { ReadExReferenceError } from "../util.ts/errors";
import { ConstantAst, ConstantsFeature, ConstantToken } from "./constants";

describe("ConstantsFeature.lex", () => {
  const feature = new ConstantsFeature();

  it("lexes a word", () => {
    expect(feature.lex("foo")).toEqual({
      token: new ConstantToken("foo"),
      consumed: 3,
    });
  });

  it("lexes another word", () => {
    expect(feature.lex("zil1_Bar")).toEqual({
      token: new ConstantToken("zil1_Bar"),
      consumed: 8,
    });
  });

  it("ignores stuff starting with number", () => {
    expect(feature.lex("5foo")).toBeNull();
  });

  it("ignores stuff starting with underscore", () => {
    expect(feature.lex("_foo")).toBeNull();
  });

  it("ignores quoted stuff", () => {
    expect(feature.lex("'foo'")).toBeNull();
  });

  it("stops at spaces", () => {
    expect(feature.lex("JAZ_BAR1 baz")).toEqual({
      token: new ConstantToken("JAZ_BAR1"),
      consumed: 8,
    });
  });
});

describe("ConstantsFeature.parse", () => {
  const feature = new ConstantsFeature();

  it("parses a real constant", () => {
    expect(feature.parseTerm(lex("wordChar"))).toEqual({
      ast: new ConstantAst("wordChar"),
      consumed: 1,
    });
  });
});

describe("ConstantAst.toNfa", () => {
  it("does not throw for known constants", () => {
    expect(() => new ConstantAst("wordChar").toNfa()).not.toThrow();
  });

  it("throws for unknown constants", () => {
    expect(() => new ConstantAst("foo").toNfa()).toThrow(ReadExReferenceError);
  });
});
