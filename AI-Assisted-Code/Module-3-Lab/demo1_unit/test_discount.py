"""AI-generated unit tests for calculate_discount (Demo 1), after review.

Generated from the requirement in the docstring, then reviewed: names made
descriptive, one wrong expectation corrected, duplicates removed.
"""
import pytest

from discount import calculate_discount


# --- normal cases -------------------------------------------------------------
@pytest.mark.parametrize(
    "price, percentage, expected",
    [
        (1000, 10, 900.0),
        (499.99, 15, 424.99),
        (250, 50, 125.0),
    ],
)
def test_typical_discounts(price, percentage, expected):
    # Arrange: inputs above.  Act + Assert:
    assert calculate_discount(price, percentage) == expected


# --- boundary values ------------------------------------------------------------
def test_zero_percent_returns_original_price():
    assert calculate_discount(1000, 0) == 1000.0


def test_hundred_percent_makes_item_free():
    # Requirement: "between 0 and 100 inclusive (100 = free item)"
    assert calculate_discount(1000, 100) == 0.0


def test_zero_price_stays_zero():
    assert calculate_discount(0, 25) == 0.0


def test_result_is_rounded_to_two_decimals():
    assert calculate_discount(10, 33) == 6.7


# --- invalid input ------------------------------------------------------------
@pytest.mark.parametrize("percentage", [-1, 100.01, 150])
def test_percentage_out_of_range_is_rejected(percentage):
    with pytest.raises(ValueError, match="percentage"):
        calculate_discount(1000, percentage)


def test_negative_price_is_rejected():
    with pytest.raises(ValueError, match="price"):
        calculate_discount(-5, 10)


@pytest.mark.parametrize("price, percentage", [("1000", 10), (1000, None), (True, 10)])
def test_non_numeric_input_raises_value_error(price, percentage):
    with pytest.raises(ValueError):
        calculate_discount(price, percentage)
