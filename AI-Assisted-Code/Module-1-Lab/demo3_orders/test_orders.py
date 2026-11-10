"""Checks for Demo 3: the new component must fit the existing project code."""
from decimal import Decimal

import pytest

from inventory_repo import OutOfStockError, ProductRepository
from order_service import OrderService


@pytest.fixture
def repo():
    return ProductRepository([
        {"sku": "NB-A5", "name": "A5 notebook", "price": Decimal("45.00"), "stock": 10},
        {"sku": "PEN-BL", "name": "Blue pen", "price": Decimal("12.50"), "stock": 3},
    ])


def test_order_totals_use_gst_and_money_rounding(repo):
    order = OrderService(repo).place_order([("NB-A5", 2), ("PEN-BL", 3)])
    assert order["subtotal"] == Decimal("127.50")
    assert order["gst"] == Decimal("22.95")
    assert order["total"] == Decimal("150.45")
    assert all(isinstance(order[k], Decimal) for k in ("subtotal", "gst", "total"))


def test_order_lines_describe_each_item(repo):
    line = OrderService(repo).place_order([("PEN-BL", 2)])["lines"][0]
    assert line == {"sku": "PEN-BL", "name": "Blue pen", "qty": 2,
                    "unit_price": Decimal("12.50"), "line_total": Decimal("25.00")}


def test_stock_is_reduced(repo):
    OrderService(repo).place_order([("NB-A5", 4)])
    assert repo.get_product("NB-A5")["stock"] == 6


def test_out_of_stock_uses_the_projects_exception(repo):
    with pytest.raises(OutOfStockError) as err:
        OrderService(repo).place_order([("PEN-BL", 5)])
    assert (err.value.requested, err.value.available) == (5, 3)


def test_order_is_all_or_nothing(repo):
    with pytest.raises(OutOfStockError):
        OrderService(repo).place_order([("NB-A5", 2), ("PEN-BL", 99)])
    assert repo.get_product("NB-A5")["stock"] == 10  # the first line was not applied


def test_repeated_sku_is_checked_against_combined_quantity(repo):
    with pytest.raises(OutOfStockError):
        OrderService(repo).place_order([("PEN-BL", 2), ("PEN-BL", 2)])


@pytest.mark.parametrize("items", [[], [("NB-A5", 0)], [("NB-A5", -1)], [("NB-A5", 1.5)], [("NOPE", 1)]])
def test_invalid_orders_raise_value_error(repo, items):
    with pytest.raises(ValueError):
        OrderService(repo).place_order(items)
