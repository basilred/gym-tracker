# use-subscriptions Delta Specification

## ADDED Requirements

### Requirement: Data structure validation on load

The hook SHALL validate the structure of parsed localStorage data. If the data is valid JSON but does not match the expected schema (missing required fields, wrong types), it SHALL be treated as corrupted and fall back to an empty array.

#### Scenario: Valid JSON with wrong structure
- **WHEN** localStorage contains valid JSON that is not an array (e.g., `"string"`, `{}`, `null`, `42`)
- **THEN** the hook returns an empty array `[]` as initial state
- **AND** the invalid data is removed from localStorage

#### Scenario: Array items missing required fields
- **WHEN** localStorage contains an array but items lack `id`, `name`, or `visits` fields
- **THEN** the hook returns an empty array `[]` as initial state
- **AND** the invalid data is removed from localStorage

#### Scenario: Correctly structured data loads normally
- **WHEN** localStorage contains an array of valid subscription objects
- **THEN** the hook returns the parsed subscriptions as initial state
- **AND** no data is removed from localStorage

### Requirement: Schema versioning for future migrations

The hook SHALL include a schema version identifier in the localStorage payload. When loading data, if the version does not match the current expected version, the hook SHALL either migrate or reset the data.

#### Scenario: Current schema version is stored
- **WHEN** the hook saves data to localStorage
- **THEN** the payload includes a `_schemaVersion` field with the current version number (starting at `1`)

#### Scenario: Data with matching schema version
- **WHEN** localStorage contains data with `_schemaVersion` matching the current version
- **THEN** the data is loaded normally

#### Scenario: Data with unknown future version
- **WHEN** localStorage contains data with a `_schemaVersion` higher than the current version
- **THEN** the hook returns an empty array `[]` as initial state
- **AND** a `console.warn` is emitted about the version mismatch
- **AND** the incompatible data is removed from localStorage
