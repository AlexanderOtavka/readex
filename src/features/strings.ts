import { Feature } from ".";
import { LexResult, Token } from "../lex";
import { Nfa } from "../nfa";
import { Ast, ParseResult } from "../parse";
import { ReadExSyntaxError } from "../util.ts/errors";

export class StringsFeature implements Feature {
  lex(code: string): LexResult<StringToken> {
    const quoteType = code[0];
    if (quoteType !== '"' && quoteType !== "'") {
      return null;
    }

    for (let i = 1; i < code.length; i++) {
      if (code[i] === quoteType) {
        return {
          token: new StringToken(code.substring(1, i)),
          consumed: i + 1,
        };
      }
    }

    throw new ReadExSyntaxError("Unclosed string matcher");
  }

  parseTerm(tokens: Token[]): ParseResult<StringAst> {
    const firstToken = tokens[0];

    if (!(firstToken instanceof StringToken)) {
      return null;
    }

    return {
      ast: new StringAst(firstToken.value),
      consumed: 1,
    };
  }
}

export class StringToken implements Token {
  readonly type = "STRING";
  constructor(public value: string) {}
}

export class StringAst implements Ast {
  constructor(public value: string) {}

  toNfa() {
    return new StringNfa(this.value);
  }
}

export class StringNfa implements Nfa {
  constructor(public value: string) {}

  executeStep(char: string): Nfa[] {
    if (char === this.value[0]) {
      return [new StringNfa(this.value.substring(1))];
    } else {
      return [];
    }
  }

  isMatch(): boolean {
    return this.value === "";
  }
}
