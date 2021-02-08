import { lex } from "../lex";
import { parserMap } from "../parse";
import {
  AlternationAst,
  AlternationFeature,
  AlternationToken,
} from "./alternation";
import { StringAst } from "./strings";

describe("AlternationFeature.lex", () => {
  const feature = new AlternationFeature();

  it("should lex the | token", () => {
    expect(feature.lex("|")).toEqual({
      token: new AlternationToken(),
      consumed: 1,
    });
  });
});

describe("AlternationFeature.parseExpression", () => {
  const feature = new AlternationFeature();

  it("should parse two strings", () => {
    expect(feature.parseExpression(lex("'foo' | 'bar'"), parserMap)).toEqual({
      ast: new AlternationAst(new StringAst("foo"), new StringAst("bar")),
      consumed: 3,
    });
  });

  it("should parse three strings", () => {
    expect(
      feature.parseExpression(lex("'foo' | 'bar' | 'baz'"), parserMap)
    ).toEqual({
      ast: new AlternationAst(
        new StringAst("foo"),
        new AlternationAst(new StringAst("bar"), new StringAst("baz"))
      ),
      consumed: 5,
    });
  });
});
