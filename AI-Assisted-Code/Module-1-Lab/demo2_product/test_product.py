"""Checks for Demo 2. Written from the class prompt, before looking at the AI's code."""
import pytest

from product import Product


@pytest.fixture
def pen():
    return Product("P-100", "Gel pen", 12.5, 40)


def test_new_product_keeps_its_attributes(pen):
    assert (pen.product_id, pen.name, pen.price, pen.quantity) == ("P-100", "Gel pen", 12.5, 40)


def test_quantity_defaults_to_zero():
    assert Product("P-1", "Eraser", 5).quantity == 0


def test_total_value(pen):
    assert pen.total_value() == 500.0


def test_update_price(pen):
    pen.update_price(15)
    assert pen.total_value() == 600.0


def test_add_and_remove_stock(pen):
    pen.add_stock(10)
    pen.remove_stock(30)
    assert pen.quantity == 20


def test_cannot_remove_more_than_in_stock(pen):
    with pytest.raises(ValueError):
        pen.remove_stock(41)
    assert pen.quantity == 40  # unchanged after a failed call


@pytest.mark.parametrize("bad", [0, -5])
def test_stock_changes_must_be_positive(pen, bad):
    with pytest.raises(ValueError):
        pen.add_stock(bad)
    with pytest.raises(ValueError):
        pen.remove_stock(bad)


def test_negative_price_is_rejected(pen):
    with pytest.raises(ValueError):
        Product("P-2", "Ruler", -1)
    with pytest.raises(ValueError):
        pen.update_price(-1)


@pytest.mark.parametrize("bad", ["10", None, True])
def test_non_numeric_price_is_rejected(bad):
    with pytest.raises(TypeError):
        Product("P-3", "Stapler", bad)


def test_fractional_quantity_is_rejected(pen):
    with pytest.raises(TypeError):
        pen.add_stock(2.5)


@pytest.mark.parametrize("pid, name", [("", "Glue"), ("P-4", "  ")])
def test_blank_id_or_name_is_rejected(pid, name):
    with pytest.raises(ValueError):
        Product(pid, name, 10)


def test_repr_is_readable(pen):
    assert repr(pen) == "Product('P-100', 'Gel pen', price=12.5, quantity=40)"
