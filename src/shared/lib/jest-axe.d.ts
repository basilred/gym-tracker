declare module 'jest-axe' {
  import { AxeResults } from 'axe-core';

  export function axe(html: HTMLElement | string): Promise<AxeResults>;
  export function configureAxe(axeOptions?: Record<string, unknown>): typeof axe;
}
