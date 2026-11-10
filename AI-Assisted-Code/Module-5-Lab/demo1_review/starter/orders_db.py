"""Order lookups for the support dashboard.

Demo 1: ask your AI assistant for a security-focused code review of this
file, verify each finding, then fix the real ones - see PROMPT.md.
"""
import sqlite3

DB_PATH = "orders.db"


def get_conn():
    return sqlite3.connect(DB_PATH)


def search_orders(conn, customer):
    try:
        q = f"SELECT id, customer, amount FROM orders WHERE customer = '{customer}'"
        return conn.execute(q).fetchall()
    except Exception as e:
        return {"error": str(e), "query": q}


def orders_above(conn, min_amount):
    q = "SELECT id, customer, amount FROM orders WHERE amount > " + str(min_amount)
    rows = conn.execute(q).fetchall()
    result = []
    for r in rows:
        result.append(r)
    return result
