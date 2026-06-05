## 1. Global CSS reset for form elements

- [x] 1.1 Add `appearance: none; -webkit-appearance: none;` to `input, select, button, textarea` block in `src/app/index.css`
- [x] 1.2 Add `line-height: 1.5` (explicitly, not just `inherit`) to the same block to override UA defaults for `<select>`

## 2. Custom dropdown arrow for Select

- [x] 2.1 Add SVG chevron-down `background-image` to `.NewSubscriptionForm-Select` in `NewSubscriptionForm.css`
- [x] 2.2 Add `padding-right: 2rem` and `background-position: right 0.5rem center` to prevent text/arrow overlap
- [x] 2.3 Set `background-size: 1.25em` and `background-repeat: no-repeat`

## 3. Verification

- [x] 3.1 Verify `<select>` and `<input>` have identical rendered height in Chrome DevTools
- [x] 3.2 Verify `<select>` and `<input>` have identical rendered height in Firefox and Safari
- [x] 3.3 Verify custom arrow is visible and does not overlap with option text
- [x] 3.4 Verify existing form functionality (submit, option selection) still works
