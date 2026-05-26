# Edit Visit Date — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add ability to tap a visit date in the timeline to edit it inline using native `<input type="date">`.

**Architecture:** Add `editVisit` to the `useSubscriptions` hook. In `VisitTimeline`, replace date text with `<input type="date">` on tap, constrained by adjacent visit dates. Wire new props through `SubscriptionDetail` and `SubscriptionPage`.

**Tech Stack:** React 19, Tailwind CSS, localStorage (no external deps added)

**Spec:** `docs/superpowers/specs/2026-05-27-edit-visit-date-design.md`

---

### Task 1: Add `editVisit` to data layer

**Files:**
- Modify: `src/hooks/useSubscriptions.js`

- [ ] **Step 1: Add `editVisit` function**

Add `editVisit` after `removeVisit` (line 54). The function takes `subscriptionId`, `visitId`, and `newDate` (YYYY-MM-DD string). It finds the visit, extracts original time, combines with new date, and updates state.

```js
const editVisit = (subId, visitId, newDate) => {
  setSubscriptions((prev) =>
    prev.map((s) => {
      if (s.id !== subId) return s;
      return {
        ...s,
        visits: s.visits.map((v) => {
          if (v.id !== visitId) return v;
          const originalDate = new Date(v.date);
          const [year, month, day] = newDate.split("-").map(Number);
          originalDate.setFullYear(year, month - 1, day);
          return { ...v, date: originalDate.toISOString() };
        }),
      };
    })
  );
};
```

- [ ] **Step 2: Export `editVisit`**

Add `editVisit` to the return object:

```js
return {
  subscriptions,
  addSubscription,
  deleteSubscription,
  addVisit,
  removeVisit,
  editVisit,
  getSubscription,
};
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: PASS (no new errors from this file)

- [ ] **Step 4: Commit**

```bash
git add src/hooks/useSubscriptions.js
git commit -m "feat: add editVisit function to useSubscriptions hook"
```

---

### Task 2: Add inline date editing to VisitTimeline

**Files:**
- Modify: `src/components/VisitTimeline.jsx`

- [ ] **Step 1: Add new props to `SwipeableVisit` and `VisitTimeline`**

`SwipeableVisit` gets new props: `onEdit`, `minDate`, `maxDate`, `isEditing`, `onStartEdit`, `onStopEdit`.
`VisitTimeline` gets new props: `onEditVisit`, `startDate`.

Update signatures:

```jsx
function SwipeableVisit({ visit, onDelete, onEdit, minDate, maxDate, isLast }) {
```

```jsx
export default function VisitTimeline({ visits, onDeleteVisit, onEditVisit, startDate }) {
```

- [ ] **Step 2: Add `editingVisitId` local state to `VisitTimeline`**

Add a local state in `VisitTimeline` to track which visit is being edited:

```jsx
const [editingVisitId, setEditingVisitId] = useState(null);
```

- [ ] **Step 3: Compute min/max dates and pass to `SwipeableVisit`**

In the `.map()`, compute the original index in the chronological array. Visits are displayed in reverse, so original index `oi = visits.length - 1 - i`.

```jsx
{visits
  .slice()
  .reverse()
  .map((v, i) => {
    const oi = visits.length - 1 - i;
    const prevDate = oi === 0 ? startDate : visits[oi - 1].date.substring(0, 10);
    const nextDate = oi === visits.length - 1 ? undefined : visits[oi + 1].date.substring(0, 10);
    const isEditing = editingVisitId === v.id;

    return (
      <SwipeableVisit
        key={v.id}
        visit={v}
        onDelete={onDeleteVisit}
        isLast={i === visits.length - 1}
        isEditing={isEditing}
        onStartEdit={() => setEditingVisitId(v.id)}
        onStopEdit={() => setEditingVisitId(null)}
        onEdit={(visitId, newDate) => {
          onEditVisit(visitId, newDate);
          setEditingVisitId(null);
        }}
        minDate={prevDate}
        maxDate={nextDate}
      />
    );
  })}
```

- [ ] **Step 4: Update `SwipeableVisit` to accept new props**

Destructure new props:

```jsx
function SwipeableVisit({
  visit,
  onDelete,
  onEdit,
  minDate,
  maxDate,
  isLast,
  isEditing,
  onStartEdit,
  onStopEdit,
}) {
```

- [ ] **Step 5: Guard swipe handlers when editing**

In the touch handler setup (`useEffect` for touch events), check `isEditing` before processing:

```jsx
useEffect(() => {
  const row = rowRef.current;
  if (!row) return;

  const onTouchStart = (e) => {
    if (isEditing) return;
    if (e.touches.length === 1) handleStart(e.touches[0].clientX);
  };
  const onTouchMove = (e) => {
    if (isEditing) return;
    if (e.touches.length === 1) handleMove(e.touches[0].clientX);
  };
  const onTouchEnd = () => {
    if (isEditing) return;
    handleEnd();
  };

  row.addEventListener("touchstart", onTouchStart, { passive: true });
  row.addEventListener("touchmove", onTouchMove, { passive: true });
  row.addEventListener("touchend", onTouchEnd);

  return () => {
    row.removeEventListener("touchstart", onTouchStart);
    row.removeEventListener("touchmove", onTouchMove);
    row.removeEventListener("touchend", onTouchEnd);
  };
}, [handleStart, handleMove, handleEnd, isEditing]);
```

Same for mouse events:

```jsx
useEffect(() => {
  const onMouseMove = (e) => {
    if (isEditing) return;
    handleMove(e.clientX);
  };
  const onMouseUp = () => {
    if (isEditing) return;
    handleEnd();
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  const onMouseDown = (e) => {
    if (isEditing) return;
    handleStart(e.clientX);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const row = rowRef.current;
  if (!row) return;

  row.addEventListener("mousedown", onMouseDown);

  return () => {
    row.removeEventListener("mousedown", onMouseDown);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };
}, [handleStart, handleMove, handleEnd, isEditing]);
```

- [ ] **Step 6: Replace date text with inline `<input type="date">` when editing**

Replace the date paragraph (lines 131-139) with conditional rendering:

```jsx
{isEditing ? (
  <input
    type="date"
    defaultValue={visit.date.substring(0, 10)}
    min={minDate}
    max={maxDate}
    className="font-medium ml-2 border border-blue-300 rounded px-2 py-0.5 text-sm focus:outline-none focus:border-blue-500"
    autoFocus
    onChange={(e) => {
      onEdit(visit.id, e.target.value);
    }}
    onBlur={() => {
      onStopEdit();
    }}
  />
) : (
  <p
    className="font-medium ml-2 cursor-pointer"
    onClick={() => onStartEdit()}
  >
    {new Date(visit.date).toLocaleDateString()}{" "}
    <span className="text-sm text-gray-500">
      {new Date(visit.date).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </span>
  </p>
)}
```

- [ ] **Step 7: Run lint**

Run: `npm run lint`
Expected: PASS (no new errors)

- [ ] **Step 8: Commit**

```bash
git add src/components/VisitTimeline.jsx
git commit -m "feat: add inline date editing to VisitTimeline"
```

---

### Task 3: Wire `editVisit` through SubscriptionDetail and SubscriptionPage

**Files:**
- Modify: `src/components/SubscriptionDetail.jsx`
- Modify: `src/pages/SubscriptionPage.jsx`

- [ ] **Step 1: Update `SubscriptionDetail` props**

Add `onEditVisit` prop and pass `startDate` and `onEditVisit` to `VisitTimeline`:

```jsx
export default function SubscriptionDetail({ sub, onAddVisit, onDeleteVisit, onEditVisit }) {
  // ... existing code unchanged ...

  <VisitTimeline
    visits={sub.visits}
    onDeleteVisit={(visitId) => onDeleteVisit(sub.id, visitId)}
    onEditVisit={(visitId, newDate) => onEditVisit(sub.id, visitId, newDate)}
    startDate={sub.startDate}
  />
```

- [ ] **Step 2: Update `SubscriptionPage` wiring**

Destructure `editVisit` from hook and pass to `SubscriptionDetail`:

```jsx
const { getSubscription, addVisit, removeVisit, editVisit } = useSubscriptions();
// ... rest unchanged ...

<SubscriptionDetail
  sub={sub}
  onAddVisit={addVisit}
  onDeleteVisit={removeVisit}
  onEditVisit={editVisit}
/>
```

- [ ] **Step 3: Run lint**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/SubscriptionDetail.jsx src/pages/SubscriptionPage.jsx
git commit -m "feat: wire editVisit through SubscriptionDetail and SubscriptionPage"
```

---

### Task 4: Manual verification

- [ ] **Step 1: Start dev server**

Run: `npm run dev`
Expected: dev server starts

- [ ] **Step 2: Add a subscription with several visits**

Open the app, create a subscription, mark 3-4 visits.

- [ ] **Step 3: Tap a visit date**

Tap on a visit date in the timeline. The date text should be replaced by a native date input with the visit's date pre-selected.

- [ ] **Step 4: Select a new date**

Pick a new date. The visit should update immediately, and the input should disappear.

- [ ] **Step 5: Verify min/max constraints**

Try tapping the first (newest) visit's date. The calendar should prevent selecting dates before the previous visit. Try the oldest visit — should prevent dates before the subscription start date.

- [ ] **Step 6: Verify swipe still works**

Swipe left on a visit to verify delete still works. While editing (input open), swiping should be blocked.

- [ ] **Step 7: Run lint**

Run: `npm run lint`
Expected: PASS

---

### File Structure Summary

| File | Change |
|---|---|
| `src/hooks/useSubscriptions.js` | +`editVisit` function, export |
| `src/components/VisitTimeline.jsx` | +editing state, inline input, date constraints, swipe guard |
| `src/components/SubscriptionDetail.jsx` | +`onEditVisit` prop, pass `startDate` |
| `src/pages/SubscriptionPage.jsx` | +destructure `editVisit`, pass prop |
