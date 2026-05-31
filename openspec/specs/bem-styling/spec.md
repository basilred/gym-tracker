# bem-styling Specification

## Purpose
Система стилизации проекта на основе БЭМ-методологии с React-неймингом, дизайн-токенами и нативными CSS-псевдоклассами. Заменяет Tailwind CSS.

## Requirements

### Requirement: BEM class naming convention

The project SHALL use BEM methodology with React naming convention for all CSS classes. The format SHALL be `BlockName-ElemName_modName_modValue` where:
- Block names use PascalCase (e.g., `SubscriptionCard`, `SwipeableVisit`)
- Elements are delimited by a single dash `-` (e.g., `SubscriptionCard-Title`)
- Modifiers are delimited by underscore `_` (e.g., `SubscriptionCard_expanded`, `SubscriptionCard-MarkBtn_disabled`)

#### Scenario: Simple block class
- **WHEN** a component renders with only a block-level class
- **THEN** the class name uses PascalCase with no element or modifier suffixes (e.g., `SubscriptionCard`)

#### Scenario: Block element class
- **WHEN** a component renders an element within a block
- **THEN** the class name uses the format `BlockName-ElemName` (e.g., `SubscriptionCard-Title`)

#### Scenario: Block modifier class
- **WHEN** a component renders a block with a boolean modifier
- **THEN** the class list includes both `BlockName` and `BlockName_modName` (e.g., `SubscriptionCard SubscriptionCard_expanded`)

#### Scenario: Element modifier class
- **WHEN** a component renders an element with a modifier
- **THEN** the class list includes both `BlockName-ElemName` and `BlockName-ElemName_modName_modValue` (e.g., `SubscriptionCard-MenuDropdown SubscriptionCard-MenuDropdown_expanded`)

### Requirement: @bem-react/classname for class construction

The project SHALL use the `@bem-react/classname` package with its default React naming preset for constructing BEM class names. Components SHALL define a `cn('BlockName')` constant at module scope and use it to derive element and modifier classes.

#### Scenario: Block definition at module scope
- **WHEN** a component file is created
- **THEN** it defines `const block = cn('BlockName')` outside the component function

#### Scenario: Element class construction
- **WHEN** a component needs an element class
- **THEN** it calls `block('ElementName')` which returns `BlockName-ElementName`

#### Scenario: Modifier class construction
- **WHEN** a component needs a modifier on a block or element
- **THEN** it passes an object with truthy/falsy values to control modifier visibility (e.g., `block({ expanded: isOpen })`)

### Requirement: CSS file per component

Each React component that requires styling SHALL have a corresponding CSS file in the same directory. CSS files SHALL be imported once in `main.jsx`, not in individual component files.

#### Scenario: CSS file location
- **WHEN** a component `SubscriptionCard.jsx` exists in `src/components/`
- **THEN** its styles are defined in `src/components/SubscriptionCard.css`

#### Scenario: CSS imports are centralized
- **WHEN** the application builds
- **THEN** all component CSS files are imported from a single entry point (`main.jsx`), not from individual JSX files

### Requirement: Design tokens

The project SHALL define design tokens in `src/styles/tokens.css` using CSS custom properties on `:root`. All component CSS files SHALL reference these tokens for colors, radii, shadows, and transitions rather than hardcoding values.

#### Scenario: Token definition
- **WHEN** tokens.css is loaded
- **THEN** CSS custom properties for colors, spacing, radii, shadows, and transitions are available globally via `:root`

#### Scenario: Token usage in component CSS
- **WHEN** a component CSS file defines styles
- **THEN** it references design tokens via `var(--token-name)` syntax (e.g., `color: var(--color-primary)`, `border-radius: var(--radius-2xl)`)

### Requirement: Native CSS pseudo-classes over BEM modifiers

For standard interactive states, the project SHALL use native CSS pseudo-classes (`:hover`, `:disabled`, `:focus-visible`) instead of BEM modifiers. BEM modifiers SHALL only be used for custom logical states that have no corresponding pseudo-class.

#### Scenario: Disabled button state via CSS
- **WHEN** a button has the `disabled` HTML attribute set to `true`
- **THEN** its CSS uses the `:disabled` pseudo-class, not a `_disabled` BEM modifier class

#### Scenario: Hover state via CSS
- **WHEN** an element needs hover styling
- **THEN** its CSS uses the `:hover` pseudo-class, not a `_hovered` BEM modifier class

#### Scenario: Custom state via BEM modifier
- **WHEN** an element has a custom logical state with no CSS pseudo-class equivalent (e.g., menu open/closed, swipe dragging)
- **THEN** a BEM modifier class is used (e.g., `_expanded`, `_dragging`)

### Requirement: Dynamic styles via CSS custom properties

Progress bars and similar data-driven visual properties SHALL use CSS custom properties set via inline `style` attribute rather than computed inline styles. The component SHALL pass data as a CSS custom property value and the CSS file SHALL consume it.

#### Scenario: Progress bar width from data
- **WHEN** a progress bar fills based on `visits / totalSessions` ratio
- **THEN** the component sets `style={{ '--progress': '75%' }}` and CSS consumes `width: var(--progress, 0%)`

### Requirement: Real-time animation via ref.setProperty

Animations that require real-time DOM updates (e.g., swipe gestures) SHALL use `ref.current.style.setProperty()` to update CSS custom properties, combined with BEM modifier classes to control transition behavior.

#### Scenario: Swipe offset during drag
- **WHEN** a user drags a swipeable element
- **THEN** `setProperty('--swipe-offset', offset)` updates the position without triggering CSS transitions

#### Scenario: Transition states for swipe
- **WHEN** a swipe gesture ends
- **THEN** a modifier class is added to enable CSS transitions for the snap-back or snap-out animation

### Requirement: Dark mode via prefers-color-scheme

The project SHALL support dark mode using the `prefers-color-scheme: dark` CSS media query. Design tokens in `tokens.css` SHALL define alternate values for dark mode within a `@media (prefers-color-scheme: dark)` block.

#### Scenario: System set to dark mode
- **WHEN** the user's operating system is set to dark color scheme
- **THEN** the application renders with dark background and light text
- **AND** all design tokens resolve to their dark-mode values

#### Scenario: System set to light mode
- **WHEN** the user's operating system is set to light color scheme
- **THEN** the application renders with the default light theme

#### Scenario: Dark mode token definition
- **WHEN** `tokens.css` is inspected
- **THEN** `:root` defines light-mode token values
- **AND** `@media (prefers-color-scheme: dark)` block defines overridden token values for dark mode
- **AND** tokens include at minimum: `--color-bg`, `--color-surface`, `--color-text`, `--color-text-secondary`, `--color-border`

### Requirement: Responsive layout breakpoints

The project SHALL use responsive CSS breakpoints to adapt the layout for larger screens. The primary breakpoint SHALL be 640px (`@media (min-width: 40rem)`) for tablet and desktop layouts.

#### Scenario: Desktop layout for subscription list
- **WHEN** the viewport is 640px or wider
- **THEN** subscription cards are displayed in a 2-column grid layout

#### Scenario: Desktop layout for subscription detail
- **WHEN** the viewport is 640px or wider
- **THEN** the detail page has a wider max-width (e.g., 40rem) for comfortable reading

#### Scenario: Mobile layout unchanged
- **WHEN** the viewport is narrower than 640px
- **THEN** all layouts remain single-column as currently implemented
