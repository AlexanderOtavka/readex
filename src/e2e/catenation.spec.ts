import { readex } from "..";

test("Should match a string catenated with a constant", () => {
  expect(readex`"foo" digit`.doesMatch("foo1")).toBeTruthy();
  expect(readex`"foo" digit`.doesMatch("foo3")).toBeTruthy();
});

test("Should match a string catenated with two constants", () => {
  expect(readex`"foo" whitespace digit`.doesMatch("foo 1")).toBeTruthy();
  expect(readex`"foo" whitespace digit`.doesMatch("foo\t3")).toBeTruthy();
});

test("Should match catted empty strings with the empty string", () => {
  expect(readex`"" ""`.doesMatch("")).toBeTruthy();
  expect(readex`"" "" ""`.doesMatch("")).toBeTruthy();
});

test("Empty catted patterns shouldn't affect the pattern", () => {
  expect(readex`"" "foo"`.doesMatch("foo")).toBeTruthy();
  expect(readex`"" "foo" ""`.doesMatch("foo")).toBeTruthy();
  expect(readex`"foo" ""`.doesMatch("foo")).toBeTruthy();

  expect(readex`"" "bar"`.doesMatch("foo")).toBeFalsy();
  expect(readex`"" "bar" ""`.doesMatch("foo")).toBeFalsy();
  expect(readex`"bar" ""`.doesMatch("foo")).toBeFalsy();
});
