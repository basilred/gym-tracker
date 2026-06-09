## ADDED Requirements

### Requirement: ESLint enforces FSD layer boundaries

The project SHALL use `@feature-sliced/eslint-config` (official FSD core-team package) to automatically enforce FSD layer dependency rules. This config under the hood uses `eslint-plugin-boundaries` for layer hierarchy and `eslint-plugin-import` for public API checks.

#### Scenario: Layer rule violations are errors
- **WHEN** a file imports from a layer above it (e.g., `entities/` imports from `features/`)
- **THEN** ESLint SHALL report an error with a message describing the layer violation

#### Scenario: Allowed cross-layer imports pass
- **WHEN** a file imports from the same layer or layers below it
- **THEN** ESLint SHALL NOT report any boundary violations

### Requirement: ESLint allows horizontal widget imports

The ESLint configuration SHALL explicitly permit horizontal imports within the `widgets/` layer (widget-to-widget imports), as this is an accepted pattern in the project's FSD-light approach.

#### Scenario: Widget imports another widget
- **WHEN** a file in `widgets/` imports from another file in `widgets/`
- **THEN** ESLint SHALL allow this import without errors

### Requirement: ESLint enforces public API imports

The `@feature-sliced/eslint-config` SHALL enforce that slices are imported only through their public API (barrel files), not through internal paths.

#### Scenario: Direct internal import is an error
- **WHEN** a file imports from a slice's internal file (e.g., `features/create-subscription/ui/NewSubscriptionForm`)
- **THEN** ESLint SHALL report an error
- **AND** suggest importing from the slice root (e.g., `features/create-subscription`)

#### Scenario: Import through barrel passes
- **WHEN** a file imports from a slice root (e.g., `entities/subscription`)
- **THEN** ESLint SHALL NOT report any public API violations

#### Scenario: Shared segment imports allowed
- **WHEN** a file imports directly from `shared/lib/` or `shared/ui/`
- **THEN** ESLint SHALL allow it (Shared layer has no slices, segments are its public API)

### Requirement: Import ordering is enforced

The `@feature-sliced/eslint-config` SHALL enforce consistent import ordering across the project.

#### Scenario: Imports are grouped by type
- **WHEN** inspecting any source file
- **THEN** external imports come first, then internal project imports, then CSS imports
- **AND** linting SHALL report errors for incorrect import order

### Requirement: ESLint configuration is in eslint.config.js

The `@feature-sliced/eslint-config` SHALL be configured in the existing `eslint.config.js` file, following the project's flat config format.

#### Scenario: Package installed and configured
- **WHEN** running `npx eslint src/`
- **THEN** the FSD rules SHALL be active
- **AND** SHALL NOT produce false positives for allowed imports

#### Scenario: Alias configured correctly
- **WHEN** `@feature-sliced/eslint-config` is initialized
- **THEN** it SHALL recognize the `@/` alias mapping to `src/`
- **AND** SHALL NOT report false positives for `@/` imports
