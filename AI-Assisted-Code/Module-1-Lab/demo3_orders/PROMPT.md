# Demo 3 - Build a component with project context

`starter/inventory_repo.py` is **existing project code**: a repository, a
custom exception and a `money()` helper. `starter/order_service.py` is the new
component we want. The demo sends the same request twice, once without context and once with it.

## Step 1 - no context (to show the problem)

In a fresh chat, without attaching any files:

```text
Write an OrderService class in Python with a place_order method that
reduces stock and adds 18% GST.
```

The typical result invents its own `Product` class or a `self.inventory` dict,
uses `float` for money, and raises a generic `Exception` when stock runs out. It
looks fine, but it does not fit our project, and `pytest demo3_orders --target starter` fails.

## Step 2 - give context, then ask

Attach `inventory_repo.py` and `order_service.py` (Copilot: `#file`; Windsurf or
Claude: `@file`; ChatGPT: paste them in), then send:

```text
Implement OrderService.place_order(items) in order_service.py.
Use ONLY the existing code in inventory_repo.py - do not change that file.

- items is a list of (sku, qty) tuples; repeated SKUs are combined
- qty must be a positive int; empty order, bad qty or unknown SKU -> ValueError
- not enough stock -> raise the existing OutOfStockError
- all-or-nothing: validate every line before changing any stock
- reduce stock with repo.update_stock
- money follows the project convention: Decimal via money()
- GST is 18% of the subtotal

Return {"lines": [...], "subtotal", "gst", "total"} where each line is
{"sku", "name", "qty", "unit_price", "line_total"}.
Add a docstring. Do not add new dependencies.
```

## Step 3 - review against the context

Check the answer line by line:

- Does it call `get_product` and `update_stock`, rather than methods it invented?
- Does it raise `OutOfStockError`?
- Does every amount go through `money()`?
- Does stock change only after all the checks pass?

Then run the tests:

```powershell
pytest demo3_orders --target starter
```

`solution/order_service.py` is a reviewed reference answer.
