import { readex } from "..";

test("Should not match partial repetitions followed by catenation", () => {
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
