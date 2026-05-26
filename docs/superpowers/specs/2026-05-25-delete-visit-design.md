# Delete Visit from Subscription Detail

## Overview

Add ability to delete (undo) a marked visit in the subscription detail page.
Currently visits can only be added — if a user marks a session by mistake, there is no way to undo it without deleting the entire subscription.

## Design

### 1. Hook: `removeVisit(subscriptionId, visitId)`

File: `src/hooks/useSubscriptions.js`

- Get subscription by id
- Filter out the visit with `visitId` from `subscription.visits`
- Save back to localStorage
- The existing `subscription` state will be stale — re-read from localStorage on next render via the existing pattern

### 2. VisitTimeline: swipe-to-delete + hover button

File: `src/components/VisitTimeline.jsx`

Each visit row becomes a swipeable container:

- **Desktop hover**: a small ✕ button appears on the right side of the row (CSS `:hover`)
- **Swipe left** (touch + mouse drag): reveals a red "Удалить" button behind the row
  - Threshold: ~80px
  - Spring-back if released before threshold
  - Snap open if released past threshold
- Clicking the delete button (from hover or swipe reveal) triggers `window.confirm("Удалить это посещение?")`
- On confirm, calls `onDeleteVisit(visitId)` prop

Props:
- `visits` — array of visit objects
- `onDeleteVisit` — callback `(visitId) => void`

No device detection needed: `:hover` naturally doesn't fire on touch devices, and touch events handle swipe on both platforms.

### 3. SubscriptionDetail: wire up

File: `src/components/SubscriptionDetail.jsx`

- Destructure `removeVisit` from `useSubscriptions()`
- Pass `onDeleteVisit={(visitId) => removeVisit(id, visitId)}` to `VisitTimeline`
- After deletion, `remaining` automatically recalculates — the "Отметить занятие" button becomes active again if it was disabled

### 4. Edge cases

- Deleting the last visit when `remaining === 1` re-enables the "Отметить занятие" button
- The timeline re-renders with updated visits list
- If all visits are deleted, the timeline shows empty state (as designed)
- `window.confirm` cancellation does nothing

## Files changed

| File | Change |
|------|--------|
| `src/hooks/useSubscriptions.js` | Add `removeVisit` function |
| `src/components/VisitTimeline.jsx` | Swipe-to-delete + hover button |
| `src/components/SubscriptionDetail.jsx` | Pass `onDeleteVisit` prop |
