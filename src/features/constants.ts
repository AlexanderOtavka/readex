import { Feature } from ".";
import { LexResult, Token } from "../lex";
import { CompleteNfa, Nfa } from "../nfa";
import { Ast, ParseResult } from "../parse";
import { ReadExReferenceError } from "../util.ts/errors";

type Matcher = (char: string) => boolean;

export const constants: { [name: string]: Matcher } = {
  wordChar: (char) => /\w/.test(char),
  nonWordChar: (char) => /\W/.test(char),
  digit: (char) => /\d/.test(char),
  nonDigit: (char) => /\D/.test(char),
  whitespace: (char) => /\s/.test(char),
  nonWhitespace: (char) => /\S/.test(char),
};

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

  parseTerm(tokens: Token[]): ParseResult<ConstantAst> {
    const firstToken = tokens[0];
    if (!isConstantToken(firstToken)) {
      return null;
    }

    return {
      ast: new ConstantAst(firstToken.value),
      consumed: 1,
    };
  }
}

export interface ConstantToken extends Token {
  type: "CONSTANT";
  value: string;
}

function isConstantToken(token: Token): token is ConstantToken {
  return token.type === "CONSTANT";
}

export class ConstantAst implements Ast {
  constructor(public name: string) {}

  toNfa(): Nfa {
    if (!(this.name in constants)) {
      throw new ReadExReferenceError(`Unknown constant: ${this.name}`);
    } else {
      return new ConstantNfa(constants[this.name]);
    }
  }
}

export class ConstantNfa implements Nfa {
  constructor(public matcher: Matcher) {}

  executeStep(char: string): Nfa[] {
    if (this.matcher(char)) {
      return [new CompleteNfa()];
    } else {
      return [];
    }
  }

  isMatch(): boolean {
    return false;
  }
}
