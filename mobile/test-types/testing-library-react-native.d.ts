declare module "@testing-library/react-native" {
  import type { ComponentType, ReactElement, ReactNode } from "react";

  export type RenderResult = {
    unmount: () => void;
    rerender: (element: ReactElement) => void;
  };

  export type RenderHookResult<TResult> = {
    result: {
      current: TResult;
    };
    unmount: () => void;
    rerender: (element: ReactElement) => void;
  };

  export function render(
    element: ReactElement,
    options?: {
      wrapper?: ComponentType<{ children: ReactNode }>;
    },
  ): RenderResult;

  export function renderHook<TResult>(
    callback: () => TResult,
    options?: {
      wrapper?: ComponentType<{ children: ReactNode }>;
    },
  ): RenderHookResult<TResult>;

  export function waitFor<T>(
    expectation: () => T | Promise<T>,
    options?: { timeout?: number },
  ): Promise<T>;

  export const fireEvent: {
    press: (element: unknown) => void;
  };

  export const screen: {
    getByText: (text: string) => unknown;
    queryByText: (text: string) => unknown;
    findByText: (text: string) => Promise<unknown>;
  };
}
