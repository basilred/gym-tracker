## ADDED Requirements

### Requirement: All interactive elements are keyboard accessible

Every interactive element SHALL be reachable and operable via keyboard alone.

#### Scenario: Menu closes on Escape

- **WHEN** the subscription card menu is open and user presses Escape
- **THEN** the menu SHALL close and focus SHALL return to the menu toggle button

#### Scenario: Visit delete via keyboard

- **WHEN** a visit in the timeline is focused and user presses Delete or Backspace
- **THEN** the visit SHALL be removed (already implemented, covered by test)

#### Scenario: Focus-visible indicator on editable text

- **WHEN** the inline edit textarea in SubscriptionCard receives focus
- **THEN** a visible focus indicator SHALL be shown (outline or equivalent)

#### Scenario: Focus management after ErrorBoundary retry

- **WHEN** user clicks "Попробовать снова" in ErrorBoundary
- **THEN** focus SHALL be moved to a logical location (e.g., first interactive element)
