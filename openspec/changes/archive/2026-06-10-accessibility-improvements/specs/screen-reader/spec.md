## ADDED Requirements

### Requirement: Form inputs have associated labels

Every form input SHALL have an associated `<label>` element.

#### Scenario: Subscription name field has label

- **WHEN** NewSubscriptionForm renders
- **THEN** the subscription name `<input>` SHALL have an associated `<label>` element via `htmlFor`/`for` attribute

#### Scenario: All aria-labels use Russian

- **WHEN** any component renders an `aria-label` attribute
- **THEN** the label text SHALL be in Russian

### Requirement: Decorative icons are hidden from screen readers

Purely decorative SVG icons SHALL be hidden from assistive technology.

#### Scenario: SubscriptionCard menu icon hidden

- **WHEN** SubscriptionCard renders the SVG icon inside the menu toggle button
- **THEN** the SVG SHALL have `aria-hidden="true"`

### Requirement: Dynamic changes announce via aria-live

The application SHALL provide `aria-live` regions to announce dynamic content changes.

#### Scenario: Subscription created announcement

- **WHEN** a new subscription is created
- **THEN** a screen reader announcement SHALL be made (e.g., "Абонемент создан")

#### Scenario: Visit marked announcement

- **WHEN** a visit is marked
- **THEN** a screen reader announcement SHALL be made (e.g., "Посещение отмечено")

#### Scenario: Subscription deleted announcement

- **WHEN** a subscription is deleted
- **THEN** a screen reader announcement SHALL be made (e.g., "Абонемент удалён")
