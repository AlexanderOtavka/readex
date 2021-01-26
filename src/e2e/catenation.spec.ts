import { readex } from "..";

test("Should match a string catenated with a constant", () => {
  expect(readex`"foo" digit`.doesMatch("foo1")).toBeTruthy();
  expect(readex`"foo" digit`.doesMatch("foo3")).toBeTruthy();
});

test("Should match a string catenated with two constants", () => {
  expect(readex`"foo" whitespace digit`.doesMatch("foo 1")).toBeTruthy();
  expect(readex`whitespace "foo" digit`.doesMatch("\tfoo3")).toBeTruthy();
  expect(readex`whitespace digit "foo"`.doesMatch("\n9foo")).toBeTruthy();
});

test("Empty catted patterns shouldn't affect the pattern", () => {
  expect(readex`"" digit`.doesMatch("1")).toBeTruthy();
  expect(readex`"" digit ""`.doesMatch("1")).toBeTruthy();
  expect(readex`digit ""`.doesMatch("1")).toBeTruthy();

  expect(readex`"" digit`.doesMatch("f")).toBeFalsy();
  expect(readex`"" digit ""`.doesMatch("f")).toBeFalsy();
  expect(readex`digit ""`.doesMatch("f")).toBeFalsy();

  expect(readex`"" digit`.doesMatch("")).toBeFalsy();
  expect(readex`"" digit ""`.doesMatch("")).toBeFalsy();
  expect(readex`digit ""`.doesMatch("")).toBeFalsy();
});
