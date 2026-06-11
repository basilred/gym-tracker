## ADDED Requirements

### Requirement: System calculates subscription frequency

The system SHALL calculate the average frequency of visits as "visits per week" based on the subscription's start date and total number of visits.

#### Scenario: Frequency with multiple visits over several weeks
- **WHEN** a subscription has 8 visits over 28 days since startDate
- **THEN** the calculated frequency SHALL be 2.0 visits per week

#### Scenario: Frequency with no visits
- **WHEN** a subscription has 0 visits
- **THEN** the calculated frequency SHALL be 0

#### Scenario: Frequency with zero days since start
- **WHEN** a subscription has visits on the same day as startDate
- **THEN** the calculated frequency SHALL equal visits.length (same-day visits per week is undefined, treat as full periods if possible — at minimum show raw visit count)

### Requirement: System shows days since last visit

The system SHALL calculate and display the number of full days elapsed since the most recent visit.

#### Scenario: Days since last visit with recent visit
- **WHEN** today is 2026-06-11 and the last visit was on 2026-06-09
- **THEN** the system SHALL display "2 дня назад"

#### Scenario: Days since last visit with no visits
- **WHEN** a subscription has 0 visits
- **THEN** the system SHALL display "Нет посещений"

### Requirement: System predicts subscription end date

The system SHALL calculate an estimated end date based on current pace: `today + (remainingSessions / visitsPerWeek * 7)`.
If the user has fewer than 2 visits, the system SHALL NOT show a prediction (insufficient data).

#### Scenario: Prediction with sufficient data
- **WHEN** a subscription has 4 remaining sessions and a frequency of 2 visits/week
- **THEN** the predicted end date SHALL be 14 days from today

#### Scenario: Prediction with insufficient data
- **WHEN** a subscription has fewer than 2 visits
- **THEN** the system SHALL NOT display a prediction

### Requirement: System shows longest gap between visits

The system SHALL calculate the longest gap in days between consecutive visits.

#### Scenario: Longest gap with multiple visits
- **WHEN** a subscription has visits on June 1, June 5, and June 20
- **THEN** the longest gap SHALL be 15 days (between June 5 and June 20)

#### Scenario: Longest gap with less than 2 visits
- **WHEN** a subscription has 0 or 1 visits
- **THEN** the longest gap SHALL be 0 and SHALL NOT be displayed

### Requirement: Stats block is displayed below timeline

The system SHALL render a stats section below the visit timeline on the subscription detail page. It SHALL show: frequency, days since last visit, predicted end date, longest gap (when available).

#### Scenario: Stats block renders with all metrics
- **WHEN** viewing a subscription with 4+ visits
- **THEN** the stats block SHALL display frequency, days since last visit, predicted end date, and longest gap

#### Scenario: Stats block renders with partial metrics
- **WHEN** viewing a subscription with 1 visit
- **THEN** the stats block SHALL display frequency and days since last visit only (no prediction, no gap)
