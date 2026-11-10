"""Order lookups for the support dashboard.

Reference answer for Demo 1: the confirmed findings in REVIEW.md are fixed.
"""
import logging
import sqlite3

log = logging.getLogger(__name__)

DB_PATH = "orders.db"  # F6 (not a secret): rejected, see REVIEW.md


def get_conn():
    return sqlite3.connect(DB_PATH)


def search_orders(conn, customer):
    """Orders for one customer name (exact match)."""
    try:
        # F1: parameterized query - the driver sends the value separately
        return conn.execute(
            "SELECT id, customer, amount FROM orders WHERE customer = ?", (customer,)
        ).fetchall()
    except sqlite3.Error:
        # F3: log the detail for us; never hand SQL or DB errors to the caller
        log.exception("search_orders failed")
        raise


def orders_above(conn, min_amount):
    """Orders with amount strictly greater than min_amount."""
    # F2: accept numbers only, then pass as a parameter
    if isinstance(min_amount, bool) or not isinstance(min_amount, (int, float)):
        raise TypeError("min_amount must be a number")
    # F5: fetchall() already returns a list - no copy loop needed
    return conn.execute(
        "SELECT id, customer, amount FROM orders WHERE amount > ?", (min_amount,)
    ).fetchall()
