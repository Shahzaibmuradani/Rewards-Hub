declare namespace jest {
  type MockedFunction<T extends (...args: any[]) => any> = T & {
    mockReset(): MockedFunction<T>;
    mockImplementation(impl: T): MockedFunction<T>;
    mockReturnValue(value: ReturnType<T>): MockedFunction<T>;
    mockResolvedValue(value: Awaited<ReturnType<T>>): MockedFunction<T>;
    mockRejectedValue(value: unknown): MockedFunction<T>;
    mockClear(): MockedFunction<T>;
    mockRestore(): MockedFunction<T>;
  };
}

declare const jest: {
  mock: (moduleName: string, factory?: () => unknown) => void;
  fn: <T extends (...args: any[]) => any>(impl?: T) => jest.MockedFunction<T>;
  spyOn: (...args: any[]) => any;
  requireActual: <T = unknown>(moduleName: string) => T;
  clearAllMocks: () => void;
  resetAllMocks: () => void;
  setTimeout: (timeout: number) => void;
};

declare function describe(name: string, fn: () => void): void;
declare function beforeEach(fn: () => void): void;
declare function afterEach(fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function expect<T = unknown>(actual: T): any;

declare namespace expect {
  function objectContaining<T>(obj: T): any;
}
