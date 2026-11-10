# User stories: online book loans

Generated from `brief.md` with AI, then reviewed with the Head Librarian.
Each acceptance criterion has an ID. `test_acceptance.py` has one test per ID.

## US-1 Borrow a book online

**As a** student, **I want** to borrow a book through the portal,
**so that** I don't have to queue at the library desk.

- **AC-1** *Given* a book with at least one copy on the shelf,
  *when* I borrow it, *then* the due date is 14 days from today
  and one fewer copy is available.
- **AC-2** *Given* all copies of a book are on loan,
  *when* I try to borrow it, *then* I am told it is not available.
- **AC-3** *Given* I already hold 3 books,
  *when* I try to borrow another, *then* I am refused with a message about the limit.

## US-2 Return a book and pay late fines

**As a** student, **I want** to know what I owe when I return a book,
**so that** fines are clear and fair.

- **AC-4** *Given* I return a book on or before the due date,
  *then* no fine is charged.
- **AC-5** *Given* I return a book late, *then* the fine is Rs 5 per day late,
  but never more than Rs 100 for one book.

## US-3 Clear fines before borrowing

**As a** librarian, **I want** students with unpaid fines to pay before borrowing,
**so that** fines actually get collected.

- **AC-6** *Given* I have unpaid fines, *when* I try to borrow, *then* I am refused
  until the fine is paid in full; after paying I can borrow again.

## Out of scope for this release

- **Due-date reminders.** The brief says "not urgent, maybe later". Moved to the backlog.

## Questions raised during review

| Question | Answer from the Head Librarian |
|---|---|
| Does "two weeks" mean 14 calendar days? | Yes |
| Can a student borrow two copies of the same book? | Not decided. Not handled in this release |
| Is the Rs 100 cap per book or per student? | Per book |
