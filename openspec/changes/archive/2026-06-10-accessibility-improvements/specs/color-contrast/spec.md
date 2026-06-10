## ADDED Requirements

### Requirement: Color tokens meet WCAG AA contrast thresholds

The design token system SHALL define color values that pass WCAG AA contrast ratio (4.5:1 for normal text, 3:1 for large text and UI components) in both light and dark themes.

#### Scenario: Light theme text-secondary contrast

- **WHEN** viewing any component that uses `--color-text-secondary` in light theme
- **THEN** the contrast ratio between the text color and `--color-bg` (#f9fafb) SHALL be at least 4.5:1

#### Scenario: Light theme text-muted contrast

- **WHEN** viewing any component that uses `--color-text-muted` in light theme
- **THEN** the contrast ratio between the text color and `--color-bg` (#f9fafb) SHALL be at least 4.5:1

#### Scenario: Dark theme text-secondary contrast

- **WHEN** viewing any component that uses `--color-text-secondary` in dark theme
- **THEN** the contrast ratio between the text color and `--color-bg` (#1a1a2e) SHALL be at least 4.5:1

#### Scenario: Dark theme text-muted contrast

- **WHEN** viewing any component that uses `--color-text-muted` in dark theme
- **THEN** the contrast ratio between the text color and `--color-bg` (#1a1a2e) SHALL be at least 4.5:1

#### Scenario: Disabled state passes WCAG AA

- **WHEN** any component is in disabled state
- **THEN** the disabled text color SHALL have at least 4.5:1 contrast against its background in both themes
