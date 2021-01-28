import { lex } from "./lex";
import { executeNfa, Nfa } from "./nfa";
import { parse } from "./parse";
import { ReadExReferenceError, ReadExSyntaxError } from "./util.ts/errors";
import { TemplateVar, TemplateVarToken } from "./features/template-vars";

export type ReadExArg = TemplateVar;

export class ReadEx {
  public static fromTemplate(
    codeSegments: TemplateStringsArray, args: ReadExArg[]
  ) {
    try {
      const tokens = lex(codeSegments[0]);
      for (let i = 1; i < codeSegments.length; i++) {
        tokens.push(TemplateVarToken.of(args[i - 1]));
        tokens.push(...lex(codeSegments[i]));
      }

      const ast = parse(tokens);
      return new ReadEx(ast.toNfa());
    } catch (error) {
      if (error instanceof ReadExSyntaxError) {
        throw new SyntaxError(
          errorMessagePrefix(codeSegments, args) + error.message
        );
      } else if (error instanceof ReadExReferenceError) {
        throw new ReferenceError(
          errorMessagePrefix(codeSegments, args) + error.message
        );
      } else {
        throw error;
      }
    }
  }

  private constructor(private nfa: Nfa) {}

  public toNfa(): Nfa {
    return this.nfa;
  }

  public doesMatch(string: string): boolean {
    return executeNfa(this.nfa, string);
  }
}

function errorMessagePrefix(codeSegments: TemplateStringsArray, args: ReadExArg[]): string {
  let code = codeSegments[0]
  for (let i =1; i < codeSegments.length;i++) {
    code += "${"
    const arg = args[i-1]
    if (typeof arg === "string") {
      code += `"${arg}"`
    } else if (arg instanceof ReadEx) {
      code += "..."
    } else {
      code += arg
    }
    code += "}"

    code += codeSegments[i]
  }

  return `Invalid readex \`${code}\`: `
}
