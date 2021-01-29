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
  expect(readex`*"ha" " funny"`).not.toBeMatchFor("hahahahahahahah funny");
});

test("Should match catted repetition in front", () => {
  expect(readex`*" " "foo"`).toBeMatchFor("foo");
  expect(readex`*" " "foo"`).toBeMatchFor(" foo");
  expect(readex`*" " "foo"`).toBeMatchFor("      foo");

  expect(readex`*"ha" "ha, funny"`).toBeMatchFor("ha, funny");
  expect(readex`*"ha" "ha, funny"`).toBeMatchFor("haha, funny");
  expect(readex`*"ha" "ha, funny"`).toBeMatchFor("hahahahahahahahaha, funny");
});

test("Should match catted repetition behind", () => {
  expect(readex`"foo" *" "`).toBeMatchFor("foo");
  expect(readex`"foo" *" "`).toBeMatchFor("foo ");
  expect(readex`"foo" *" "`).toBeMatchFor("foo     ");
});

test("Should match catted repetition both in front and behind", () => {
  expect(readex`*" " "foo" *" "`).toBeMatchFor("foo");
  expect(readex`*" " "foo" *" "`).toBeMatchFor(" foo ");
  expect(readex`*" " "foo" *" "`).toBeMatchFor("     foo     ");
});
