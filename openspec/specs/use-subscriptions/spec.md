# use-subscriptions Specification

## Purpose
Хук для управления абонементами с хранением в localStorage. Обеспечивает CRUD-операции и устойчивость к повреждению/переполнению данных.
## Requirements
### Requirement: Устойчивость к повреждённым данным

Хук SHALL корректно обрабатывать ситуацию, когда данные в localStorage повреждены или невалидны, без краша приложения.

#### Scenario: Повреждённый JSON в localStorage

- **WHEN** при инициализации `localStorage` содержит невалидный JSON по ключу `gym_subscriptions`
- **THEN** хук возвращает пустой массив `[]` как начальное состояние
- **AND** повреждённые данные удаляются из localStorage

#### Scenario: Нет данных в localStorage

- **WHEN** при инициализации ключ `gym_subscriptions` отсутствует в localStorage
- **THEN** хук возвращает пустой массив `[]` как начальное состояние

### Requirement: Устойчивость к переполнению хранилища

Хук SHALL корректно обрабатывать ситуацию, когда localStorage переполнен при попытке сохранения.

#### Scenario: Квота localStorage превышена

- **WHEN** `localStorage.setItem` бросает исключение при попытке сохранения
- **THEN** исключение перехватывается и не приводит к крашу приложения
- **AND** в консоль выводится предупреждение (`console.warn`)

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

### Requirement: Update subscription fields

The hook SHALL provide a method to update specific fields of an existing subscription by its ID.

#### Scenario: Update subscription name

- **WHEN** `updateSubscription(id, { name: "New Name" })` is called with a valid subscription ID
- **THEN** the subscription with that ID has its name updated to "New Name"
- **AND** other fields (totalSessions, startDate, visits) remain unchanged

#### Scenario: Update non-existent subscription

- **WHEN** `updateSubscription(id, { name: "New Name" })` is called with an ID that does not match any subscription
- **THEN** no changes are made to the subscriptions array

#### Scenario: Update with empty name restores default

- **WHEN** `updateSubscription(id, { name: "" })` is called with a valid subscription ID and an empty string as the name
- **THEN** the subscription's name is set to a non-empty default value (e.g., `Абонемент ${date}`)

#### Scenario: Update preserves other subscriptions

- **WHEN** `updateSubscription(id, { name: "New" })` is called
- **THEN** subscriptions with other IDs are not modified

