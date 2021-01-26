import { features } from "./features";

export interface Token {
  type: string;
}

export type LexResult<T extends Token> = {
  token: T;
  consumed: number;
} | null;

export class LexError extends Error {
  public constructor(
    message: string,
    public start: number,
    public end: number
  ) {
    super(message);
  }

  public addOffset(offset: number) {
    this.start += offset;
    this.end += offset;
  }
}

export type Lexer<T extends Token = Token> = (code: string) => LexResult<T>;

const lexers: Lexer[] = features
  .filter(feature => feature.lex)
  .map(feature => (code: string) => feature.lex!(code));

export function lex(code: string): Token[] {
  const tokens: Token[] = [];

  let i = 0;
  while (i < code.length) {
    if (code[i].match(/\s/)) {
      i++;
    } else {
      let result: LexResult<Token> = null;
      for (const lexer of lexers) {
        try {
          result = lexer(code.substring(i));
          if (result) {
            break;
          }
        } catch (error) {
          if (error instanceof LexError) {
            error.addOffset(i);
          }
          throw error;
        }
      }

      if (!result) {
        throw new LexError(`Unknown symbol: \`${code[i]}\``, i, i + 1);
      }

      tokens.push(result.token);
      i += result.consumed;
    }
  }

  return tokens;
}
