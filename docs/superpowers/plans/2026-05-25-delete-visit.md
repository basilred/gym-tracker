# Delete Visit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add swipe-to-delete and hover-delete for marked visits in subscription detail page.

**Architecture:** New `removeVisit` function in the hook; swipeable row component inside `VisitTimeline` with touch/mouse drag support and CSS hover fallback; `SubscriptionPage` wires `removeVisit` through `SubscriptionDetail` to `VisitTimeline`.

**Tech Stack:** React 19, Tailwind CSS v4

---

### Task 1: Add `removeVisit` to hook

**Files:**
- Modify: `src/hooks/useSubscriptions.js:46-54`

- [ ] **Step 1: Add `removeVisit` function**

```js
const removeVisit = (subId, visitId) => {
  setSubscriptions((prev) =>
    prev.map((s) =>
      s.id === subId
        ? { ...s, visits: s.visits.filter((v) => v.id !== visitId) }
        : s
    )
  );
};
```

- [ ] **Step 2: Export `removeVisit` from the hook**

Add `removeVisit` to the return object at line 48-54:

```js
return {
  subscriptions,
  addSubscription,
  deleteSubscription,
  addVisit,
  removeVisit,
  getSubscription,
};
```

- [ ] **Step 3: Commit**

```bash
git add src/hooks/useSubscriptions.js
git commit -m "feat: add removeVisit function to hook"
```

---

### Task 2: Swipe-to-delete + hover button in VisitTimeline

**Files:**
- Modify: `src/components/VisitTimeline.jsx` (entire file)

- [ ] **Step 1: Replace VisitTimeline with swipeable rows**

Full replacement of `src/components/VisitTimeline.jsx`:

```jsx
import { useState, useRef, useEffect, useCallback } from "react";

const DELETE_THRESHOLD = 80;

function SwipeableVisit({ visit, onDelete }) {
  const [offset, setOffset] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const startX = useRef(0);
  const currentOffset = useRef(0);
  const rowRef = useRef(null);

  const handleStart = useCallback(
    (clientX) => {
      startX.current = clientX;
      currentOffset.current = isOpen ? DELETE_THRESHOLD + 20 : 0;
    },
    [isOpen]
  );

  const handleMove = useCallback((clientX) => {
    const diff = startX.current - clientX;
    const newOffset = Math.max(0, Math.min(currentOffset.current + diff, DELETE_THRESHOLD + 40));
    setOffset(newOffset);
  }, []);

  const handleEnd = useCallback(() => {
    if (offset > DELETE_THRESHOLD) {
      setOffset(DELETE_THRESHOLD + 20);
      setIsOpen(true);
    } else {
      setOffset(0);
      setIsOpen(false);
    }
  }, [offset]);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;

    const onTouchStart = (e) => {
      if (e.touches.length === 1) handleStart(e.touches[0].clientX);
    };
    const onTouchMove = (e) => {
      if (e.touches.length === 1) handleMove(e.touches[0].clientX);
    };
    const onTouchEnd = () => handleEnd();

    row.addEventListener("touchstart", onTouchStart, { passive: true });
    row.addEventListener("touchmove", onTouchMove, { passive: true });
    row.addEventListener("touchend", onTouchEnd);

    return () => {
      row.removeEventListener("touchstart", onTouchStart);
      row.removeEventListener("touchmove", onTouchMove);
      row.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (startX.current !== null) handleMove(e.clientX);
    };
    const onMouseUp = () => {
      if (startX.current !== null) {
        handleEnd();
        startX.current = null;
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      }
    };

    const onMouseDown = (e) => {
      startX.current = e.clientX;
      currentOffset.current = isOpen ? DELETE_THRESHOLD + 20 : 0;
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
  }, [isOpen, handleMove, handleEnd]);

  const handleDelete = () => {
    if (window.confirm("Удалить это посещение?")) {
      onDelete(visit.id);
    }
  };

  return (
    <div className="mb-4 relative overflow-hidden rounded-lg group" ref={rowRef}>
      <div className="absolute right-0 top-0 bottom-0 w-24 flex items-center justify-center bg-red-500 rounded-r-lg">
        <button
          onClick={handleDelete}
          className="w-full h-full text-white font-medium text-sm"
        >
          Удалить
        </button>
      </div>
      <div
        className="relative bg-white pl-0"
        style={{
          transform: `translateX(-${offset}px)`,
          transition: offset === 0 || offset >= DELETE_THRESHOLD + 20
            ? "transform 0.2s ease"
            : "none",
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full -ml-[14px]" />
            <p className="font-medium ml-2">
              {new Date(visit.date).toLocaleDateString()}{" "}
              <span className="text-sm text-gray-500">
                {new Date(visit.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 px-2 text-lg leading-none transition-opacity cursor-pointer"
            title="Удалить"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VisitTimeline({ visits, onDeleteVisit }) {
  if (visits.length === 0) {
    return <p className="text-center text-gray-500 mt-6">Пока нет посещений</p>;
  }

  return (
    <div className="mt-6 border-l border-gray-300 pl-4 max-w-md mx-auto">
      {visits
        .slice()
        .reverse()
        .map((v) => (
          <SwipeableVisit key={v.id} visit={v} onDelete={onDeleteVisit} />
        ))}
    </div>
  );
}
```

- [ ] **Step 2: Verify no lint errors**

```bash
npx eslint src/components/VisitTimeline.jsx
```

- [ ] **Step 3: Commit**

```bash
git add src/components/VisitTimeline.jsx
git commit -m "feat: add swipe-to-delete and hover delete to VisitTimeline"
```

---

### Task 3: Wire `removeVisit` through SubscriptionDetail → VisitTimeline

**Files:**
- Modify: `src/pages/SubscriptionPage.jsx:7,26`
- Modify: `src/components/SubscriptionDetail.jsx:3,38`

- [ ] **Step 1: Update SubscriptionPage to pass `removeVisit`**

In `src/pages/SubscriptionPage.jsx`, line 7:

```jsx
const { getSubscription, addVisit, removeVisit } = useSubscriptions();
```

Line 26:

```jsx
<SubscriptionDetail sub={sub} onAddVisit={addVisit} onDeleteVisit={removeVisit} />
```

- [ ] **Step 2: Update SubscriptionDetail to accept and pass `onDeleteVisit`**

In `src/components/SubscriptionDetail.jsx`, line 3:

```jsx
export default function SubscriptionDetail({ sub, onAddVisit, onDeleteVisit }) {
```

Line 38:

```jsx
<VisitTimeline visits={sub.visits} onDeleteVisit={(visitId) => onDeleteVisit(sub.id, visitId)} />
```

- [ ] **Step 3: Verify no lint errors**

```bash
npx eslint src/pages/SubscriptionPage.jsx src/components/SubscriptionDetail.jsx
```

- [ ] **Step 4: Commit**

```bash
git add src/pages/SubscriptionPage.jsx src/components/SubscriptionDetail.jsx
git commit -m "feat: wire removeVisit through SubscriptionDetail to VisitTimeline"
```

---

### Task 4: Verify end-to-end

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Manual check**

1. Open the app, create a subscription, add a few visits
2. Verify hover shows ✕ button (desktop)
3. Click ✕ → confirm dialog → visit disappears, progress bar updates
4. Verify swipe left reveals red delete button (mobile or desktop drag)
5. Verify cancel on confirm dialog doesn't delete

- [ ] **Step 3: Commit if any fixes needed**

```bash
git add -A && git commit -m "fix: final tweaks for delete-visit feature"
```
