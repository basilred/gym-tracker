## ADDED Requirements

### Requirement: One BEM block per CSS file

Each CSS file SHALL define classes for exactly one BEM block. A component that contains child components with their own BEM blocks SHALL keep each block in a separate CSS file.

#### Scenario: Component with child block
- **WHEN** a component renders child components that define their own `cn('ChildBlock')`
- **THEN** the child component has its own CSS file with classes scoped to `ChildBlock`
- **AND** the parent component's CSS file only contains classes scoped to the parent block

#### Scenario: Single block per file enforced
- **WHEN** a new CSS file is created
- **THEN** it contains classes for exactly one BEM block

### Requirement: Button element naming convention

All BEM elements representing interactive buttons SHALL use the suffix `Btn` in their element name (e.g., `SubmitBtn`, `DeleteBtn`, `RetryBtn`). Elements that are semantically links (anchor tags) SHALL NOT use the `Btn` suffix.

#### Scenario: Button element named with Btn suffix
- **WHEN** a `<button>` element is rendered within a BEM block
- **THEN** its BEM element name ends with `Btn` (e.g., `block('SaveBtn')`, not `block('SaveButton')` or `block('Save')`)

#### Scenario: Link element without Btn suffix
- **WHEN** an `<a>` element is rendered within a BEM block
- **THEN** its BEM element name does NOT end with `Btn` (e.g., `block('BackLink')`)

### Requirement: BEM modifier for visibility states

Custom visibility states that cannot be expressed with CSS pseudo-classes SHALL use BEM modifier classes instead of conditional rendering. The element SHALL remain in the DOM and visibility SHALL be controlled via CSS.

#### Scenario: Dropdown visibility controlled by modifier
- **WHEN** a dropdown menu is closed
- **THEN** the dropdown element is present in the DOM with `display: none` via CSS
- **AND** no conditional rendering is used to remove it from the DOM

#### Scenario: Dropdown opened via modifier
- **WHEN** a dropdown menu is opened
- **THEN** a BEM modifier class (e.g., `_expanded`) is added to the block or element
- **AND** the CSS rule for the modifier sets `display: block`

### Requirement: CSS elements must have CSS rules

Every BEM element referenced in a component's JSX via `cn('BlockName')('ElemName')` SHALL have at least one corresponding CSS rule in the component's CSS file. If no styling is needed, a minimal rule with no properties SHALL be present.

#### Scenario: Element used in JSX has CSS rule
- **WHEN** a component's JSX uses `block('SomeElement')` to generate a class name
- **THEN** the CSS file contains `.BlockName-SomeElement { }` or a rule with actual properties

## MODIFIED Requirements

### Requirement: CSS file per component

The project SHALL have a corresponding CSS file for each component that requires styling. All CSS files SHALL be imported once in `main.jsx`, not in individual component files.

#### Scenario: CSS file location
- **WHEN** a component `SubscriptionCard.jsx` exists in `src/components/`
- **THEN** its styles are defined in `src/components/SubscriptionCard.css`

#### Scenario: CSS imports are centralized
- **WHEN** the application builds
- **THEN** all component CSS files are imported from a single entry point (`main.jsx`), not from individual JSX files
- **AND** no `import './Component.css'` statements exist inside component files
