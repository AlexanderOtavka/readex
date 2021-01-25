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
    expect(feature.lex("foo_Bar1")).toEqual({
      token: { type: "CONSTANT", value: "foo_Bar1" },
      consumed: 8,
    });
  });

  it("ignores quoted stuff", () => {
    expect(feature.lex("'foo'")).toBeNull();
  });

  it("stops at spaces", () => {
    expect(feature.lex("foo_Bar1 baz")).toEqual({
      token: { type: "CONSTANT", value: "foo_Bar1" },
      consumed: 8,
    });
  });
});
