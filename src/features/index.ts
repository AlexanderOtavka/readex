import { Lexer } from "../lex";
import { StringsFeature } from "./strings";

export interface Feature {
  lex?: Lexer;
}

export const features: Feature[] = [new StringsFeature];
