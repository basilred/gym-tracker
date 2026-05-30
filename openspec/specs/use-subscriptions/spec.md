# use-subscriptions Specification

## Purpose
TBD - created by archiving change handle-storage-errors. Update Purpose after archive.
## Requirements
### Requirement: Устойчивость к повреждённым данным

Хук SHALL корректно обрабатывать ситуацию, когда данные в localStorage повреждены или невалидны, без краша приложения.

#### Scenario: Повреждённый JSON в localStorage

- **WHEN** при инициализации `localStorage` содержит невалидный JSON по ключу `gym_subscriptions`
- **THEN** хук возвращает пустой массив `[]` как начальное состояние
- **AND** повреждённые данные удаляются из localStorage

#### Scenario: Нет данных в localStorage

- **WHEN** при инициализации ключ `gym_subscriptions` отсутствует в localStorage
- **THEN** хук возвращает пустой массив `[]` как начальное состояние

### Requirement: Устойчивость к переполнению хранилища

Хук SHALL корректно обрабатывать ситуацию, когда localStorage переполнен при попытке сохранения.

#### Scenario: Квота localStorage превышена

- **WHEN** `localStorage.setItem` бросает исключение при попытке сохранения
- **THEN** исключение перехватывается и не приводит к крашу приложения
- **AND** в консоль выводится предупреждение (`console.warn`)

