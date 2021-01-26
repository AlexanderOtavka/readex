import { readex } from "..";

test("Should match a simple string", () => {
  expect(readex`"hello there"`.doesMatch("hello there")).toBeTruthy();
});

test("Should not match a different string", () => {
  expect(readex`"hello there"`.doesMatch("General Kenobi")).toBeFalsy();
});

test("Should match an empty pattern with the empty string", () => {
  expect(readex`""`.doesMatch("")).toBeTruthy();
});

test("Should not match a nonempty pattern with the empty string", () => {
  expect(readex`"foo"`.doesMatch("")).toBeFalsy();
});

test("Should not match an empty pattern with a nonempty string", () => {
  expect(readex`""`.doesMatch("foo")).toBeFalsy();
});
