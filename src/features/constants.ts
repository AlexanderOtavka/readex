import { Feature } from ".";
import { LexResult, Token } from "../lex";
import { Nfa } from "../nfa";
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

    const [name] = code.match(/^\w+/)!;

    return {
      token: new ConstantToken(name),
      consumed: name.length,
    };
  }

  parseTerm(tokens: Token[]): ParseResult<ConstantAst> {
    const firstToken = tokens[0];
    if (!(firstToken instanceof ConstantToken)) {
      return null;
    }

    return {
      ast: new ConstantAst(firstToken.name),
      consumed: 1,
    };
  }
}

export class ConstantToken implements Token {
  readonly type = "CONSTANT";
  constructor(public name: string) {}
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
  constructor(public matcher: Matcher | null) {}

  executeStep(char: string): Nfa[] {
    if (this.matcher && this.matcher(char)) {
      return [new ConstantNfa(null)];
    } else {
      return [];
    }
  }

  isMatch(): boolean {
    return this.matcher === null;
  }
}
