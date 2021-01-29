import { Feature } from ".";
import { Token } from "../lex";
import { Nfa } from "../nfa";
import { Ast, ParseResult, ParserMap } from "../parse";

export class CatenationFeature implements Feature {
  isInfixOperator = true;

  parseExpression(
    tokens: Token[],
    parsers: ParserMap
  ): ParseResult<CatenationAst | Ast> {
    const leftResult = parsers.parseTerm(tokens, parsers);
    if (!leftResult) {
      return null;
    }

    const rightTokens = tokens.slice(leftResult.consumed);
    const rightResult = parsers.parseExpression(rightTokens, parsers);
    if (!rightResult) {
      // This is a shortcut, since we may have done a lot of work parsing
      // leftResult, we return it instead of null. However, it will skip any
      // attempts to parse further features, so we need to make sure
      // CatenationFeature is at the back of the line for expression parsers in
      // features/index.ts
      return leftResult;
    }

    return {
      ast: new CatenationAst(leftResult.ast, rightResult.ast),
      consumed: leftResult.consumed + rightResult.consumed,
    };
  }
}

export class CatenationAst implements Ast {
  constructor(public left: Ast, public right: Ast) {}

  toNfa(): Nfa {
    return new CatenationNfa(this.left.toNfa(), this.right.toNfa());
  }
}

export class CatenationNfa implements Nfa {
  constructor(public left: Nfa, public right: Nfa) {}

  executeStep(char: string): Nfa[] {
    const leftBranches = this.left
      .executeStep(char)
      .map((steppedLeft) => new CatenationNfa(steppedLeft, this.right));

    if (this.left.isMatch()) {
      return [...leftBranches, ...this.right.executeStep(char)];
    } else {
      return leftBranches;
    }
  }

  isMatch(): boolean {
    return this.left.isMatch() && this.right.isMatch();
  }
}
