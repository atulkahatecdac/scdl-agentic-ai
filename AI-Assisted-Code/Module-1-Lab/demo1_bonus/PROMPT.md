# Demo 1 - Weak vs strong prompt: generate a function

Open `starter/bonus.py` in VS Code and open your AI assistant's chat panel
(GitHub Copilot Chat, Windsurf, ChatGPT or Claude all work).

## Step 1 - the weak prompt

```text
Write a bonus function in Python.
```

Point out what the assistant had to **guess**: the parameters, the rating names,
the percentages, what to do with bad input, whether there is a cap, and rounding.
Run the tests against whatever it produced (paste it into `starter/bonus.py`):

```powershell
pytest demo1_bonus --target starter
```

Most tests fail. The code is not wrong; the prompt was missing the requirements.

## Step 2 - the strong prompt

Undo the change, then paste this prompt instead:

```text
Task: Implement calculate_bonus(salary, rating) in bonus.py.

Context: Part of an HR portal written in Python 3.12. No external libraries.

Inputs:
- salary: annual salary in rupees, int or float, must be > 0
- rating: one of "outstanding", "exceeds", "meets", "below"
  (ignore case and surrounding spaces)

Output: the bonus as a float rounded to 2 decimals.

Rules:
- outstanding 20%, exceeds 10%, meets 5%, below 0%
- the bonus is capped at 200,000
- raise TypeError if salary is not a number (reject bool too)
- raise ValueError if salary <= 0, or if the rating is unknown;
  the message must list the valid ratings

Examples:
- calculate_bonus(600000, "exceeds")      -> 60000.0
- calculate_bonus(5000000, "outstanding") -> 200000.0

Write readable code with type hints and a docstring. Keep the rates in a
dictionary constant, not in if/elif chains.
```

## Step 3 - review, then run

Read every line before accepting it. Then:

```powershell
pytest demo1_bonus --target starter
```

All 13 tests should pass. If one fails, paste the failure into the chat and ask:
*"This test fails. Is the test or the code wrong, given the rules in my prompt?"*

`solution/bonus.py` is a reviewed reference answer.
