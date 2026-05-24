# Timeline Visual Redesign

## Overview

Replace the continuous `border-l` on the timeline container with individual 1px connector lines between visit dots. Each dot (except the most recent) has a vertical line going up to the previous dot.

## Design

### Before
- Timeline container has `border-l border-gray-300` — one continuous vertical line
- Dots sit on top of this line

### After
- Timeline container has NO `border-l`
- Each visit row (except the first in reversed list = most recent visit) has a 1px gray vertical line above its dot, connecting to the previous dot
- The line goes from the dot center upward, past the container boundary, across the margin gap, to meet the previous dot center

### Implementation

File: `src/components/VisitTimeline.jsx`

1. Remove `border-l border-gray-300` from the timeline container div
2. Add `isFirst` prop to `SwipeableVisit`
3. When `!isFirst`, render a vertical connector line:
   ```html
   <div className="absolute w-px bg-gray-300" style={{ left: '-16px', top: '-16px', height: '29px' }} />
   ```
4. Pass `isFirst` from the parent map: `isFirst={index === 0}` (since array is reversed, index 0 = most recent)

### Edge cases
- Single visit: no connector line (it's the first)
- Empty timeline: no change (shows "Пока нет посещений")
