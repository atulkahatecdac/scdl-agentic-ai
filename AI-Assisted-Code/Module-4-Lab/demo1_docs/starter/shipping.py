from datetime import date, timedelta
from math import ceil

RATES = {"local": 40, "regional": 60, "national": 90}
DAYS = {"local": 1, "regional": 3, "national": 5}
MAX_KG = 20


def shipping_cost(weight_kg, zone):
    if zone not in RATES:
        raise ValueError(f"unknown zone: {zone}")
    if weight_kg <= 0 or weight_kg > MAX_KG:
        raise ValueError(f"weight must be more than 0 and at most {MAX_KG} kg")
    slabs = ceil(weight_kg / 0.5)
    return slabs * RATES[zone]


def delivery_date(order_date, zone):
    d = order_date
    left = DAYS[zone]
    while left:
        d += timedelta(days=1)
        if d.weekday() != 6:
            left -= 1
    return d


def is_valid_pincode(pin):
    return isinstance(pin, str) and len(pin) == 6 and pin.isdigit() and pin[0] != "0"
