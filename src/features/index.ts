import { Lexer } from "../lex";
import { Parser } from "../parse";
import { StringsFeature } from "./strings";

export interface Feature {
  lex?: Lexer;
  parse?: Parser;
}

export const features: Feature[] = [new StringsFeature()];
