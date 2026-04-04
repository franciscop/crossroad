declare module "react-test" {
  import { ReactElement } from "react";

  interface ReactTest {
    text(): string;
    find(selector: string): ReactTest;
    click(): Promise<void>;
    data(attribute: string): string | undefined;
    // Add other methods as needed
  }

  function $(element: ReactElement): ReactTest;

  export default $;

  declare module "vitest" {
    interface Assertion<T> {
      toHaveError(message: string): Assertion<T>;
      toHaveText(text: string): Assertion<T>;
      // Add any other custom assertions
    }
  }
}
