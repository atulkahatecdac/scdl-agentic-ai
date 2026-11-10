"""Shipping charges and delivery estimates for the online store.

Reference answer for Demo 1: AI-generated documentation after review.
The examples in each docstring are run by the tests (doctest), so they
cannot silently drift away from the code.
"""
from datetime import date, timedelta
from math import ceil

#: Price in rupees per started 0.5 kg slab, by zone.
RATES = {"local": 40, "regional": 60, "national": 90}
#: Delivery time in working days (Monday to Saturday), by zone.
DAYS = {"local": 1, "regional": 3, "national": 5}
#: Heavier parcels must go by freight, not courier.
MAX_KG = 20


def shipping_cost(weight_kg, zone):
    """Return the courier charge in rupees for one parcel.

    Weight is charged in 0.5 kg slabs, rounded UP: 1.2 kg is billed as 1.5 kg.

    Args:
        weight_kg: Parcel weight in kg; more than 0 and at most 20.
        zone: "local", "regional" or "national".

    Returns:
        int: number of slabs times the zone rate.

    Raises:
        ValueError: unknown zone, or weight outside (0, 20] kg.

    Examples:
        >>> shipping_cost(1.2, "local")      # 3 slabs x 40
        120
        >>> shipping_cost(0.5, "national")   # exactly one slab
        90
        >>> shipping_cost(25, "local")
        Traceback (most recent call last):
        ...
        ValueError: weight must be more than 0 and at most 20 kg
    """
    if zone not in RATES:
        raise ValueError(f"unknown zone: {zone}")
    if weight_kg <= 0 or weight_kg > MAX_KG:
        raise ValueError(f"weight must be more than 0 and at most {MAX_KG} kg")
    slabs = ceil(weight_kg / 0.5)
    return slabs * RATES[zone]


def delivery_date(order_date, zone):
    """Return the expected delivery date.

    Counts working days after the order date. Only **Sundays** are skipped;
    Saturdays are delivery days. Public holidays are not considered.

    Args:
        order_date: datetime.date the order was placed.
        zone: "local", "regional" or "national" (1, 3 or 5 working days).

    Returns:
        datetime.date of delivery.

    Raises:
        KeyError: unknown zone.

    Examples:
        >>> delivery_date(date(2026, 11, 13), "local")     # Fri -> Sat
        datetime.date(2026, 11, 14)
        >>> delivery_date(date(2026, 11, 13), "regional")  # Fri -> Tue (Sun skipped)
        datetime.date(2026, 11, 17)
    """
    current = order_date
    days_left = DAYS[zone]
    while days_left:
        current += timedelta(days=1)
        if current.weekday() != 6:  # 6 = Sunday
            days_left -= 1
    return current


def is_valid_pincode(pin):
    """Check that pin looks like an Indian PIN code.

    A PIN code is a string of exactly 6 digits that does not start with 0.
    This checks the format only, not whether the PIN code exists.

    Args:
        pin: The value to check. Integers are rejected; pass a string.

    Returns:
        bool: True if the format is valid.

    Examples:
        >>> is_valid_pincode("411001")
        True
        >>> is_valid_pincode("011001"), is_valid_pincode(411001)
        (False, False)
    """
    return isinstance(pin, str) and len(pin) == 6 and pin.isdigit() and pin[0] != "0"
