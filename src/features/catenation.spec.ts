import { lex } from "../lex";
import { parserMap } from "../parse";
import { CatenationAst, CatenationFeature } from "./catenation";
import { ConstantAst } from "./constants";

describe("CatenationFeature.parseExpression", () => {
  const feature = new CatenationFeature();

  it("should parse a constant catted with a constant", () => {
    expect(feature.parseExpression(lex("wordChar digit"), parserMap)).toEqual({
      ast: new CatenationAst(
        new ConstantAst("wordChar"),
        new ConstantAst("digit")
      ),
      consumed: 2,
    });
  });

  it("should parse a three catted constants", () => {
    expect(
      feature.parseExpression(lex("wordChar whitespace digit"), parserMap)
    ).toEqual({
      ast: new CatenationAst(
        new ConstantAst("wordChar"),
        new CatenationAst(
          new ConstantAst("whitespace"),
          new ConstantAst("digit")
        )
      ),
      consumed: 3,
    });
  });

  it("should shortcut when there is no catenation", () => {
    expect(feature.parseExpression(lex("wordChar"), parserMap)).toEqual({
      ast: new ConstantAst("wordChar"),
      consumed: 1,
    });
  });
});
