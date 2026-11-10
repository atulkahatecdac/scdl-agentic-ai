# Demo 3 - Generate security tests for an API endpoint

`starter/invoices_api.py` is the handler for `GET /invoices/<id>` in a
customer portal. It works for the happy path, and its normal tests pass.
Security tests ask a different question: *what happens when someone misuses it?*

## Step 1 - look at it like an attacker

```python
>>> from invoices_api import handle_get_invoice
>>> handle_get_invoice({"name": "rohan", "role": "customer"}, 101)
(200, {'id': 101, 'owner': 'asha', 'amount': 18408.0, ...})     # Asha's invoice!
>>> handle_get_invoice({"name": "rohan", "role": "customer"}, 999)
(500, {'error': 'KeyError(999)', 'db': 'postgresql://billing_app:S3cr3t-Pa55@...'})
```

(Run these from inside `demo3_authz/starter`.)

## Step 2 - ask for security tests, by category

```text
Act as a security tester. Write pytest tests for handle_get_invoice in
invoices_api.py. Users are dicts {"name", "role"} with role "customer"
or "admin". Customers may only see their own invoices; admins see all.

Cover, in separate groups:
1. Authentication - None, {}, empty name, unknown role -> 401
2. Authorization (IDOR) - a customer reading another customer's invoice;
   it must look exactly like "not found" (404), so IDs can't be discovered
3. Input validation - "abc", "101 OR 1=1", "", None, -1, 0, True, "1e3"
   -> 400, never 500
4. Information leakage - no error body may contain connection strings,
   passwords, host names, exception class names or tracebacks
Keep two happy-path tests (owner reads own, admin reads any).
```

## Step 3 - run against the starter

```powershell
pytest demo3_authz --target starter
```

```text
17 failed, 3 passed
```

Only the happy path passes. The handler has **no authorization check at all**,
and its error responses leak a database password.

## Step 4 - fix, guided by the failing tests

```text
Make handle_get_invoice pass these tests: check the user first (401),
validate the id (400), return 404 for both missing and not-yours invoices,
log exceptions server-side and return a generic 500 message. Read the
database URL from the BILLING_DB_URL environment variable.
```

```powershell
pytest demo3_authz --target starter     # 20 passed
```

**Review the fix too.** AI fixes sometimes return 403 for "not yours", which
leaks which IDs exist, or they over-validate and reject `" 101 "`. The tests
pin down the behaviour we decided on. `solution/invoices_api.py` is the reviewed reference.
