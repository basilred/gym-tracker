## Why

The SwipeableVisit card shows the red Delete button's right corner peeking through the rounded edge before any swipe gesture is performed. This is a sub-pixel compositing artifact caused by the content layer (with `transform`) having square corners while the wrapper clips with `border-radius`. Looks unpolished.

## What Changes

- `.SwipeableVisit-DeleteBg` — change `right: 0` to `right: 1px` to inset the delete button from the clip boundary, preventing anti-aliasing artifacts at the wrapper's border-radius clip
- `.SwipeableVisit-Wrapper` — add `background-color: var(--color-surface)` as a safety net for any sub-pixel gaps
- Remove `::after` pseudo-element with gradient (swipe affordance) — was causing visual bleed-through

## Capabilities

### New Capabilities

*(none — this is a visual bug fix, no new capability)*

### Modified Capabilities

- `swipeable-visit`: visual rendering requirement — the content area must fully occlude the delete background at rest state (no visible bleed before swipe)

## Impact

- **CSS only**: `SwipeableVisit.css` — one class modification
- No JS/TS changes, no API changes, no new dependencies
