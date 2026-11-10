"""Checks for Demo 1. Each bug gets a test, so it cannot come back unnoticed."""
from pathlib import Path

import pytest

from sales_report import load_sales, order_value, revenue_by_region

CSV = Path(__file__).parent / "sales.csv"


def row(qty, price):
    # Values are strings, exactly as csv.DictReader returns them.
    return {"region": "West", "quantity": str(qty), "unit_price": str(price)}


def test_small_order_has_no_discount():
    assert order_value(row(40, "45.00")) == 1800.0


def test_order_below_threshold_has_no_discount():
    assert order_value(row(200, "45.00")) == 9000.0


def test_order_above_threshold_gets_discount():
    assert order_value(row(10, "1250.00")) == 11875.0  # 12,500 less 5%


def test_order_exactly_at_threshold_gets_discount():
    # Bug 2: "10,000 or more" must include 10,000 itself.
    assert order_value(row(8, "1250.00")) == 9500.0


def test_revenue_by_region_from_the_sample_file():
    totals = revenue_by_region(load_sales(CSV))
    assert totals == pytest.approx({"West": 7800.0, "North": 11487.5, "South": 14000.0})
