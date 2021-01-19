import { Feature } from ".";
import { LexError, LexResult, Token } from "../lex";
import { Ast, ParseResult } from "../parse";

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

    throw new LexError("Unclosed string matcher", 0, code.length - 1);
  }

  parse(tokens: Token[]): ParseResult<StringAst> {
    const firstToken = tokens[0];

    if (!isStringToken(firstToken)) {
      return null;
    }

    let value = firstToken.value;

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
  return token && token.type === "STRING";
}

export class StringAst implements Ast {
  constructor(public value: string) {}

  toNfa() {
    throw new Error("not implemented");
  }
}
