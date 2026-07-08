import 'react-router'

declare module 'react-router' {
  // oxlint-disable-next-line typescript/consistent-type-definitions
  interface NavigateFunction {
    (to: To, options?: NavigateOptions): void
    (delta: number): void
  }
}
