import { features } from "./features";
import { Token } from "./lex";
import { Nfa } from "./nfa";
import { ReadExSyntaxError } from "./util.ts/errors";

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

const expressionParsers: Parser[] = features
  .filter((feature) => feature.parseExpression)
  .map((feature) => (tokens, parserMap) =>
    feature.parseExpression!(tokens, parserMap)
  );

const termParsers: Parser[] = features
  .filter((feature) => feature.parseTerm)
  .map((feature) => (tokens, parserMap) =>
    feature.parseTerm!(tokens, parserMap)
  );

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
  if (tokens.length === 0) {
    throw new ReadExSyntaxError(
      "Cannot be empty, use `beginString endString` to match an empty string"
    );
  }

  const parseResult = parserMap.parseExpression(tokens, parserMap);

  if (!parseResult) {
    throw new ReadExSyntaxError(`Couldn't parse ${tokens[0].type} token`);
  }

  if (parseResult.consumed < tokens.length) {
    throw new ReadExSyntaxError(
      `Couldn't parse entire expression, failing at ${
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
