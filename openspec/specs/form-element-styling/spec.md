## Requirements

### Requirement: Form elements use consistent baseline height

All native form elements (`input`, `select`, `textarea`, `button`) MUST render with identical height when given identical padding, border, and font-size.

#### Scenario: Select matches input height
- **WHEN** a `<select>` and an `<input type="text">` have the same CSS (`padding`, `font-size`, `line-height`, `border`)
- **THEN** their rendered heights MUST be equal within 1px

#### Scenario: Textarea matches input height
- **WHEN** a `<textarea>` and an `<input type="text">` have the same CSS (`padding`, `font-size`, `line-height`, `border`)
- **THEN** their rendered heights MUST be equal within 1px

### Requirement: Form elements suppress native browser appearance

All `input`, `select`, `textarea`, and `button` elements MUST have `appearance: none` (with vendor prefixes) applied globally.

#### Scenario: No native styling bleeds through
- **WHEN** inspecting computed styles of any `input`, `select`, `textarea`, or `button`
- **THEN** the `-webkit-appearance` property MUST be `none`

### Requirement: Select retains visible dropdown affordance

The `<select>` element MUST display a visible dropdown arrow indicator after native appearance is removed.

#### Scenario: Custom arrow is visible
- **WHEN** a `<select>` element is rendered in `NewSubscriptionForm`
- **THEN** it SHALL display a downward-pointing arrow at its right edge

#### Scenario: Arrow does not overlap text
- **WHEN** the longest option text ("16 занятий") is selected in the `<select>`
- **THEN** the text MUST NOT overlap with the dropdown arrow
