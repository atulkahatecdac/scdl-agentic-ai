# Demo 2 - Brief -> user stories -> acceptance criteria -> tests

`brief.md` is a short, informal note from the Head Librarian.
`starter/loans.py` is code a developer wrote from a hallway chat, before any stories existed.

## Step 1 - user stories with acceptance criteria

```text
Turn this business brief into user stories.
Format: "As a <role>, I want <goal>, so that <benefit>".
Give every story acceptance criteria in Given / When / Then form,
numbered AC-1, AC-2, ... across all stories, with concrete numbers.
Put anything the brief marks as "later" under "Out of scope".
Finally, list the questions you would ask the librarian - things the brief
leaves ambiguous. Do not invent answers to them.

<paste brief.md>
```

Review it as a team. Typical fixes:

- The AI invents details ("email notification", "max 2 renewals"). Delete them.
- It misses the per-book Rs 100 cap. Add it.
- Its questions are the most valuable part. "Is the cap per book or per student?" is a real ambiguity.

Save the result as `starter/stories.md`.

## Step 2 - break it into tasks

```text
Break these stories into a backlog table: ID, task, type (Dev / Test /
Docs / Deploy), story, depends on, estimate. Group the tasks into phases
and list the risks you see. Mark your estimates as rough guesses.
```

The team replaces the estimates. AI estimates are a starting point, not a commitment.
See `solution/tasks.md`.

## Step 3 - acceptance criteria become tests

```text
Write one pytest test per acceptance criterion for loans.py. Name each
test test_ac<number>_<what it checks>, so each one can be traced back.
```

```powershell
pytest demo2_stories --target starter
```

```text
FAILED test_ac3_fourth_book_is_refused
FAILED test_ac5_late_fine_is_capped_at_100
```

The hallway-chat code never had the 3-book limit or the fine cap. The stories
made the requirements explicit, and the tests made the gap visible.
`test_every_criterion_has_a_test` checks traceability: each **AC-n** in
`stories.md` needs a matching test.

## Step 4 - close the gaps

Ask the AI to implement AC-3 and AC-5 in `loans.py` without changing anything else, then rerun.
`solution/` has the reviewed stories, backlog and code.
