import { features, } from "./features";

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

export interface Lexer<T extends Token = Token> {
  (code: string): LexResult<T>;
}

const lexers: Lexer[] = features
  .filter(feature => feature.lex)
  .map(feature => (code: string) => feature.lex!(code));

export function lex(code: string): Token[] {
  const tokens: Token[] = [];

  let i = 0;
  while (i < code.length) {
    if (code[0].match(/\s/)) {
      i++;
    } else {
      for (const lexer of lexers) {
        try {
          const result = lexer(code.substring(i))
          if (result) {
            tokens.push(result.token)
            i += result.consumed;
            break;
          }
        } catch (error) {
          if (error instanceof LexError) {
            error.addOffset(i)
          }
          throw error;
        }
      }
    }
  }

  return tokens;
}
