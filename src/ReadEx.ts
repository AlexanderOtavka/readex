import { lex } from "./lex";
import { executeNfa, Nfa } from "./nfa";
import { parse } from "./parse";
import { ReadExSyntaxError } from "./util.ts/ReadExSyntaxError";

export type ReadExArg = string | number | ReadEx;

export class ReadEx {
  public static fromTemplate(
    codeSegments: TemplateStringsArray,
    args: ReadExArg[]
  ) {
    if (args.length > 0) {
      throw new Error("Template string args not supported yet");
    }

    try {
      const tokens = lex(codeSegments[0]);
      const ast = parse(tokens);
      return new ReadEx(ast.toNfa());
    } catch (error) {
      if (error instanceof ReadExSyntaxError) {
        throw new SyntaxError(`Invalid readex \`${codeSegments.join("${...}")}\`: ${error.message}`)
      } else {
        throw error
      }
    }
  }

  private constructor(private nfa: Nfa) {}

  public doesMatch(string: string): boolean {
    return executeNfa(this.nfa, string);
  }
}
