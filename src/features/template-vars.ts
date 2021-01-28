import { Feature } from ".";
import { Token } from "../lex";
import { Nfa } from "../nfa";
import { Ast, ParseResult } from "../parse";
import { ReadExSyntaxError } from "../util.ts/errors";
import { StringNfa } from "./strings";
import { isReadEx } from "../util.ts/isReadEx";
import { ReadEx } from "../ReadEx";

export type TemplateVar = ReadEx | string | number;

export class TemplateVarsFeature implements Feature {
  parseTerm(tokens: Token[]): ParseResult<TemplateVarAst> {
    const firstToken = tokens[0];
    if (!isTemplateVarToken(firstToken)) {
      return null;
    }

    return {
      ast: new TemplateVarAst(firstToken.value),
      consumed: 1,
    };
  }
}

export class TemplateVarToken implements Token {
  readonly type = "TEMPLATE_VAR";

  public static of(value: TemplateVar): TemplateVarToken {
    return new TemplateVarToken(value);
  }

  private constructor(public value: TemplateVar) {}
}

function isTemplateVarToken(token: Token): token is TemplateVarToken {
  return token.type === "TEMPLATE_VAR";
}

export class TemplateVarAst implements Ast {
  constructor(public value: TemplateVar) {}

  toNfa(): Nfa {
    if (typeof this.value === "string") {
      return new StringNfa(this.value);
    } else if (isReadEx(this.value)) {
      return this.value.toNfa();
    } else {
      throw new ReadExSyntaxError(
        `Template variable must be a string or ReadEx, got: ` + `${this.value}`
      );
    }
  }
}
