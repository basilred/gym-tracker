## Context

Gym Tracker is a single-page React app (FSD architecture, BEM styling, Vitest tests). All accessibility work is additive — no behavior changes, no API changes, no data model changes. The app uses CSS custom properties for theming (light/dark) defined in `tokens.css`.

## Goals / Non-Goals

**Goals:**
- Pass WCAG AA for all text contrast ratios
- All interactive elements keyboard accessible with visible focus indicators
- Screen reader support: correct language, semantic structure, form labels, aria-live feedback
- Automated regression coverage via vitest-axe for every page and key component

**Non-Goals:**
- WCAG AAA compliance (beyond scope)
- Full screen reader UX pass (aria-describedby, complex announcements)
- Touch target size adjustments (maintain existing layout)
- Translation of UI text (already in Russian; only fixing aria-labels that were English)

## Decisions

### Color contrast: adjust existing tokens, no new tokens
- **Decision**: Darken `--color-text-secondary` and `--color-text-muted` in light theme; lighten in dark theme. Keep `--color-primary` as-is (it's a link/button accent; borderline contrast is acceptable for non-text and large-text use).
- **Rationale**: Minimal visual change, no new CSS variables needed, WCAG AA pass verified against both themes.

### Use vitest-axe over @testing-library/jest-dom a11y queries
- **Decision**: Add `vitest-axe` for automated `toHaveNoViolations()` checks per page/component.
- **Rationale**: axe-core catches 57+ rule categories automatically — far more than manual `getByRole` assertions. Jest's `toBeInTheDocument` etc. are still used for targeted assertions (e.g., "label has correct `for` attribute").

### No separate keyboard-navigation component; inline handlers
- **Decision**: Add keyboard handlers directly in components rather than extracting a shared hook.
- **Rationale**: Each case is unique (menu close, focus return, swipe trigger). Premature extraction would obscure the flow.

### MarkVisitButton stays unchanged
- **Decision**: MarkVisitButton already has visible text label and proper button semantics. No changes needed.

### SwipeableVisit: keep gesture, add keyboard path
- **Decision**: The swipe gesture stays for touch users. The keyboard path uses Delete/Backspace (already implemented) plus visible focus on the delete button. A subtle visual affordance (small icon or shade hint) is added for mobile users.
- **Rationale**: Removing swipe would regress UX. Dual-path is the standard mobile a11y pattern.

## Risks / Trade-offs

- **Color shift in text-secondary/muted**: Regular users may notice slightly darker secondary text in light mode. Mitigation: shift is minimal (2-3 shades on gray scale).
- **Semantic list change could break tests**: VisitTimeline and SubscriptionList tests asserting `querySelector('.SubscriptionList-Item')` or similar may need updates. Mitigation: all existing tests will be updated in the same pass.
- **vitest-axe may flag false positives**: Some rules (e.g., color contrast in SVG) may not apply. Mitigation: configure axe rules per-test if needed.
