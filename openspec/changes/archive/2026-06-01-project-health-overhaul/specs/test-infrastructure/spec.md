# test-infrastructure Specification

## Purpose
Тестовая инфраструктура проекта на базе Vitest и React Testing Library, обеспечивающая покрытие всех хуков и компонентов.

## ADDED Requirements

### Requirement: Vitest test runner

The project SHALL use Vitest as the test runner, configured in `vite.config.js` with `test` block. The test environment SHALL be `jsdom` for component tests.

#### Scenario: Vitest is installed and configured
- **WHEN** `npm test` (or `npx vitest run`) is executed
- **THEN** Vitest discovers and runs all `*.test.{ts,tsx}` files in `src/`
- **AND** the `jsdom` environment is used for DOM-dependent tests

#### Scenario: Test configuration in vite.config.js
- **WHEN** vite.config.js is inspected
- **THEN** it contains a `test` property with `environment: 'jsdom'`, `globals: true`, and appropriate `include` patterns

### Requirement: React Testing Library for component tests

The project SHALL use `@testing-library/react` and `@testing-library/jest-dom` for component and hook testing. Tests SHALL simulate user interactions rather than testing implementation details.

#### Scenario: Component renders and interacts
- **WHEN** a test renders a component via `render(<Component />)`
- **THEN** assertions use `screen.getByRole`, `screen.getByText`, and `screen.getByLabelText` queries
- **AND** user events are dispatched via `@testing-library/user-event` or `fireEvent`

### Requirement: Hook testing with renderHook

Custom hooks SHALL be tested using `renderHook` from `@testing-library/react`. State changes SHALL be verified via `result.current` and `act()` wrappers.

#### Scenario: Testing a hook's state and actions
- **WHEN** `renderHook(() => useSubscriptions())` is called
- **THEN** `result.current.subscriptions` returns the initial state
- **AND** `act(() => result.current.addSubscription(...))` updates the state

### Requirement: localStorage mock for hook tests

Tests for hooks that depend on localStorage SHALL mock `localStorage` to avoid test pollution between runs. Each test SHALL reset localStorage state.

#### Scenario: localStorage is cleared between tests
- **WHEN** a test suite starts
- **THEN** `localStorage` is cleared via `beforeEach(() => localStorage.clear())` or equivalent
- **AND** no data leaks between test cases

### Requirement: Test file co-location

Test files SHALL be placed next to the source files they test with the `.test.ts` or `.test.tsx` extension. Each source file that contains logic SHALL have a corresponding test file.

#### Scenario: Component test file location
- **WHEN** a component `SubscriptionCard.tsx` exists in `src/components/`
- **THEN** its test file is `src/components/SubscriptionCard.test.tsx`

#### Scenario: Hook test file location
- **WHEN** a hook `useSubscriptions.ts` exists in `src/hooks/`
- **THEN** its test file is `src/hooks/useSubscriptions.test.ts`

### Requirement: Coverage thresholds

The project SHALL enforce minimum code coverage thresholds: 80% for branches and 80% for functions. Coverage SHALL be checked via `vitest run --coverage`.

#### Scenario: Coverage report on CI
- **WHEN** `npx vitest run --coverage` is executed
- **THEN** coverage statistics are reported for branches, functions, lines, and statements
- **AND** if coverage falls below 80% branches or 80% functions, the command exits with non-zero code

### Requirement: Test script in package.json

The project SHALL define `test` and `test:coverage` scripts in `package.json`.

#### Scenario: Running tests via npm
- **WHEN** `npm test` is executed
- **THEN** `vitest run` is invoked

#### Scenario: Running coverage via npm
- **WHEN** `npm run test:coverage` is executed
- **THEN** `vitest run --coverage` is invoked with coverage thresholds enforced
