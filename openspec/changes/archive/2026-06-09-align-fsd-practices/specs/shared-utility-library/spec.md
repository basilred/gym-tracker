## ADDED Requirements

### Requirement: shared/lib/ contains reusable utilities

The `shared/lib/` directory SHALL contain pure utility functions that are used by two or more modules across different layers.

#### Scenario: formatDate is available
- **WHEN** any module needs to format a date string for display
- **THEN** it SHALL use `shared/lib/formatDate` instead of inline formatting logic

### Requirement: formatDate helper

`shared/lib/formatDate.ts` SHALL export a function to format ISO date strings into Russian-locale display format.

#### Scenario: formatDate converts ISO to Russian format
- **WHEN** `formatDate("2024-03-15T10:00:00.000Z")` is called
- **THEN** it SHALL return a string like `"15 марта 2024"` or `"15.03.2024"` in Russian locale

### Requirement: pluralize helper

`shared/lib/pluralize.ts` SHALL export a function for Russian noun declension after numerals.

#### Scenario: pluralize returns correct Russian form
- **WHEN** called with `pluralize(1, "занятие", "занятия", "занятий")`
- **THEN** it SHALL return `"1 занятие"`
- **WHEN** called with `pluralize(3, "занятие", "занятия", "занятий")`
- **THEN** it SHALL return `"3 занятия"`
- **WHEN** called with `pluralize(8, "занятие", "занятия", "занятий")`
- **THEN** it SHALL return `"8 занятий"`

### Requirement: shared/lib has no business logic imports

Files in `shared/lib/` SHALL NOT import from any other project layer (`entities/`, `features/`, `widgets/`, `pages/`, `app/`).

#### Scenario: shared/lib imports only external dependencies
- **WHEN** inspecting imports in any file inside `shared/lib/`
- **THEN** all imports SHALL be external packages or native APIs
