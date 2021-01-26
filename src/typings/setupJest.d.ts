export {};

declare global {
  const foo: string;

  namespace jest {
    interface Matchers<R> {
      toBeMatchFor(input: string): R
    }
  }
}
