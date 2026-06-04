## ADDED Requirements

### Requirement: Color tokens for text on colored backgrounds
The design token system SHALL provide dedicated tokens for text color on primary and danger backgrounds, ensuring they remain readable in both light and dark color schemes.

#### Scenario: Text on primary button in dark theme
- **WHEN** the user's system prefers dark color scheme
- **THEN** `--color-on-primary` SHALL resolve to `#ffffff` (white)

#### Scenario: Text on primary button in light theme
- **WHEN** the user's system prefers light color scheme
- **THEN** `--color-on-primary` SHALL resolve to `#ffffff` (white)

#### Scenario: Text on danger button in dark theme
- **WHEN** the user's system prefers dark color scheme
- **THEN** `--color-on-danger` SHALL resolve to `#ffffff` (white)

### Requirement: Input background color token
The design token system SHALL provide a dedicated token for input and select element backgrounds that visually distinguishes them from form surfaces in both color schemes.

#### Scenario: Input background in dark theme
- **WHEN** the user's system prefers dark color scheme
- **THEN** `--color-input-bg` SHALL resolve to a color darker than `--color-surface` (e.g., `#0f172a`)

#### Scenario: Input background in light theme
- **WHEN** the user's system prefers light color scheme
- **THEN** `--color-input-bg` SHALL resolve to `#ffffff` (white)

### Requirement: Input elements use dedicated background token
Input and select elements inside forms SHALL explicitly set `background-color: var(--color-input-bg)` instead of inheriting the body background.

#### Scenario: Input in dark theme is distinguishable from form
- **WHEN** the user's system prefers dark color scheme
- **AND** a form has `background-color: var(--color-surface)`
- **THEN** input elements within the form SHALL have a background color visually distinct from the form surface

### Requirement: Button text uses semantic on-color tokens
Buttons with colored backgrounds SHALL use the appropriate `--color-on-*` token for text color instead of `--color-surface`, ensuring contrast ratio of at least 4.5:1 in all color schemes.

#### Scenario: Primary button text contrast in dark theme
- **WHEN** the user's system prefers dark color scheme
- **AND** a button has `background-color: var(--color-primary)` (#3b82f6)
- **THEN** the button text SHALL use `color: var(--color-on-primary)` (#ffffff) for sufficient contrast

#### Scenario: Danger button text contrast in dark theme
- **WHEN** the user's system prefers dark color scheme
- **AND** a button has `background-color: var(--color-danger-bg)` (#dc2626)
- **THEN** the button text SHALL use `color: var(--color-on-danger)` (#ffffff) for sufficient contrast

### Requirement: ErrorBoundary fallback UI is styled
The ErrorBoundary component's error fallback SHALL render with CSS classes that provide consistent styling in both color schemes.

#### Scenario: Error fallback is presentable in dark theme
- **WHEN** the user's system prefers dark color scheme
- **AND** ErrorBoundary catches an error and renders the fallback
- **THEN** the fallback container, message text, and retry button SHALL be visually styled with appropriate colors from the design token system
