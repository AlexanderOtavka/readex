import { readex } from "..";

test("Should match a word character", () => {
  expect(readex`wordChar`).toBeMatchFor("z");
  expect(readex`wordChar`).toBeMatchFor("D");
  expect(readex`wordChar`).toBeMatchFor("3");
  expect(readex`wordChar`).toBeMatchFor("_");
});

test("Should match a non-word character", () => {
  expect(readex`nonWordChar`).not.toBeMatchFor("z");
  expect(readex`nonWordChar`).not.toBeMatchFor("D");
  expect(readex`nonWordChar`).not.toBeMatchFor("3");
  expect(readex`nonWordChar`).not.toBeMatchFor("_");
});

test("Should match a digit character", () => {
  expect(readex`digit`).toBeMatchFor("1");
  expect(readex`digit`).toBeMatchFor("9");
});

test("Should match a non-digit character", () => {
  expect(readex`nonDigit`).not.toBeMatchFor("1");
  expect(readex`nonDigit`).not.toBeMatchFor("9");
});

test("Should match a whitespace character", () => {
  expect(readex`whitespace`).toBeMatchFor(" ");
  expect(readex`whitespace`).toBeMatchFor("\n");
  expect(readex`whitespace`).toBeMatchFor("\t");
  expect(readex`whitespace`).toBeMatchFor("\r");
});

test("Should match a non-whitespace character", () => {
  expect(readex`nonWhitespace`).not.toBeMatchFor(" ");
  expect(readex`nonWhitespace`).not.toBeMatchFor("\n");
  expect(readex`nonWhitespace`).not.toBeMatchFor("\t");
  expect(readex`nonWhitespace`).not.toBeMatchFor("\r");
});
