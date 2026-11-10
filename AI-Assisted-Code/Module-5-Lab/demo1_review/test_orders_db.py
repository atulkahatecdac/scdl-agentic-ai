"""Security tests for Demo 1: each confirmed review finding gets a test."""
import sqlite3

import pytest

from orders_db import orders_above, search_orders


@pytest.fixture
def conn():
    c = sqlite3.connect(":memory:")
    c.execute("CREATE TABLE orders (id INTEGER PRIMARY KEY, customer TEXT, amount REAL)")
    c.executemany("INSERT INTO orders (customer, amount) VALUES (?, ?)", [
        ("Asha", 1200.0), ("Rohan", 450.0), ("O'Brien", 990.0), ("Asha", 75.0),
    ])
    yield c
    c.close()


def test_search_finds_a_customers_orders(conn):
    assert [r[2] for r in search_orders(conn, "Asha")] == [1200.0, 75.0]


def test_name_with_apostrophe_works(conn):
    # With string-built SQL this name breaks the query.
    assert len(search_orders(conn, "O'Brien")) == 1


@pytest.mark.parametrize("payload", ["x' OR '1'='1", "' OR 1=1 --", "Asha' --"])
def test_injection_returns_nothing(conn, payload):  # F1
    assert search_orders(conn, payload) == []


def test_database_errors_are_not_returned_as_data(conn):  # F3, F4
    conn.close()
    with pytest.raises(sqlite3.Error):
        search_orders(conn, "Asha")


def test_orders_above_filters_by_amount(conn):  # F5
    assert sorted(r[2] for r in orders_above(conn, 500)) == [990.0, 1200.0]


@pytest.mark.parametrize("payload", ["0 OR 1=1", "0; DROP TABLE orders", "500"])
def test_orders_above_rejects_sql_text(conn, payload):  # F2
    with pytest.raises(TypeError):
        orders_above(conn, payload)
