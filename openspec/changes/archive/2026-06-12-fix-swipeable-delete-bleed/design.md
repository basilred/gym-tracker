## Context

The SwipeableVisit card shows red Delete background artifacts at the top-right and bottom-right corners before any swipe. Two independent issues contributed:

1. **`::after` gradient** — `.SwipeableVisit-Content::after` had `background: linear-gradient(90deg, transparent, ...)`. The `transparent` color allowed the red DeleteBg behind the content to show through at the right edge.

2. **Clip boundary coincidence** — `.SwipeableVisit-DeleteBg` has `border-radius: var(--radius-lg)` and `position: absolute; right: 0`. Its top-right/bottom-right curved corner exactly coincides with the `.SwipeableVisit-Wrapper`'s `overflow: hidden` + `border-radius` clip boundary. At the clip boundary, sub-pixel anti-aliasing blends the clipped content with the layer behind, mixing red into the surface-colored edge.

## Goals / Non-Goals

**Goals:**
- Eliminate any visual bleed of the Delete button background at rest state (`--swipe-offset: 0`)
- Keep the fix purely CSS — no JS changes
- Preserve rounded card corners and delete button styling
- Preserve swipe-to-delete functionality

**Non-Goals:**
- Changing the swipe mechanics, threshold, or animation
- Modifying the component structure or HTML

## Decisions

- **`right: 1px` on `.SwipeableVisit-DeleteBg`** — Insets the delete button by 1px from the right edge. This moves its border-radius curve away from the wrapper's clip boundary, so the anti-aliasing at the boundary only sees the Content's `--color-surface`, not the red DeleteBg behind it. The 1px gap is invisible because `.SwipeableVisit-Content` (full-width block, painted on top) covers it.

- **`background-color: var(--color-surface)` on `.SwipeableVisit-Wrapper`** — Safety net for any remaining sub-pixel gaps. If the clip boundary exposes a micro-gap, the wrapper's surface-colored background fills it instead of being transparent.

- **Remove `::after` pseudo-element** — The swipe affordance gradient served a minor UX purpose but directly caused visible bleed-through. The `transparent` start color in the linear-gradient allowed the DeleteBg behind the content to show at the right edge.

- **Alternatives considered**:
  - Adding `overflow: hidden` + `border-radius` to `.SwipeableVisit-Content` — didn't fix the issue because the `::after` gradient was still bleeding through
  - Removing `border-radius` from `.SwipeableVisit-DeleteBg` — made the artifact worse (triangles instead of thin curves) because the rectangular DeleteBg showed through a larger area
  - Removing `border-radius` from `.SwipeableVisit-Wrapper` — works but loses rounded card corners, a significant visual design change

## Risks / Trade-offs

- [Low] 1px inset means the delete button's right edge is 1px from the card edge when fully swiped — visually imperceptible
- [Low] Removing `::after` loses a subtle swipe affordance gradient — acceptable because swipe-to-delete is discoverable through the content shift and the user found the gradient visually dirty
