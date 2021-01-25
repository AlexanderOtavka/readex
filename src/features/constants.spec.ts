import { ConstantsFeature } from "./constants";

describe("ConstantsFeature.lex", () => {
  const feature = new ConstantsFeature();

  it("lexes a word", () => {
    expect(feature.lex("foo")).toEqual({
      token: { type: "CONSTANT", value: "foo" },
      consumed: 3,
    });
  });

  it("lexes another word", () => {
    expect(feature.lex("zil1_Bar")).toEqual({
      token: { type: "CONSTANT", value: "zil1_Bar" },
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
      token: { type: "CONSTANT", value: "JAZ_BAR1" },
      consumed: 8,
    });
  });
});
