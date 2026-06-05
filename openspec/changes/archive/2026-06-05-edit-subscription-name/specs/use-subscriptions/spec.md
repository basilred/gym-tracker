## ADDED Requirements

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
