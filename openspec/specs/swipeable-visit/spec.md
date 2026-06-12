# swipeable-visit Specification

## Purpose

Изолировать BEM-пространство компонента SwipeableVisit в отдельный файл, отделив его от VisitTimeline.

## Requirements

### Requirement: SwipeableVisit has own BEM block and file

The `SwipeableVisit` component SHALL be extracted from `VisitTimeline.tsx` into its own file with its own BEM block. It SHALL have its own CSS file separate from `VisitTimeline.css`.

#### Scenario: SwipeableVisit is in own TSX file
- **WHEN** the project source is inspected
- **THEN** `SwipeableVisit` is defined in its own file at `src/widgets/visit-timeline/ui/SwipeableVisit.tsx`
- **AND** `VisitTimeline.tsx` imports `SwipeableVisit` from that file

#### Scenario: SwipeableVisit uses own CSS file
- **WHEN** the application loads
- **THEN** `SwipeableVisit.css` is imported from `main.tsx`
- **AND** `SwipeableVisit.css` contains classes for the `SwipeableVisit` block

#### Scenario: VisitTimeline.css only has VisitTimeline classes
- **WHEN** `VisitTimeline.css` is inspected after the change
- **THEN** it only contains `.VisitTimeline` and `.VisitTimeline-Empty` rules
- **AND** it does not contain any `.SwipeableVisit-*` rules

### Requirement: Content fully occludes delete background at rest

The `.SwipeableVisit-Content` element SHALL visually cover the `.SwipeableVisit-DeleteBg` element when `--swipe-offset` is `0`, with no visible bleed-through of the red delete background at any viewport width or zoom level.

#### Scenario: No red bleed before swipe
- **WHEN** `SwipeableVisit` renders with `--swipe-offset` at its default (`0`)
- **THEN** no red background from `.SwipeableVisit-DeleteBg` SHALL be visible at the right edge of the card
- **AND** the right edge SHALL appear as the surface background color with smooth rounded corners
