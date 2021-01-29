import { readex } from "..";

test("Should match a readex composed inside another readex", () => {
  const inner = readex`digit digit`;
  expect(readex`"foo " ${inner} " " digit digit digit`).toBeMatchFor(
    "foo 69 420"
  );
});

test("Should match a string composed inside a readex", () => {
  const inner = "bar";
  expect(readex`"foo " ${inner} " " digit digit digit`).toBeMatchFor(
    "foo bar 420"
  );
});
