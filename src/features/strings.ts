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
        const token: StringToken = {
          type: "STRING",
          value: code.substring(1, i),
        };
        return {
          token,
          consumed: i + 1,
        };
      }
    }

    throw new ReadExSyntaxError("Unclosed string matcher");
  }

  parseTerm(tokens: Token[]): ParseResult<StringAst> {
    const firstToken = tokens[0];

    if (!isStringToken(firstToken)) {
      return null;
    }

    let value = firstToken.value;

    // Eat sequential string tokens to save work later
    let i = 1;
    while (i < tokens.length) {
      const currentToken = tokens[i];

      if (!isStringToken(currentToken)) {
        break;
      }

      value += currentToken.value;
      i++;
    }

    return {
      ast: new StringAst(value),
      consumed: i,
    };
  }
}

export interface StringToken extends Token {
  type: "STRING";
  value: string;
}

function isStringToken(token: Token): token is StringToken {
  return token.type === "STRING";
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

  isComplete(): boolean {
    return this.value === "";
  }
}
