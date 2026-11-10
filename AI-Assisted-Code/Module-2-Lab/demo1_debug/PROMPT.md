# Demo 1 - Debug a runtime error and a logic error

`starter/sales_report.py` builds a revenue-by-region report from `sales.csv`.
It has two bugs: one crashes, the other silently gives a wrong number.

## Step 1 - reproduce

```powershell
python demo1_debug/starter/sales_report.py
```

```text
TypeError: can't multiply sequence by non-int of type 'str'
```

## Step 2 - give the AI the full context

Paste the **whole traceback** and the function, and say what you expected:

```text
Running sales_report.py fails with this traceback:

<paste the full traceback>

Here is the function (sales.csv has columns
order_id,region,product,quantity,unit_price):

<paste order_value>

Expected: the order value as a number. What is the root cause?
Suggest the smallest fix - do not change anything else.
```

Expected answer: `csv.DictReader` returns strings, so `"40" * "45.00"` fails.
Convert with `int()` / `float()`. Apply only that change.

## Step 3 - the logic error (no traceback)

The report now runs, but `pytest demo1_debug --target starter` still has a failure:
North shows 11,987.50, and finance says it should be 11,487.50.

```text
The business rule is: "an order worth 10,000 or more gets a 5% bulk discount".
Order 1008 is 8 x 1250.00 = 10,000 and did NOT get the discount.
Trace order_value step by step with that input and find where the
logic differs from the rule.
```

Expected answer: `>` should be `>=`. It is a one-character fix.

## Step 4 - verify

```powershell
pytest demo1_debug --target starter
python demo1_debug/starter/sales_report.py
```

All 5 tests pass, and North is 11,487.50. `solution/sales_report.py` has both fixes.
