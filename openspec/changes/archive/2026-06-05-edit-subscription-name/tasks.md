## 1. Data layer — `updateSubscription`

- [x] 1.1 Add `updateSubscription(id, updates)` method to `useSubscriptions` hook
- [x] 1.2 Export `updateSubscription` from hook return and entity index

## 2. Tests — data layer

- [x] 2.1 Add tests for `updateSubscription`: update name, update non-existent, update preserves other fields, update with empty name restores default, update preserves other subscriptions

## 3. Subscription card — inline editing

- [x] 3.1 Add inline editing state and handlers to `SubscriptionCard`: click-to-edit, textarea with auto-resize, Enter/blur → save, Escape → cancel, empty → default name
- [x] 3.2 Add CSS styles for editable state: textarea reset, auto-resize, `white-space: pre-wrap` for display mode
- [x] 3.3 Add `onUpdate` prop to `SubscriptionCard` and propagate

## 4. Subscription detail — inline editing

- [x] 4.1 Add inline editing state and handlers to `SubscriptionDetail`: same behavior as card
- [x] 4.2 Add CSS styles for editable state
- [x] 4.3 Add `onUpdate` prop to `SubscriptionDetail` and propagate

## 5. Wire up pages

- [x] 5.1 Pass `updateSubscription` from `Home` to `SubscriptionList` to `SubscriptionCard`
- [x] 5.2 Pass `updateSubscription` from `SubscriptionPage` to `SubscriptionDetail`

## 6. Tests — UI components

- [x] 6.1 Add tests for `SubscriptionCard` inline editing: click to edit, save on Enter, cancel on Escape, save on blur, empty name fallback
- [x] 6.2 Add tests for `SubscriptionDetail` inline editing: same scenarios
- [x] 6.3 Add tests for `Home` and `SubscriptionPage` with `updateSubscription`

## 7. Lint & verify

- [x] 7.1 Run linter and type checker
- [x] 7.2 Run full test suite
