import { readex } from "..";

test("Should throw error for empty readex", () => {
  expect(() => readex``).toThrow(
    new SyntaxError(
      "Invalid readex ``: Cannot be empty, use `beginString endString` to match an empty string"
    )
  );
});

test("Should throw error for unclosed string matcher", () => {
  expect(() => readex`"hello there`).toThrow(
    new SyntaxError('Invalid readex `"hello there`: Unclosed string matcher')
  );
});

test.skip("Should report errors with template insertions", () => {
  expect(() => readex`${"foo"} "hello there`).toThrow(
    new SyntaxError(
      'Invalid readex `${...} "hello there`: Unclosed string matcher'
    )
  );
});
