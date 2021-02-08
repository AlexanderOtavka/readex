import { readex } from "..";

test("Should have lower precedence than catenation", () => {
  expect(readex`"hello " "world" | "hello there"`).toBeMatchFor("hello world");
  expect(readex`"hello " "world" | "hello there"`).toBeMatchFor("hello there");
  expect(readex`"hello " "world" | "hello there"`).not.toBeMatchFor(
    "hello hello there"
  );
});
