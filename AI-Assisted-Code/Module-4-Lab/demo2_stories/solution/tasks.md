# Backlog: online book loans

Generated with AI from `stories.md`, then reviewed by the team. Estimates are
the team's, not the AI's. The AI's suggestions were used as a starting point only.

| ID | Task | Type | Story | Depends on | Estimate |
|----|------|------|-------|-----------|---------:|
| T1 | Loan data model: copies, loans, fees | Dev | US-1 | none | 0.5 d |
| T2 | Borrow: availability check and due date (AC-1, AC-2) | Dev | US-1 | T1 | 0.5 d |
| T3 | Borrow: 3-book limit (AC-3) | Dev | US-1 | T2 | 0.25 d |
| T4 | Return with late fine and Rs 100 cap (AC-4, AC-5) | Dev | US-2 | T1 | 0.5 d |
| T5 | Block borrowing while fines are unpaid; pay() (AC-6) | Dev | US-3 | T4 | 0.25 d |
| T6 | Acceptance tests AC-1 to AC-6 | Test | All | T2-T5 | 0.5 d |
| T7 | Portal screens: borrow, return, my loans | Dev | US-1, US-2 | T2, T4 | 2 d |
| T8 | README and librarian how-to page | Docs | All | T7 | 0.5 d |
| T9 | Deploy to staging and demo to the librarian | Deploy | All | T6, T7 | 0.5 d |

## Phases

1. **Core rules:** T1 to T5, with T6 written alongside
2. **Portal:** T7
3. **Release:** T8, T9

## Risks noticed while planning

- The portal team's availability (T7) is not confirmed. This is the critical path.
- "Two copies of the same book" is undecided and could change T2.
