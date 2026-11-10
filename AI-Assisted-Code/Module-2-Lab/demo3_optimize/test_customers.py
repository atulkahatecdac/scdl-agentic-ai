"""Checks for Demo 3: an optimization must not change any result.

These pass on the starter AND the solution. Speed is measured separately with
benchmark.py, because timing assertions make tests flaky.
"""
from customers import orders_with_names, repeat_customers

ORDERS = [
    {"order_id": "O1", "customer_id": "C2"},
    {"order_id": "O2", "customer_id": "C1"},
    {"order_id": "O3", "customer_id": "C2"},
    {"order_id": "O4", "customer_id": "C9"},
    {"order_id": "O5", "customer_id": "C1"},
    {"order_id": "O6", "customer_id": "C2"},
]
CUSTOMERS = [
    {"id": "C1", "name": "Asha"},
    {"id": "C2", "name": "Rohan"},
    {"id": "C2", "name": "Rohan (duplicate record)"},
]


def test_repeat_customers_in_first_seen_order():
    assert repeat_customers(ORDERS) == ["C2", "C1"]


def test_no_repeat_customers():
    assert repeat_customers(ORDERS[:2]) == []


def test_empty_input():
    assert repeat_customers([]) == []
    assert orders_with_names([], CUSTOMERS) == []


def test_names_are_looked_up_and_unknown_is_kept():
    assert orders_with_names(ORDERS[:4], CUSTOMERS) == [
        ("O1", "Rohan"), ("O2", "Asha"), ("O3", "Rohan"), ("O4", "Unknown"),
    ]


def test_first_matching_customer_record_wins():
    # The old code stopped at the first match; the new code must too.
    assert orders_with_names([ORDERS[0]], CUSTOMERS) == [("O1", "Rohan")]
