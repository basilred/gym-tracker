## ADDED Requirements

### Requirement: Content fully occludes delete background at rest
The `.SwipeableVisit-Content` element SHALL visually cover the `.SwipeableVisit-DeleteBg` element when `--swipe-offset` is `0`, with no visible bleed-through of the red delete background at any viewport width or zoom level.

#### Scenario: No red bleed before swipe
- **WHEN` `SwipeableVisit` renders with `--swipe-offset` at its default (`0`)
- **THEN** no red background from `.SwipeableVisit-DeleteBg` SHALL be visible at the right edge of the card
- **AND** the right edge SHALL appear as the surface background color with smooth rounded corners
