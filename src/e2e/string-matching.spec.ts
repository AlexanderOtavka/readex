import { readex } from "..";

test("Should match a simple string", () => {
  expect(readex`"hello there"`).toBeMatchFor("hello there");
});

test("Should not match a different string", () => {
  expect(readex`"hello there"`).not.toBeMatchFor("General Kenobi");
});

test("Should match an empty pattern with the empty string", () => {
  expect(readex`""`).toBeMatchFor("");
});

test("Should not match a nonempty pattern with the empty string", () => {
  expect(readex`"foo"`).not.toBeMatchFor("");
});

test("Should not match an empty pattern with a nonempty string", () => {
  expect(readex`""`).not.toBeMatchFor("foo");
});
