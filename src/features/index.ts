import { Lexer } from "../lex";
import { Parser } from "../parse";
import { StringsFeature } from "./strings";

export interface Feature {
  lex?: Lexer;
  parseExpression?: Parser;
  parseTerm?: Parser;
}

export const features: Feature[] = [new StringsFeature()];
