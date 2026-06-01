# bem-styling Delta Specification

## ADDED Requirements

### Requirement: Dark mode via prefers-color-scheme

The project SHALL support dark mode using the `prefers-color-scheme: dark` CSS media query. Design tokens in `tokens.css` SHALL define alternate values for dark mode within a `@media (prefers-color-scheme: dark)` block.

#### Scenario: System set to dark mode
- **WHEN** the user's operating system is set to dark color scheme
- **THEN** the application renders with dark background and light text
- **AND** all design tokens resolve to their dark-mode values

#### Scenario: System set to light mode
- **WHEN** the user's operating system is set to light color scheme
- **THEN** the application renders with the default light theme

#### Scenario: Dark mode token definition
- **WHEN** `tokens.css` is inspected
- **THEN** `:root` defines light-mode token values
- **AND** `@media (prefers-color-scheme: dark)` block defines overridden token values for dark mode
- **AND** tokens include at minimum: `--color-bg-primary`, `--color-bg-card`, `--color-text-primary`, `--color-text-secondary`, `--color-border`

### Requirement: Responsive layout breakpoints

The project SHALL use responsive CSS breakpoints to adapt the layout for larger screens. The primary breakpoint SHALL be 640px (`@media (min-width: 40rem)`) for tablet and desktop layouts.

#### Scenario: Desktop layout for subscription list
- **WHEN** the viewport is 640px or wider
- **THEN** subscription cards are displayed in a 2-column grid layout

#### Scenario: Desktop layout for subscription detail
- **WHEN** the viewport is 640px or wider
- **THEN** the detail page has a wider max-width (e.g., 40rem) for comfortable reading

#### Scenario: Mobile layout unchanged
- **WHEN** the viewport is narrower than 640px
- **THEN** all layouts remain single-column as currently implemented
