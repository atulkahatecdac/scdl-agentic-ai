# Demo 2 - Refactor safely: lock behaviour first

`starter/payroll.py` works, but `process_payroll` reads the file, validates
rows, calculates tax (twice, copy-pasted) and formats the report, all in one
function with names like `a`, `t`, `tx` and `x`.

## Step 1 - lock the behaviour

Before touching the code, capture what it does today:

```powershell
python demo2_refactor/starter/payroll.py
pytest demo2_refactor --target starter
```

`expected_report.txt` is the "golden master" (today's exact output), and
`test_payroll.py` compares against it. On the starter you should see
**3 passed, 4 skipped**. The skipped tests are for helpers that don't exist yet.

To have the AI write characterization tests for you:

```text
Write pytest characterization tests for process_payroll in payroll.py.
They must capture the CURRENT behaviour exactly, including the report
format, the TOTAL line and the SKIPPED line. Do not judge whether the
behaviour is correct - just lock it in.
```

## Step 2 - ask for the refactor, with constraints

```text
Refactor process_payroll in payroll.py.

Must NOT change: the function name and signature, the returned text
(character for character), and which rows are skipped.

Do:
- split it into small functions: read_employees, is_payable,
  calculate_tax(gross), net_pay(gross, emp_type), format_line
- the tax slab logic must exist in exactly one place
- replace magic numbers (50000, 0.10, 0.20, 1800) with named constants
- use descriptive variable names and a with-block for the file

Show the result as a diff and explain each change in one line.
```

## Step 3 - review the diff, then run the same tests

```powershell
pytest demo2_refactor --target starter
```

You should now see **7 passed**: the characterization tests still pass, and the
helper tests run now that the helpers exist. If a characterization test fails,
the refactor changed behaviour. Reject it, or ask the AI to make a smaller change.

`solution/payroll.py` is a reviewed reference answer.
