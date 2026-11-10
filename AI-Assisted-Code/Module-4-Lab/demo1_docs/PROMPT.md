# Demo 1 - Document existing code (docs that are tested)

`starter/shipping.py` works but has no documentation at all: no module
docstring, no function docstrings, no README. It also has two rules a reader
could easily get wrong: weight is rounded **up** to 0.5 kg slabs, and only
**Sundays** are skipped (Saturday is a delivery day).

## Step 1 - ask the AI to explain first

```text
Explain what each function in shipping.py does: purpose, inputs, outputs,
errors raised and any non-obvious rule. Do not write documentation yet.
List anything you are unsure about.
```

Check the explanation against the code. Did it notice the round-up and the
Sunday-only rule? If not, correct it in the chat before going on.

## Step 2 - generate docstrings with runnable examples

```text
Add Google-style docstrings to every function in shipping.py and a module
docstring. Each function docstring needs Args, Returns, Raises and an
Examples section in doctest format (>>> lines with the exact output).
Also add a one-line comment to each constant. Do not change any code.
```

## Step 3 - generate the README

```text
Write README.md for this module with these sections: short description,
## Features, ## Requirements, ## Usage (doctest-style >>> examples),
a table of rates and delivery days, ## Limitations, ## Running the tests.
Use only facts from the code.
```

## Step 4 - prove the docs are true

```powershell
pytest demo1_docs --target starter
```

The tests check that the docs are complete **and** run every `>>>` example.
AI-written examples are often slightly wrong: a date one day off, or a slab
miscounted. When this kit was built, the first draft said Friday plus 3 working
days was Wednesday. It is Tuesday, and doctest caught it straight away.

When an example fails, fix the **documentation**, not the code. The code was right.

`solution/shipping.py` and `solution/README.md` are reviewed reference answers.
