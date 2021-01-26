import { readex } from "..";

test("Should match a word character", () => {
  expect(readex`wordChar`.doesMatch("z")).toBeTruthy();
  expect(readex`wordChar`.doesMatch("D")).toBeTruthy();
  expect(readex`wordChar`.doesMatch("3")).toBeTruthy();
  expect(readex`wordChar`.doesMatch("_")).toBeTruthy();
});

test("Should match a non-word character", () => {
  expect(readex`nonWordChar`.doesMatch("z")).toBeFalsy();
  expect(readex`nonWordChar`.doesMatch("D")).toBeFalsy();
  expect(readex`nonWordChar`.doesMatch("3")).toBeFalsy();
  expect(readex`nonWordChar`.doesMatch("_")).toBeFalsy();
});

test("Should match a digit character", () => {
  expect(readex`digit`.doesMatch("1")).toBeTruthy();
  expect(readex`digit`.doesMatch("9")).toBeTruthy();
});

test("Should match a non-digit character", () => {
  expect(readex`nonDigit`.doesMatch("1")).toBeFalsy();
  expect(readex`nonDigit`.doesMatch("9")).toBeFalsy();
});

test("Should match a whitespace character", () => {
  expect(readex`whitespace`.doesMatch(" ")).toBeTruthy();
  expect(readex`whitespace`.doesMatch("\n")).toBeTruthy();
  expect(readex`whitespace`.doesMatch("\t")).toBeTruthy();
  expect(readex`whitespace`.doesMatch("\r")).toBeTruthy();
});

test("Should match a non-whitespace character", () => {
  expect(readex`nonWhitespace`.doesMatch(" ")).toBeFalsy();
  expect(readex`nonWhitespace`.doesMatch("\n")).toBeFalsy();
  expect(readex`nonWhitespace`.doesMatch("\t")).toBeFalsy();
  expect(readex`nonWhitespace`.doesMatch("\r")).toBeFalsy();
});
