### Requirement: System stores notification settings in IndexedDB

The system SHALL persist notification settings in the `meta` object store of IndexedDB under key `notificationSettings`.

#### Scenario: Saving notification settings
- **WHEN** a user toggles notification settings
- **THEN** the system SHALL persist them to IndexedDB

#### Scenario: Loading notification settings on init
- **WHEN** the application initializes
- **THEN** the system SHALL load notification settings from IndexedDB, falling back to defaults

### Requirement: System provides notification settings UI

The system SHALL render a settings modal with toggles for each notification type and a numeric input for the stale days threshold.

#### Scenario: Opening settings modal
- **WHEN** a user clicks the notification settings button
- **THEN** the system SHALL display a modal with current settings

#### Scenario: Changing stale days threshold
- **WHEN** a user changes the threshold from 7 to 14
- **THEN** the system SHALL update the persisted setting and use the new threshold

### Requirement: System requests notification permission

The system SHALL request notification permission using `Notification.requestPermission()` and SHALL respect the user's choice. If denied, the system SHALL show an explanatory message.

#### Scenario: User grants permission
- **WHEN** a user clicks "Allow" on the browser permission prompt
- **THEN** the system SHALL enable notifications and save the preference

#### Scenario: User denies permission
- **WHEN** a user clicks "Block" on the browser permission prompt
- **THEN** the system SHALL show a message explaining how to enable notifications in browser settings

### Requirement: System shows notifications via Notification API

When a notification-worthy event is detected, the system SHALL create a browser Notification with appropriate title and body in Russian.

#### Scenario: Showing stale notification
- **WHEN** the system detects a stale subscription
- **THEN** the system SHALL show "Давно не были в \u0022{name}\u0022!" with body "Прошло {days} дней с последнего посещения"

#### Scenario: Showing expired notification
- **WHEN** the system detects an expired subscription
- **THEN** the system SHALL show "Абонемент \u0022{name}\u0022 закончен!" with body "Все {total} занятий использовано"

#### Scenario: Showing almost finished notification
- **WHEN** the system detects an almost-finished subscription
- **THEN** the system SHALL show "\u0022{name}\u0022 скоро закончится" with body "Осталось {remaining} занятий"

#### Scenario: Showing milestone notification
- **WHEN** the system detects a 50% milestone
- **THEN** the system SHALL show "\u0022{name}\u0022: пройдено 50%!" with body "Вы прошли половину абонемента"
