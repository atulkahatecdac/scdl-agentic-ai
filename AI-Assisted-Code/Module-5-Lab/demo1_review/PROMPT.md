# Demo 1 - AI code review: verify every finding

`starter/orders_db.py` is a short, realistic file: order lookups for a
support dashboard. It runs, and it looks fine at a glance.

## Step 1 - a structured review prompt

```text
Act as a senior Python security reviewer.

Context: orders_db.py is used by an internal support dashboard. The
customer name and minimum amount come straight from a web form.

Review it for: SQL injection, input validation, error handling and
information leakage, and code quality.

For each finding give: ID, location (function), severity (High / Medium /
Low), why it matters (a concrete attack or failure), and a fix.
Mark anything you are unsure about as "needs verification".
Do not rewrite the file yet.

<paste orders_db.py>
```

## Step 2 - verify each finding yourself

Prove the important ones in a Python shell or with a test:

```python
>>> import sqlite3, orders_db
>>> c = sqlite3.connect(":memory:")
>>> c.execute("CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, amount REAL)")
>>> c.executemany("INSERT INTO orders (customer, amount) VALUES (?, ?)", [("Asha", 1200), ("Rohan", 450)])
>>> orders_db.search_orders(c, "x' OR '1'='1")
[(1, 'Asha', 1200.0), (2, 'Rohan', 450.0)]        # every customer's orders!
```

Reject the false positives and write down why. A typical one: *"hard-coded
DB_PATH exposes a secret"*. It's a file name, not a credential.
`solution/REVIEW.md` shows the finished report, with a **Rejected findings** table.

## Step 3 - fix only the confirmed findings

```text
Fix findings F1-F5 only. Use parameterized queries, accept numbers only
for min_amount, log database errors and re-raise instead of returning
them. Keep the function names and signatures.
```

## Step 4 - tests prove the fixes

```powershell
pytest demo1_review --target starter
```

Before the fix: **8 failed, 2 passed**. After: **10 passed**. Each confirmed
finding has a test, so it cannot quietly come back.
