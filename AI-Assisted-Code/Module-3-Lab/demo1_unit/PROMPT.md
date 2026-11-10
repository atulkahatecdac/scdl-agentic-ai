# Demo 1 - Generate unit tests, and let them find a bug

`starter/discount.py` has a function, a written requirement, and no tests.
The demo folder's `test_discount.py` is the reviewed result. Hide it (or
rename it) before the demo if you want to generate it live.

## Step 1 - ask for scenarios first, not code

```text
Here is a function and its requirement. List the test scenarios you would
write, grouped as: normal cases, boundary values, invalid input.
Do not write code yet.

<paste discount.py, including the requirement docstring>
```

Review the list together. Is 100% there? Is a string price there? Scenarios
are cheap to fix. 200 lines of test code are not.

## Step 2 - generate the tests

```text
Now write pytest tests for those scenarios in test_discount.py.
- one behaviour per test, descriptive names (test_hundred_percent_makes_item_free)
- use pytest.mark.parametrize for groups of similar inputs
- use pytest.raises with match= for errors
- expected values must come from the REQUIREMENT, not from running the code
```

That last line matters. A test that copies the code's current output just
locks in the bugs.

## Step 3 - run them against the code

```powershell
pytest demo1_unit --target starter
```

```text
FAILED test_hundred_percent_makes_item_free - ValueError
FAILED test_non_numeric_input_raises_value_error[...] (x3)
4 failed, 10 passed
```

## Step 4 - is the test wrong, or the code?

Ask the AI, then decide as a team:

```text
This test fails. Using only the requirement text, is the test wrong or the code?

<paste failure + requirement>
```

- **100%:** the requirement says "inclusive (100 = free item)", so the code is
  wrong. `>= 100` should be `> 100`.
- **String input:** the code raises `TypeError` and the requirement says "anything else
  raises ValueError", so the code is wrong again. In real projects, ask the product owner.

Fix the code (not the tests!) and rerun. `solution/discount.py` shows the fix.
