"""Customer analytics for the monthly loyalty mailer.

Reference answer for Demo 3: same results, linear time.
"""
from collections import Counter


def repeat_customers(orders):
    """Customer IDs with more than one order, in order of first appearance."""
    counts = Counter(o["customer_id"] for o in orders)  # one pass, O(n)
    # dict.fromkeys keeps first-seen order and drops duplicates
    return [cid for cid in dict.fromkeys(o["customer_id"] for o in orders) if counts[cid] > 1]


def orders_with_names(orders, customers):
    """Each order as (order_id, customer name); 'Unknown' if not found."""
    names = {}
    for c in customers:
        names.setdefault(c["id"], c["name"])  # first match wins, as before
    return [(o["order_id"], names.get(o["customer_id"], "Unknown")) for o in orders]
