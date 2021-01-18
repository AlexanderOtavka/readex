import { ReadEx, ReadExArg } from "./ReadEx";

export function readex(
  strings: TemplateStringsArray,
  ...args: ReadExArg[]
): ReadEx {
  return ReadEx.fromTemplate(strings, args);
}
