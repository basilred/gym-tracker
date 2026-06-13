## ADDED Requirements

### Requirement: InlineEdit component in shared/ui

The `shared/ui/InlineEdit/` SHALL contain a presentational component that encapsulates the edit/view toggle pattern with textarea for editing and heading with trigger button for view mode.

#### Scenario: View mode shows name as heading with trigger
- **WHEN** `editing` is `false`
- **THEN** component SHALL render a heading of the specified level with a trigger button showing the value

#### Scenario: Edit mode shows textarea
- **WHEN** `editing` is `true`
- **THEN** component SHALL render a textarea with provided ref, value, onChange, onKeyDown, and onBlur

#### Scenario: Trigger click starts editing
- **WHEN** user clicks the trigger button
- **THEN** component SHALL call `onStartEditing` and prevent default action

#### Scenario: Textarea adjusts height on input
- **WHEN** user types in the textarea
- **THEN** component SHALL call `onAutoResize` after updating edit value

### Requirement: Component behavior is identical to current inline-edit

The component SHALL NOT change any user-observable behavior compared to the current inline-edit implementation in SubscriptionCard and SubscriptionDetail.

#### Scenario: Behavior preserved in SubscriptionCard
- **WHEN** user edits name in SubscriptionCard
- **THEN** Enter saves, Escape cancels, blur saves, auto-resize works — exactly as before

#### Scenario: Behavior preserved in SubscriptionDetail
- **WHEN** user edits name in SubscriptionDetail
- **THEN** Enter saves, Escape cancels, blur saves, auto-resize works — exactly as before
