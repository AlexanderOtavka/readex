import { Feature } from ".";
import { LexResult, Token } from "../lex";
import { Nfa } from "../nfa";
import { Ast, ParseResult, ParserMap } from "../parse";

export class AlternationFeature implements Feature {
  lex(code: string): LexResult<AlternationToken> {
    if (code[0] !== "|") {
      return null;
    }

    return {
      token: new AlternationToken(),
      consumed: 1,
    };
  }

  parseExpression(
    tokens: Token[],
    parsers: ParserMap
  ): ParseResult<AlternationAst | Ast> {
    const leadingConsumed = tokens[0] instanceof AlternationToken ? 1 : 0;
    const leadingTokens = tokens.slice(leadingConsumed);

    const leftResult = parsers.parseCatenation(leadingTokens, parsers);
    if (!leftResult) {
      return null;
    }

    if (!(leadingTokens[leftResult.consumed] instanceof AlternationToken)) {
      // This is a shortcut, since we may have done a lot of work parsing
      // leftResult, we return it instead of null. However, it will skip any
      // attempts to parse further features, so we need to make sure
      // AlternationFeature is at the back of the line for expression parsers in
      // features/index.ts
      return {
        ast: leftResult.ast,
        consumed: leadingConsumed + leftResult.consumed,
      };
    }

    const rightTokens = leadingTokens.slice(leftResult.consumed + 1);
    const rightResult = parsers.parseExpression(rightTokens, parsers);
    if (!rightResult) {
      // Same shortcut as above
      return {
        ast: leftResult.ast,
        consumed: leadingConsumed + leftResult.consumed,
      };
    }

    return {
      ast: new AlternationAst(leftResult.ast, rightResult.ast),
      consumed:
        leadingConsumed + leftResult.consumed + 1 + rightResult.consumed,
    };
  }
}

export class AlternationToken implements Token {
  readonly type = "ALTERNATION";
}

export class AlternationAst implements Ast {
  constructor(public left: Ast, public right: Ast) {}

  toNfa(): Nfa {
    return new AlternationNfa(this.left.toNfa(), this.right.toNfa());
  }
}

export class AlternationNfa implements Nfa {
  constructor(public left: Nfa, public right: Nfa) {}

  executeStep(char: string): Nfa[] {
    return [...this.left.executeStep(char), ...this.right.executeStep(char)];
  }

  isMatch(): boolean {
    return this.left.isMatch() || this.right.isMatch();
  }
}
