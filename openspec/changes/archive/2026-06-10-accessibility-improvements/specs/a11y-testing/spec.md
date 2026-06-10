## ADDED Requirements

### Requirement: Automated a11y regression tests

The project SHALL use vitest-axe to automatically detect accessibility violations in every page and key component.

#### Scenario: Home page has no a11y violations

- **WHEN** running vitest-axe on the rendered Home page
- **THEN** `expect(await axe(container)).toHaveNoViolations()` SHALL pass

#### Scenario: Subscription page has no a11y violations

- **WHEN** running vitest-axe on the rendered SubscriptionPage
- **THEN** `expect(await axe(container)).toHaveNoViolations()` SHALL pass

#### Scenario: NewSubscriptionForm has no a11y violations

- **WHEN** running vitest-axe on NewSubscriptionForm
- **THEN** `expect(await axe(container)).toHaveNoViolations()` SHALL pass

#### Scenario: SubscriptionCard has no a11y violations

- **WHEN** running vitest-axe on SubscriptionCard
- **THEN** `expect(await axe(container)).toHaveNoViolations()` SHALL pass

#### Scenario: VisitTimeline has no a11y violations

- **WHEN** running vitest-axe on VisitTimeline
- **THEN** `expect(await axe(container)).toHaveNoViolations()` SHALL pass

### Requirement: Targeted a11y assertions

Components SHALL have targeted assertions verifying specific accessibility properties beyond axe checks.

#### Scenario: Form label is associated

- **WHEN** testing NewSubscriptionForm
- **THEN** assertion SHALL verify `getByLabelText('Название абонемента')` finds the input

#### Scenario: List elements are semantic

- **WHEN** testing SubscriptionList
- **THEN** assertion SHALL verify `getByRole('list')` and `getAllByRole('listitem')` return expected elements

#### Scenario: Menu closes on Escape

- **WHEN** testing SubscriptionCard menu keyboard behavior
- **THEN** assertion SHALL verify menu closes and focus returns to toggle on Escape key press
