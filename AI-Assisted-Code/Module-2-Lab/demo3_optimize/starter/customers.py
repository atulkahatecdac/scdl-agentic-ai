"""Customer analytics for the monthly loyalty mailer.

Demo 3: correct, but slow on a real month of orders. Measure first
(benchmark.py), then optimize with your AI assistant - see PROMPT.md.
"""


def repeat_customers(orders):
    """Customer IDs with more than one order, in order of first appearance."""
    ids = [o["customer_id"] for o in orders]
    result = []
    for cid in ids:
        if ids.count(cid) > 1 and cid not in result:
            result.append(cid)
    return result


def orders_with_names(orders, customers):
    """Each order as (order_id, customer name); 'Unknown' if not found."""
    out = []
    for o in orders:
        name = "Unknown"
        for c in customers:
            if c["id"] == o["customer_id"]:
                name = c["name"]
                break
        out.append((o["order_id"], name))
    return out
