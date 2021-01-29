import { Feature } from ".";
import { LexResult, Token } from "../lex";
import { Nfa } from "../nfa";
import { Ast, ParseResult, ParserMap } from "../parse";
import { ReadExSyntaxError } from "../util.ts/errors";

export class InfiniteRepetitionFeature implements Feature {
  lex(code: string): LexResult<InfiniteRepeatToken> {
    if (code[0] !== "*") {
      return null;
    }

    return {
      token: new InfiniteRepeatToken(),
      consumed: 1,
    };
  }

  parseTerm(
    tokens: Token[],
    parsers: ParserMap
  ): ParseResult<InfiniteRepeatAst> {
    if (!(tokens[0] instanceof InfiniteRepeatToken)) {
      return null;
    }

    const expressionResult = parsers.parseTerm(tokens.slice(1), parsers);
    if (expressionResult === null) {
      throw new ReadExSyntaxError("* must be followed by a pattern");
    }

    return {
      ast: new InfiniteRepeatAst(expressionResult.ast),
      consumed: expressionResult.consumed + 1,
    };
  }
}

export class InfiniteRepeatToken implements Token {
  readonly type = "INFINITE_REPEAT";
}

export class InfiniteRepeatAst implements Ast {
  constructor(public expression: Ast) {}

  toNfa(): Nfa {
    return new InfiniteRepeatNfa(this.expression.toNfa());
  }
}

export class InfiniteRepeatNfa implements Nfa {
  constructor(public fullNfa: Nfa, public currentNfa: Nfa | null = null) {}

  executeStep(char: string): Nfa[] {
    const nfa = this.currentNfa || this.fullNfa;
    return nfa
      .executeStep(char)
      .map((nextNfa) =>
        nextNfa.isComplete()
          ? new InfiniteRepeatNfa(this.fullNfa)
          : new InfiniteRepeatNfa(this.fullNfa, nextNfa)
      );
  }

  isComplete(): boolean {
    return this.currentNfa === null;
  }
}
