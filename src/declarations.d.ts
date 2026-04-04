declare module "react-test";

declare namespace jest {
  interface Matchers<R> {
    toHaveError(message: string): R;
    toHaveText(text: string): R;
  }
}
