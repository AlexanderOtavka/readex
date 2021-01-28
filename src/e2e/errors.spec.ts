import { readex } from "..";

test("Should throw error for empty readex", () => {
  expect(() => readex``).toThrow(
    new SyntaxError(
      "Invalid readex ``: Cannot be empty, use `beginString endString` to match an empty string"
    )
  );
});

test("Should throw error for unknown symbol", () => {
  expect(() => readex`%`).toThrow(
    new SyntaxError("Invalid readex `%`: Unknown symbol: %")
  );
});

test("Should throw error for unclosed string matcher", () => {
  expect(() => readex`"hello there`).toThrow(
    new SyntaxError('Invalid readex `"hello there`: Unclosed string matcher')
  );
});

test("Should throw error for unknown constant", () => {
  expect(() => readex`foo`).toThrow(
    new ReferenceError("Invalid readex `foo`: Unknown constant: foo")
  );
});

test("Should show simple template args in errors", () => {
  expect(() => readex`${"foo"} ${readex`digit`} "hello there`).toThrow(
    new SyntaxError(
      'Invalid readex `${"foo"} ${...} "hello there`: Unclosed string matcher'
    )
  );
});

test("Should report errors with mistyped template insertions", () => {
  const obj = {} as any;
  expect(() => readex`"hello there" ${obj}`).toThrow(
    new SyntaxError(
      'Invalid readex `"hello there" ${[object Object]}`: ' +
        "Template variable must be a string or ReadEx, got: [object Object]"
    )
  );
});
