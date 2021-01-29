import { readex } from "..";

test("Should match zero or more repetitions of a string", () => {
  expect(readex`*"ha"`).toBeMatchFor("");
  expect(readex`*"ha"`).toBeMatchFor("ha");
  expect(readex`*"ha"`).toBeMatchFor("hahahahahahahaha");
});

test("Should match infinitely repeating empty string", () => {
  expect(readex`*""`).toBeMatchFor("");
});

test("Should not match partial repetitions of a string", () => {
  expect(readex`*"ha"`).not.toBeMatchFor("hahahahahahahah");
});
