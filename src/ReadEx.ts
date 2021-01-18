export type ReadExArg = string | number | ReadEx;

export class ReadEx {
  public static fromTemplate(strings: TemplateStringsArray, args: ReadExArg[]) {
    return new ReadEx();
  }

  private constructor() {}

  public doesMatch(string: string): boolean {
    return true;
  }
}
