# Status report: online book loans - week ending 13 Nov 2026

## Summary

Core loan rules are mostly built (3 of 5 rule tasks done). The portal screens
(T7) and staging deployment (T9) are **blocked** on other teams, and the
librarian demo has moved from 19 Nov to **24 Nov**.

## Completed

- **T1** Loan data model (Asha)
- **T2** Borrow: availability and due date (Asha)
- **T3** Borrow: 3-book limit (Rohan)

## In progress

- **T4** Return with late fine and cap (Rohan). The cap rule is merged; tests are pending.
- **T5** Block borrowing while fines are unpaid (Neha). Half done; `pay()` is not written yet. Expected to finish 13 Nov.

## Blockers

- **T7** Portal screens (Vikram). Waiting for API keys from the portal team; two emails, no reply.
- **T9** Deploy to staging (Vikram). The staging server ticket has been open with infra since Mon 9 Nov.

## Risks

- If the API keys have not arrived by Tue 17 Nov, the portal demo slips again.
- Whether a student can borrow two copies of the same book is undecided and could change T2.

## Decisions

- Rohan writes the fee-cap tests himself, not Neha.
- The demo to the librarian moves to **24 Nov** (was 19 Nov).

## Action items

- [ ] Escalate the API keys to the portal team lead, today - **Vikram**
- [ ] Write tests for the fee cap (T4) - **Rohan**
- [ ] Review Rohan's PR, today - **Asha**
- [ ] Finish T5 including `pay()`, by 13 Nov - **Neha**
- [ ] Follow up the staging server ticket with infra - **TBD**
- [ ] Find out whether two copies of the same book are allowed - **TBD**

## Open questions

- Who owns the "two copies of the same book" question? Nobody yet. The project lead should assign it.
- Who follows up with infra on staging? The notes don't say.
