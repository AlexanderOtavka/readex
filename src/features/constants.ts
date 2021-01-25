import { Feature } from ".";
import { LexResult, Token } from "../lex";

export interface ConstantToken extends Token {
  type: "CONSTANT";
  value: string;
}

export class ConstantsFeature implements Feature {
  lex(code: string): LexResult<ConstantToken> {
    if (!code[0].match(/[a-z]/i)) {
      return null;
    }

    const [value] = code.match(/^\w+/)!;

    return {
      token: {
        type: "CONSTANT",
        value,
      },
      consumed: value.length,
    };
  }
}
