import { Lexer } from "../lex";
import { Parser } from "../parse";
import { CatenationFeature } from "./catenation";
import { ConstantsFeature } from "./constants";
import { StringsFeature } from "./strings";

export interface Feature {
  lex?: Lexer;
  parseExpression?: Parser;
  parseTerm?: Parser;
}

export const features: Feature[] = [
  new StringsFeature(),
  new ConstantsFeature(),

  // These must go last, since they take parsing shortcuts that might skip other
  // parsers in order to parse their infix operators without backtracking
  new CatenationFeature(),
];
