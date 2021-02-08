import { readex } from "..";

test("Should match either one character or another", () => {
  expect(readex`"a" | "b"`).toBeMatchFor("a");
  expect(readex`"a" | "b"`).toBeMatchFor("b");
  expect(readex`"a" | "b"`).not.toBeMatchFor("c");
});

test("Should be okay with leading |", () => {
  expect(readex`| "a" | "b"`).toBeMatchFor("a");
  expect(readex`| "a" | "b"`).not.toBeMatchFor("c");

  expect(readex`| "a"`).toBeMatchFor("a");
  expect(readex`| "a"`).not.toBeMatchFor("b");
});

test("Should match different length strings", () => {
  expect(readex`"foo" | "much longer"`).toBeMatchFor("foo");
  expect(readex`"foo" | "much longer"`).toBeMatchFor("much longer");
  expect(readex`"foo" | "much longer"`).not.toBeMatchFor("foomuch longer");
});

test("Should match three options", () => {
  expect(readex`"foo" | "bar" | "baz"`).toBeMatchFor("foo");
  expect(readex`"foo" | "bar" | "baz"`).toBeMatchFor("bar");
  expect(readex`"foo" | "bar" | "baz"`).toBeMatchFor("baz");
  expect(readex`"foo" | "bar" | "baz"`).not.toBeMatchFor("biz");
});
