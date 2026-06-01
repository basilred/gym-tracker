# accessibility Specification

## Purpose
Обеспечение соответствия Gym Tracker стандарту WCAG 2.1 уровня AA: клавиатурная доступность, поддержка скринридеров, семантическая вёрстка.

## ADDED Requirements

### Requirement: Accessible labels on all interactive elements

All interactive elements (buttons, links, inputs, selects) SHALL have an accessible name via `aria-label`, `aria-labelledby`, or associated `<label>`. Icon-only buttons SHALL use `aria-label`.

#### Scenario: Button with text
- **WHEN** a button contains visible text (e.g., "Отметить посещение")
- **THEN** the button is accessible via its text content without additional attributes

#### Scenario: Icon-only button
- **WHEN** a button contains only an icon or symbol with no visible text (e.g., "✕", "…")
- **THEN** it has an `aria-label` attribute describing its action (e.g., `aria-label="Удалить"`, `aria-label="Меню"`)

### Requirement: Focus visible styles

All focusable elements SHALL have visible focus indication via the `:focus-visible` CSS pseudo-class. No element SHALL use `outline: none` without providing an alternative focus indicator.

#### Scenario: Keyboard focus on button
- **WHEN** a user navigates via keyboard `Tab` to a button
- **THEN** a visible outline or ring appears around the button
- **AND** the style is defined in CSS using `:focus-visible` pseudo-class

#### Scenario: Mouse click on button
- **WHEN** a user clicks a button with a mouse
- **THEN** no focus ring appears (only for keyboard users via `:focus-visible`)

### Requirement: Form inputs have associated labels

All form `<input>`, `<select>`, and `<textarea>` elements SHALL have an associated `<label>` with matching `htmlFor` and `id` attributes.

#### Scenario: Label-input association
- **WHEN** a form contains an `<input id="sub-name">` element
- **THEN** a `<label htmlFor="sub-name">` element exists in the DOM
- **AND** clicking the label focuses the associated input

### Requirement: Keyboard-operable swipe-to-delete

The swipe-to-delete interaction for visits SHALL have a keyboard equivalent. Keyboard users SHALL be able to trigger delete actions without touch or mouse input.

#### Scenario: Delete via keyboard
- **WHEN** a visit item receives focus
- **THEN** pressing `Delete` or `Backspace` triggers the delete action
- **OR** a visible delete button appears that can be activated with `Enter` or `Space`

#### Scenario: Escape aborts swipe
- **WHEN** a swipe gesture is in progress via keyboard
- **THEN** pressing `Escape` cancels the action and returns the element to its original position

### Requirement: No nested interactive elements

The project SHALL NOT contain nested interactive elements (e.g., `<button>` inside `<a>`, `<button>` inside `<button>`). Each interactive area SHALL contain only one action.

#### Scenario: Card with navigation and action
- **WHEN** a card component provides both navigation (click to view details) and an action (menu/delete)
- **THEN** the interactive elements are siblings or use absolute positioning with separate event handlers
- **AND** no `<button>` or interactive element is a descendant of another interactive element


