## ADDED Requirements

### Requirement: MarkVisitButton has own BEM block

The `MarkVisitButton` component SHALL define its own BEM block `MarkVisitButton` instead of using `SubscriptionDetail`. It SHALL have its own CSS file with styles for the component.

#### Scenario: MarkVisitButton uses own cn()
- **WHEN** the `MarkVisitButton` component renders
- **THEN** it uses `cn('MarkVisitButton')` for its BEM class names
- **AND** it does not reference `SubscriptionDetail` at all

#### Scenario: MarkVisitButton styles are in own CSS
- **WHEN** the application loads
- **THEN** `MarkVisitButton.css` is imported from `main.tsx`
- **AND** `MarkVisitButton.css` contains `.MarkVisitButton-Actions` and `.MarkVisitButton-MarkBtn` rules

#### Scenario: SubscriptionDetail styles no longer include mark classes
- **WHEN** `SubscriptionDetail.css` is inspected
- **THEN** it no longer contains `.SubscriptionDetail-Actions` or `.SubscriptionDetail-MarkBtn` rules
