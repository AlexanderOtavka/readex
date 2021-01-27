import { features } from "./features";
import { ReadExSyntaxError } from "./util.ts/errors";

export interface Token {
  type: string;
}

export type LexResult<T extends Token> = {
  token: T;
  consumed: number;
} | null;

export type Lexer<T extends Token = Token> = (code: string) => LexResult<T>;

const lexers: Lexer[] = features
  .filter((feature) => feature.lex)
  .map((feature) => (code: string) => feature.lex!(code));

export function lex(code: string): Token[] {
  const tokens: Token[] = [];

  let i = 0;
  while (i < code.length) {
    if (code[i].match(/\s/)) {
      i++;
    } else {
      let result: LexResult<Token> = null;
      for (const lexer of lexers) {
        result = lexer(code.substring(i));
        if (result) {
          break;
        }
      }

      if (!result) {
        throw new ReadExSyntaxError(`Unknown symbol: ${code[i]}`);
      }

      tokens.push(result.token);
      i += result.consumed;
    }
  }

  return tokens;
}
