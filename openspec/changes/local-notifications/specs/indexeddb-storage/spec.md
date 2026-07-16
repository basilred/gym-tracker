### Requirement: System stores subscriptions in IndexedDB

The system SHALL store all subscription data in IndexedDB using the `idb` library. The database SHALL be named `gym-tracker` with schema version 2 and an object store named `subscriptions` with key path `id`.

#### Scenario: Storing a new subscription
- **WHEN** a user creates a new subscription
- **THEN** the system SHALL persist it to the `subscriptions` object store

#### Scenario: Reading all subscriptions
- **WHEN** the application initializes
- **THEN** the system SHALL read all subscriptions from IndexedDB

#### Scenario: Updating an existing subscription
- **WHEN** a user adds or removes a visit
- **THEN** the system SHALL update the corresponding subscription in IndexedDB

#### Scenario: Deleting a subscription
- **WHEN** a user deletes a subscription
- **THEN** the system SHALL remove it from IndexedDB

### Requirement: System migrates data from localStorage on first launch

The system SHALL check for existing data in localStorage under key `gym_subscriptions` on first launch. If found and `meta.migrated` is not set, the system SHALL copy all subscriptions to IndexedDB, set `meta.migrated = true`, and clear localStorage.

#### Scenario: Migrating valid localStorage data
- **WHEN** localStorage contains valid subscription data and no migration has occurred
- **THEN** the system SHALL copy all subscriptions to IndexedDB and set `meta.migrated = true`

#### Scenario: Skipping migration after first run
- **WHEN** `meta.migrated` is already `true`
- **THEN** the system SHALL read directly from IndexedDB and SHALL NOT access localStorage

#### Scenario: Handling corrupted localStorage data
- **WHEN** localStorage contains invalid JSON
- **THEN** the system SHALL ignore it and start with an empty IndexedDB

### Requirement: System validates schema version on open

The system SHALL validate the database schema version when connecting to IndexedDB and run upgrade handlers if needed.

#### Scenario: Opening database for the first time
- **WHEN** the database does not exist yet
- **THEN** the system SHALL create it with schema version 2 and the `subscriptions` and `meta` object stores

### Requirement: Tests use fake-indexeddb

The storage module SHALL be testable with `fake-indexeddb` to avoid requiring a real browser environment.

#### Scenario: Storage tests pass with fake-indexeddb
- **WHEN** running `vitest`
- **THEN** all storage module tests SHALL pass with `fake-indexeddb` as the IndexedDB implementation
