### Requirement: System detects stale subscriptions

The system SHALL detect subscriptions where the last visit was more than N days ago, where N is configured by the user (default: 7). Subscriptions with 0 visits SHALL be considered stale based on days since `startDate` exceeding N.

#### Scenario: Stale subscription triggers notification
- **WHEN** a subscription has its last visit 10 days ago and the threshold is 7
- **THEN** the system SHALL return a `stale` notification reason for that subscription

#### Scenario: Recent visit does not trigger
- **WHEN** a subscription has a visit within the threshold (e.g., 3 days ago, threshold 7)
- **THEN** the system SHALL NOT return a `stale` reason

#### Scenario: No visits and startDate exceeds threshold
- **WHEN** a subscription has 0 visits and 14 days since startDate, threshold 7
- **THEN** the system SHALL return a `stale` reason

### Requirement: System detects expired subscriptions

The system SHALL detect subscriptions where all sessions have been used (`visits.length >= totalSessions`).

#### Scenario: Expired subscription triggers notification
- **WHEN** a subscription has 12 visits and 12 totalSessions
- **THEN** the system SHALL return an `expired` notification reason

#### Scenario: Active subscription does not trigger
- **WHEN** a subscription has 8 visits and 12 totalSessions
- **THEN** the system SHALL NOT return an `expired` reason

### Requirement: System detects almost-finished subscriptions

The system SHALL detect subscriptions with 2 or fewer remaining sessions (`totalSessions - visits.length <= 2`).

#### Scenario: Almost finished triggers notification
- **WHEN** a subscription has 10 visits and 12 totalSessions
- **THEN** the system SHALL return an `almost-finished` notification reason

#### Scenario: Plenty of sessions left does not trigger
- **WHEN** a subscription has 4 visits and 12 totalSessions
- **THEN** the system SHALL NOT return an `almost-finished` reason

### Requirement: System detects milestone achievements

The system SHALL detect when a subscription reaches a milestone at exactly 50% or 100% of sessions completed, counting from the milestone's first achievement only.

#### Scenario: 50% milestone triggers
- **WHEN** a subscription has 6 visits and 12 totalSessions
- **THEN** the system SHALL return a `milestone` reason with `threshold: 50`

#### Scenario: 100% milestone triggers
- **WHEN** a subscription has 12 visits and 12 totalSessions and has not previously triggered 100%
- **THEN** the system SHALL return a `milestone` reason with `threshold: 100`

#### Scenario: Milestone does not re-trigger on subsequent visits
- **WHEN** a subscription triggered 50% milestone at 6 visits and has 7 visits now
- **THEN** the system SHALL NOT return a `milestone` reason for 50% again

### Requirement: System deduplicates notifications

The system SHALL NOT show duplicate notifications more than once per cooldown period (default: 6 hours).

#### Scenario: Notification suppressed during cooldown
- **WHEN** a notification was shown less than 6 hours ago and no new notification-worthy events occurred
- **THEN** the system SHALL return an empty list of reasons
