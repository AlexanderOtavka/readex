import { Feature } from ".";
import { LexError, LexResult, Token } from "../lex";

export interface StringToken {
  type: "STRING";
  value: string;
}

export function isStringToken(token: Token): token is StringToken {
  return token.type === "STRING";
}

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
}
