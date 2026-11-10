# Code review: `orders_db.py`

AI-assisted review, with every finding verified by a person before it was accepted.
Each finding has four parts: **what and where**, **why it matters**, a **fix**, and **how we verified it**.

| ID | Finding (where) | Severity | Why it matters | Fix | Verified by |
|----|-----------------|----------|----------------|-----|-------------|
| F1 | SQL built with an f-string from `customer` (`search_orders`) | **High** | `x' OR '1'='1` returns every customer's orders | Parameterized query `WHERE customer = ?` | `test_injection_returns_nothing` |
| F2 | SQL built by concatenating `min_amount` (`orders_above`) | **High** | `"0 OR 1=1"` or `"0; ..."` is accepted as SQL | Check it is a number; pass it as a parameter | `test_orders_above_rejects_sql_text` |
| F3 | The `except` block returns the DB error and the full query to the caller (`search_orders`) | Medium | It shows attackers the schema and the query shape, which helps them tune an injection | Log server-side and re-raise; callers show a generic message | `test_database_errors_are_not_returned_as_data` |
| F4 | Returns a list on success but a dict on error (`search_orders`) | Low | Callers must type-check, and errors are easy to miss | Raise on error; always return a list | same test as F3 |
| F5 | Copy loop after `fetchall()` (`orders_above`) | Low | Needless code (quality, not security) | Return `fetchall()` directly | `test_orders_above_filters_by_amount` |

## Rejected findings (false positives)

| ID | AI finding | Why we rejected it |
|----|-----------|--------------------|
| F6 | "Hard-coded `DB_PATH` exposes a secret" | It's a local SQLite file name, not a credential. We kept it and added a comment. |
| F7 | "Use an ORM to prevent SQL injection" | Parameterized queries solve the issue. An ORM is a design choice outside this review's scope. |

## Not checked by this review

- Who is allowed to call these functions (authorization). That lives in the API layer. See Demo 3.
- Whether the database file permissions are correct on the server.
