"""Discount calculation for the checkout page.

Reference answer for Demo 1: the bug the generated tests found is fixed.

Requirement (from the product owner):
    calculate_discount(price, percentage) returns the price after discount,
    rounded to 2 decimals. price must be >= 0 and percentage between 0 and
    100 inclusive (100 = free item). Anything else raises ValueError.
"""


def calculate_discount(price, percentage):
    for name, value in (("price", price), ("percentage", percentage)):
        if isinstance(value, bool) or not isinstance(value, (int, float)):
            raise ValueError(f"{name} must be a number")
    if price < 0:
        raise ValueError("price cannot be negative")
    if not 0 <= percentage <= 100:  # was: percentage >= 100 rejected 100%
        raise ValueError("percentage must be between 0 and 100")
    return round(price * (1 - percentage / 100), 2)
