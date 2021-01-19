import { lex } from "./lex";

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

    return new ReadEx();
  }

  private constructor() {}

  public doesMatch(string: string): boolean {
    return true;
  }
}
