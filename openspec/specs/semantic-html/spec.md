# semantic-html Specification

## Purpose
TBD - created by archiving change accessibility-improvements. Update Purpose after archive.
## Requirements
### Requirement: Document language is Russian

The HTML document SHALL declare `lang="ru"` to ensure screen readers use correct pronunciation.

#### Scenario: HTML lang attribute

- **WHEN** the application loads
- **THEN** `<html>` element SHALL have `lang="ru"` attribute

### Requirement: Pages use semantic landmarks

Each page SHALL use semantic HTML landmark elements for navigation structure.

#### Scenario: Home page has landmarks

- **WHEN** rendering the Home page
- **THEN** the page SHALL contain `<main>` and `<header>` landmark elements

#### Scenario: Subscription page has landmarks

- **WHEN** rendering the Subscription page
- **THEN** the page SHALL contain `<main>` and `<header>` landmark elements

### Requirement: Lists use semantic HTML

Dynamic lists SHALL use `<ul>` or `<ol>` elements instead of `<div>` for proper list semantics.

#### Scenario: Subscription list is a <ul>

- **WHEN** rendering SubscriptionList
- **THEN** the container SHALL be a `<ul>` element with `<li>` children

#### Scenario: Visit timeline is an <ol>

- **WHEN** rendering VisitTimeline
- **THEN** the container SHALL be an `<ol>` element with `<li>` children

