import { lex } from "./lex";
import { executeNfa, Nfa } from "./nfa";
import { parse } from "./parse";

export type ReadExArg = string | number | ReadEx;

export class ReadEx {
  public static fromTemplate(
    codeSegments: TemplateStringsArray,
    args: ReadExArg[]
  ) {
    if (args.length > 0) {
      throw new Error("Template string args not supported yet");
    }

    const tokens = lex(codeSegments[0]);
    const ast = parse(tokens);

    return new ReadEx(ast.toNfa());
  }

  private constructor(private nfa: Nfa) {}

  public doesMatch(string: string): boolean {
    return executeNfa(this.nfa, string);
  }
}
