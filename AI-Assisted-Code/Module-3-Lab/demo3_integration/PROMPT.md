# Demo 3 - Integration tests + coverage

`starter/enrollment.py` has a repository that talks to SQLite and a service
that applies the rules (no duplicates, capacity, drop). An integration test
runs them **together** against a real database. SQLite `:memory:` gives each
test a fresh, throw-away database.

## Step 1 - first round of tests

```text
Write pytest integration tests for EnrollmentService in enrollment.py.
Use a fixture that creates a fresh sqlite3 ":memory:" connection,
an EnrollmentRepository, and two courses: PY101 (capacity 2) and
AI201 (capacity 30). Close the connection after each test.
Check results through the service AND directly in the database.
```

A typical first answer covers only the happy path: enroll, check that it was stored, drop.
In `test_enrollment.py` these tests have `happy` in their names.

## Step 2 - measure coverage

```powershell
pytest demo3_integration -k happy --target starter --cov=enrollment --cov-branch --cov-report=term-missing
```

```text
Name                     Stmts   Miss Branch BrPart  Cover   Missing
demo3_.../enrollment.py     40      4      8      4    83%   58, 60, 62, 68
```

83% looks fine, but **every missed line is a `raise`**. None of the error rules is tested.

## Step 3 - ask the AI to close the gaps

```text
Here is the coverage report and the source. Lines 58, 60, 62 and 68 are
never executed. For each one, write an integration test that reaches it,
and say which business rule it checks. Put the expected behaviour from
the RULE (e.g. "a course with capacity 2 takes exactly 2 students"),
not from the current code.
```

## Step 4 - run everything

```powershell
pytest demo3_integration --target starter
```

```text
FAILED test_full_course_rejects_the_next_student
FAILED test_seats_left_for_unknown_course_is_a_clear_error
2 failed, 6 passed
```

The new tests found two real bugs:

1. **Capacity off-by-one.** `count > capacity` lets a third student into a two-seat course.
2. **Unknown course in `seats_left`.** It crashes with `TypeError: 'NoneType' object is not subscriptable`.

Fix both, then check that coverage reaches 100%:

```powershell
pytest demo3_integration --target starter --cov=enrollment --cov-branch --cov-report=term-missing
```

**Lesson:** coverage shows what was *not* run. It does not show that the assertions are right.
`solution/enrollment.py` is a reviewed reference answer.
