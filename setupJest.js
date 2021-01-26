expect.extend({
  toBeMatchFor(matchable, input) {
    if (matchable.doesMatch(input)) {
      return {
        pass: true,
        message: () => `Expected ${matchable} to not match "${input}"`
      }
    } else {
      return {
        pass: false,
        message: () => `Expected ${matchable} to match "${input}"`
      }
    }
  }
});
