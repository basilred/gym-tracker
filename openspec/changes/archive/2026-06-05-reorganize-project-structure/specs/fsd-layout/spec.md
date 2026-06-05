## ADDED Requirements

### Requirement: Target project structure follows FSD-light

The project SHALL be reorganised following Feature-Sliced Design methodology with layers: `app/`, `pages/`, `widgets/`, `features/`, `entities/`, `shared/`. Each layer SHALL only import from layers below it (app → pages → widgets → features → entities → shared).

#### Scenario: Layer dependency rule enforced
- **WHEN** any file in `app/`, `pages/`, `widgets/`, `features/`, or `entities/` is inspected
- **THEN** all its imports SHALL reference files from the same layer or layers below it (as defined by the layer hierarchy)
- **AND** no file SHALL import from a layer above it

### Requirement: Module structure with barrel files

Each module (every directory inside layers) SHALL contain:
- `ui/` — React components
- `index.ts` — barrel file re-exporting public API
- Optional subdirectories: `lib/` (utilities), `api/` (data access), `types.ts` (types)

#### Scenario: Barrel file exists
- **WHEN** a module directory is created inside any layer
- **THEN** it SHALL contain an `index.ts` barrel file re-exporting its public API

### Requirement: Entity subscription owns its types and logic

The `entities/subscription/` module SHALL contain:
- `types.ts` — `Subscription`, `Visit`, `SubscriptionStorage` interfaces
- `lib/calcProgress.ts` — progress calculation
- `lib/useSubscriptions.ts` — CRUD hook with localStorage persistence

#### Scenario: Types are colocated with entity
- **WHEN** a file needs `Subscription` or `Visit` types
- **THEN** it SHALL import from `entities/subscription/types` or via barrel
- **AND** no file SHALL import from a root-level `types.ts`

### Requirement: Features represent user actions

Each feature SHALL encapsulate a single user action. `features/create-subscription/` SHALL contain the subscription creation form. `features/mark-visit/` SHALL contain the "mark visit" button.

#### Scenario: Feature imports entity but not vice versa
- **WHEN** a feature component renders
- **THEN** it SHALL import types and hooks from `entities/subscription/`
- **AND** no `entities/` file SHALL import from `features/`

### Requirement: Shared layer for infra code

The `shared/` layer SHALL contain code without business logic: `shared/ui/ErrorBoundary/`, `shared/styles/tokens.css`.

#### Scenario: Shared has no business logic
- **WHEN** a file in `shared/` is inspected
- **THEN** it SHALL NOT import from `entities/`, `features/`, `widgets/`, `pages/`, or `app/`
