"""Discount calculation for the checkout page.

Demo 1: there are no tests for this function yet. Ask your AI assistant to
generate them - see PROMPT.md.

Requirement (from the product owner):
    calculate_discount(price, percentage) returns the price after discount,
    rounded to 2 decimals. price must be >= 0 and percentage between 0 and
    100 inclusive (100 = free item). Anything else raises ValueError.
"""


def calculate_discount(price, percentage):
    if price < 0:
        raise ValueError("price cannot be negative")
    if percentage < 0 or percentage >= 100:
        raise ValueError("percentage must be between 0 and 100")
    return round(price * (1 - percentage / 100), 2)
