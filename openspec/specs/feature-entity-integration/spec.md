## ADDED Requirements

### Requirement: Feature imports entity directly

Each feature in `features/` SHALL import business logic from `entities/` directly, rather than receiving callbacks and data exclusively through props from parent components.

#### Scenario: NewSubscriptionForm uses useSubscriptions
- **WHEN** `NewSubscriptionForm` is rendered
- **THEN** it SHALL call `useSubscriptions()` internally from `entities/subscription`
- **AND** SHALL NOT require `onAdd` callback prop

#### Scenario: MarkVisitButton uses useSubscriptions
- **WHEN** `MarkVisitButton` is rendered with a subscription ID
- **THEN** it SHALL call `useSubscriptions()` internally from `entities/subscription`
- **AND** SHALL NOT require `onAddVisit` callback prop
- **AND** SHALL compute `remaining` internally from subscription data

#### Scenario: Pages become thinner
- **WHEN** inspecting `pages/home/` and `pages/subscription-page/`
- **THEN** they SHALL NOT pass `useSubscriptions` callbacks as props to feature components
- **AND** they SHALL only pass the minimum required props (e.g., subscription ID for identification)

### Requirement: Feature barrel exports self-contained component

Each feature's barrel file (`index.ts`) SHALL export a component that works without external data wiring.

#### Scenario: Feature component testable in isolation
- **WHEN** a feature component is rendered in a test without parent context
- **THEN** it SHALL function correctly by using entities internally

### Requirement: Feature has model segment for local state

Each feature MAY contain a `model/` segment if it has feature-specific state logic beyond what entities provide. Otherwise, the hook call lives directly in the component.

#### Scenario: No model needed for simple features
- **WHEN** a feature only calls `useSubscriptions()` without additional state logic
- **THEN** the hook call SHALL be in the UI component, without creating a separate `model/` segment
