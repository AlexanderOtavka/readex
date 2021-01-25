import { readex } from "..";

test.skip("Should match a word character", () => {
  expect(readex`wordChar`.doesMatch("z")).toBeTruthy();
  expect(readex`wordChar`.doesMatch("D")).toBeTruthy();
  expect(readex`wordChar`.doesMatch("3")).toBeTruthy();
  expect(readex`wordChar`.doesMatch("_")).toBeTruthy();
});
