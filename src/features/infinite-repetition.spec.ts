import { lex } from "../lex";
import { parserMap } from "../parse";
import {
  InfiniteRepeatAst,
  InfiniteRepeatToken,
  InfiniteRepetitionFeature,
} from "./infinite-repetition";
import { StringAst } from "./strings";

describe("InfiniteRepetitionFeature.lex", () => {
  const feature = new InfiniteRepetitionFeature();

  it("lexes the * operator", () => {
    expect(feature.lex("*foo")).toEqual({
      token: new InfiniteRepeatToken(),
      consumed: 1,
    });
  });

  it("doesn't lex other symbols", () => {
    expect(feature.lex("&")).toBeNull();
    expect(feature.lex("%foo")).toBeNull();
    expect(feature.lex("@foo")).toBeNull();
  });
});

describe("InfiniteRepeatFeature.parseTerm", () => {
  const feature = new InfiniteRepetitionFeature();

  it("parses string repetition", () => {
    expect(feature.parseTerm(lex("*'foo'"), parserMap)).toEqual({
      ast: new InfiniteRepeatAst(new StringAst("foo")),
      consumed: 2,
    });
  });

  it("has higher precedence than catenation", () => {
    expect(feature.parseTerm(lex("*'bar' 'foo'"), parserMap)).toEqual({
      ast: new InfiniteRepeatAst(new StringAst("bar")),
      consumed: 2,
    });
  });
});
