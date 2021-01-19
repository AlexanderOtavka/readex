import { Token } from "./lex";

export interface Ast {
  toNfa(): any;
}

export type ParseResult<T extends Ast> = {
  ast: T;
  consumed: number;
} | null;

export interface Parser<T extends Ast = Ast> {
  (tokens: Token[]): ParseResult<T>;
}
