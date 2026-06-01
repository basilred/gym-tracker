# typescript-migration Specification

## Purpose
Полная миграция кодовой базы с JavaScript на TypeScript с включением strict mode для максимальной типобезопасности.

## ADDED Requirements

### Requirement: TypeScript strict mode

The project SHALL use TypeScript with `strict: true` in `tsconfig.json`. This enables `noImplicitAny`, `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitThis`, `alwaysStrict`.

#### Scenario: Compilation with strict mode
- **WHEN** `npx tsc --noEmit` is executed
- **THEN** all type errors are reported according to strict mode rules
- **AND** the command exits with code 0 only when zero type errors exist

### Requirement: All source files use TypeScript

All application source files in `src/` SHALL use `.ts` or `.tsx` extensions. No `.js` or `.jsx` files SHALL remain in `src/` after migration.

#### Scenario: File extensions after migration
- **WHEN** `src/` directory is inspected
- **THEN** all source files have `.ts` or `.tsx` extensions
- **AND** no `.js` or `.jsx` files exist in `src/`

### Requirement: Typed data models

The project SHALL define TypeScript interfaces or types for all core data structures. At minimum: `Subscription`, `Visit`.

#### Scenario: Subscription type definition
- **WHEN** a Subscription object is created or manipulated
- **THEN** it conforms to the `Subscription` interface with typed properties: `id: string`, `name: string`, `totalSessions: number`, `startDate: string`, `visits: Visit[]`

#### Scenario: Visit type definition
- **WHEN** a Visit object is created or manipulated
- **THEN** it conforms to the `Visit` interface with typed properties: `id: string`, `date: string`

### Requirement: Typed React components

All React components SHALL have their props typed via an interface or type alias. No component SHALL use implicit `any` for props.

#### Scenario: Typed component props
- **WHEN** a component accepts props (e.g., `{ subscription, onDelete }`)
- **THEN** a `Props` interface is defined with explicit types for each prop
- **AND** the component function uses that interface: `const Card = ({ subscription, onDelete }: Props) => { ... }`

### Requirement: Typed hooks

All custom hooks and their return values SHALL be fully typed. Hook parameter types and return types SHALL be explicit.

#### Scenario: Typed hook signature
- **WHEN** `useSubscriptions` hook is defined
- **THEN** its return type is explicit: `(): { subscriptions: Subscription[]; addSubscription: ...; ... }` or an explicit interface

### Requirement: No `any` without justification

The project SHALL avoid the `any` type. If `any` is absolutely necessary, it SHALL be accompanied by an ESLint disable comment with justification.

#### Scenario: ESLint reports unnecessary anys
- **WHEN** `npm run lint` is executed
- **THEN** no `@typescript-eslint/no-explicit-any` violations exist without explicit `// eslint-disable-next-line` with justification comment

### Requirement: Build script includes type checking

The `build` script in `package.json` SHALL include TypeScript type checking before the Vite build.

#### Scenario: Build fails on type errors
- **WHEN** `npm run build` is executed
- **THEN** `tsc --noEmit` runs before `vite build`
- **AND** if type errors exist, the build is aborted before Vite runs
