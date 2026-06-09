## ADDED Requirements

### Requirement: Entity subscription has model segment

The `entities/subscription/` module SHALL have a `model/` segment containing stateful business logic and types, separate from `lib/` which SHALL contain pure utility functions.

#### Scenario: model contains useSubscriptions hook
- **WHEN** inspecting `entities/subscription/model/`
- **THEN** it SHALL contain `useSubscriptions.ts` with the React hook managing subscription state and CRUD operations

#### Scenario: model contains types
- **WHEN** inspecting `entities/subscription/model/`
- **THEN** it SHALL contain `types.ts` with `Subscription`, `Visit`, and `SubscriptionStorage` interfaces

#### Scenario: lib contains pure utilities
- **WHEN** inspecting `entities/subscription/lib/`
- **THEN** it SHALL contain `calcProgress.ts` — a pure function with no side effects or React hooks

#### Scenario: barrel exports both model and lib
- **WHEN** importing from `entities/subscription`
- **THEN** the barrel SHALL re-export `useSubscriptions`, `Subscription`, `Visit`, `calcProgress`
- **AND** SHALL NOT expose internal implementation details beyond the public API

#### Scenario: imports updated across project
- **WHEN** a file imports `useSubscriptions` or types from `entities/subscription`
- **THEN** the import path SHALL use the barrel (`entities/subscription`) or the specific segment (`entities/subscription/model/useSubscriptions`)
- **AND** no file SHALL import from the old path `entities/subscription/lib/useSubscriptions`

### Requirement: model segment has no side-effect imports from lib

The `model/` segment SHALL NOT depend on `lib/` segment within the same entity.

#### Scenario: useSubscriptions does not import calcProgress
- **WHEN** inspecting imports in `entities/subscription/model/useSubscriptions.ts`
- **THEN** it SHALL NOT import from `entities/subscription/lib/`
