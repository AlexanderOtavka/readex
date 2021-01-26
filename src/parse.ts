import { features } from "./features";
import { Token } from "./lex";
import { Nfa } from "./nfa";

export interface Ast {
  toNfa(): Nfa;
}

export type ParseResult<T extends Ast> = {
  ast: T;
  consumed: number;
} | null;

export type Parser<T extends Ast = Ast> = (
  tokens: Token[],
  parserMap: ParserMap
) => ParseResult<T>;

export interface ParserMap {
  parseExpression: Parser;
  parseTerm: Parser;
}

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
  }
}

const expressionParsers: Parser[] = features
  .filter(feature => feature.parseExpression)
  .map(feature => (tokens, parserMap) =>
    feature.parseExpression!(tokens, parserMap)
  );

const termParsers: Parser[] = features
  .filter(feature => feature.parseTerm)
  .map(feature => (tokens, parserMap) => feature.parseTerm!(tokens, parserMap));

export const parserMap: ParserMap = {
  parseExpression: (tokens, parserMap) =>
    parseWithParsers(
      tokens,
      [...expressionParsers, parserMap.parseTerm],
      parserMap
    ),
  parseTerm: (tokens, parserMap) =>
    parseWithParsers(tokens, termParsers, parserMap),
};

export function parse(tokens: Token[]): Ast {
  const parseResult = parserMap.parseExpression(tokens, parserMap);

  if (!parseResult) {
    throw new ParseError(
      `Couldn't match ${tokens[0].type} token with a parser`
    );
  }

  if (parseResult.consumed < tokens.length) {
    throw new ParseError(
      `Couldn't match entire expression, failing at ${
        tokens[parseResult.consumed].type
      }`
    );
  }

  return parseResult.ast;
}

function parseWithParsers(
  tokens: Token[],
  parsers: Parser[],
  parserMap: ParserMap
): ParseResult<Ast> {
  if (tokens.length === 0) {
    return null;
  }

  for (const parser of parsers) {
    const parseResult = parser(tokens, parserMap);
    if (parseResult) {
      return parseResult;
    }
  }

  return null;
}
