import { readex } from "..";

test("Should match a simple string", () => {
  expect(readex`"hello there"`.doesMatch("hello there")).toBeTruthy();
});

test("Should not match a different string", () => {
  expect(readex`"hello there"`.doesMatch("General Kenobi")).toBeFalsy();
});
