import { readex } from "..";

test("Should match a string catenated with a constant", () => {
  expect(readex`"foo" digit`).toBeMatchFor("foo1");
  expect(readex`"foo" digit`).toBeMatchFor("foo3");
});

test("Should match a string catenated with two constants", () => {
  expect(readex`"foo" whitespace digit`).toBeMatchFor("foo 1");
  expect(readex`whitespace "foo" digit`).toBeMatchFor("\tfoo3");
  expect(readex`whitespace digit "foo"`).toBeMatchFor("\n9foo");
});

test("Empty catted patterns shouldn't affect the pattern", () => {
  expect(readex`"" digit`).toBeMatchFor("1");
  expect(readex`"" digit ""`).toBeMatchFor("1");
  expect(readex`digit ""`).toBeMatchFor("1");

  expect(readex`"" digit`).not.toBeMatchFor("f");
  expect(readex`"" digit ""`).not.toBeMatchFor("f");
  expect(readex`digit ""`).not.toBeMatchFor("f");

  expect(readex`"" digit`).not.toBeMatchFor("");
  expect(readex`"" digit ""`).not.toBeMatchFor("");
  expect(readex`digit ""`).not.toBeMatchFor("");
});
