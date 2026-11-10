# Demo 3 - Weekly status report from raw project data

`inputs/` has the three things a project lead actually has on a Friday:

- `board.csv`: the task board (owner, status, note)
- `commits.txt`: this week's commits
- `standup_notes.md`: messy notes typed during Thursday's stand-up

`starter/status_report.md` is an empty template. The AI fills it in, and the
tests then check the facts against the sources.

## Step 1 - generate the report

Attach all three input files and the template:

```text
Fill in status_report.md for the week ending 13 Nov 2026, using ONLY
the three attached files.

- Completed / In progress / Blockers: one bullet per task, with the task
  ID in bold, the owner in brackets, and the note from the board
- Risks: things that could slip, with the trigger date if one is given
- Decisions: only what the notes mark as "decided"
- Action items: "- [ ] <action> - **Owner**". If the notes do not name an
  owner, write **TBD** - never guess one.
- Open questions: anything unresolved
- Summary: 2-3 sentences for a manager who reads nothing else

Do not add facts that are not in the files.
```

## Step 2 - check it against the sources

```powershell
pytest demo3_status --target starter
```

The tests check what a careful reviewer would:

| Check | Typical AI mistake it catches |
|---|---|
| Every Done / In progress / Blocked task in the right section | T4 listed as done because "cap merged" |
| Action-item owners are real team members or TBD | "two copies" question given to Asha |
| Decisions carried over | demo date left as 19 Nov |

## Step 3 - fix and regenerate

Paste the failing test output back into the chat:

```text
These checks failed against the source files. Correct the report.
Do not change anything that already passed.
<paste failures>
```

The final read is still yours. The tests check facts, not tone or emphasis.
`solution/status_report.md` is a reviewed reference answer.
