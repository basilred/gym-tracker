# Edit Visit Date — Design Spec

**Date:** 2026-05-27  
**Issue:** [#5](https://github.com/basilred/gym-tracker/issues/5)  
**Branch:** `feature/edit-visit-date`

## Summary

Add ability to change the date of an already marked visit in the subscription timeline. User taps the date, it transforms into a native `<input type="date">`, picks a new date, and the change is applied immediately.

---

## Requirements

### Functional

1. User taps on a visit's date in the timeline to edit it
2. The date text is replaced inline with a native `<input type="date">`
3. The calendar input restricts dates to the valid range (between adjacent visits)
4. On date selection (`onChange`), the visit is updated immediately — no confirmation
5. On blur without selection, the input reverts to display mode — no changes
6. Time component of the visit is preserved (only the date part changes)

### Non-functional

- Use native `<input type="date">` — consistent with `NewSubscriptionForm`
- No external date-picker libraries
- Swipe-to-delete must not trigger when editing is active

---

## Data Changes

### `useSubscriptions.js` — new method

```js
editVisit(subscriptionId, visitId, newDateString)
```

- Finds subscription by `subscriptionId`
- Finds visit by `visitId`
- Parses original visit date, extracts time (HH:mm)
- Combines `newDateString` (YYYY-MM-DD) with original time → new ISO string
- Replaces visit in subscription state
- Persists to localStorage

---

## UI Changes

### `VisitTimeline.jsx`

| State | Behavior |
|---|---|
| **Local state** | `editingVisitId: string | null` |
| **Display mode** | Date text — same as current |
| **Tap on date** | Sets `editingVisitId = visit.id` |
| **Edit mode** | Date text replaced by `<input type="date">` with `min`/`max` |
| **Date selected** (`onChange`) | Calls `onEditVisit(sub.id, visit.id, newDate)`, resets `editingVisitId` |
| **Blur without change** (`onBlur`) | Resets `editingVisitId` |

Input element must call `preventDefault()` on touch events to avoid swipe-to-delete conflict.

### `SubscriptionDetail.jsx`

- Receives `onEditVisit` from `useSubscriptions` hook
- Passes it down to `VisitTimeline` as prop

---

## Date Constraints (min/max)

Visits are sorted chronologically. For the visit at index `i`:

| Condition | `min` | `max` |
|---|---|---|
| `i === 0` (oldest) | `subscription.startDate` | `visits[i+1].date` (end of day) |
| `i === last` (newest) | `visits[i-1].date` | unbounded |
| Middle | `visits[i-1].date` | `visits[i+1].date` (end of day) |

`min` is exclusive (`>= prev date`), `max` is inclusive (`<= next date` — same date allowed).

If only one visit exists: `min = startDate`, `max = unbounded`.

---

## Edge Cases

| Case | Behavior |
|---|---|
| Only 1 visit | `min = startDate`, no `max` |
| Adjacent visits have same date | Edit allowed, `min === max` |
| Original time (ISO) | Extracted and preserved, new ISO = YYYY-MM-DD + original HH:mm:ss |
| Swipe gesture during edit | Blocked — `input` captures touch events |
| Input open, user scrolls | Input stays — native behavior |
| Very old visit (no prev) | `startDate` is the floor |

---

## Files to Modify

| File | Change |
|---|---|
| `src/hooks/useSubscriptions.js` | Add `editVisit` function |
| `src/components/VisitTimeline.jsx` | Inline date editing, `editingVisitId` state, min/max computation |
| `src/components/SubscriptionDetail.jsx` | Wire `onEditVisit` prop |

---

## Out of Scope

- Editing visit time (only date)
- Changing visit order
- Editing subscription parameters (name, sessions, startDate)
- Confirmation dialog before saving
