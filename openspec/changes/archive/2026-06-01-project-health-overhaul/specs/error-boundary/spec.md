# error-boundary Specification

## Purpose
Защита приложения от краха при необработанных исключениях в React-компонентах через Error Boundary с fallback UI.

## ADDED Requirements

### Requirement: Error Boundary wraps the application

The application SHALL include a React Error Boundary component that wraps the route tree in `App.tsx`. Any unhandled error in a descendant component SHALL be caught by the boundary.

#### Scenario: Component throws an error
- **WHEN** a descendant component throws an unhandled error during rendering or lifecycle
- **THEN** the Error Boundary catches the error
- **AND** the fallback UI is displayed instead of a white screen

#### Scenario: Error does not propagate
- **WHEN** a component inside the Error Boundary throws an error
- **THEN** sibling components and parent layout (header, navigation) continue to function
- **AND** only the erroring subtree is replaced with the fallback UI

### Requirement: Fallback UI with recovery action

The Error Boundary SHALL render a fallback UI that informs the user an error occurred and provides a way to recover. The recovery action SHALL remount the erroring component tree.

#### Scenario: Fallback UI displayed
- **WHEN** the Error Boundary catches an error
- **THEN** a message is displayed (e.g., "Что-то пошло не так")
- **AND** a "Попробовать снова" button is visible

#### Scenario: Recovery via remount
- **WHEN** the user clicks "Попробовать снова"
- **THEN** the error state is reset and the component tree remounts
- **AND** if the error was transient, the application operates normally

### Requirement: Error logging

The Error Boundary SHALL log caught errors to the console with descriptive context. In development mode, the original error and error info SHALL be visible.

#### Scenario: Error logging in development
- **WHEN** an error is caught in development mode
- **THEN** `console.error` is called with the error object and component stack trace

#### Scenario: Error logging in production
- **WHEN** an error is caught in production mode
- **THEN** `console.error` is called with a sanitized error message (no stack trace exposure to users)
