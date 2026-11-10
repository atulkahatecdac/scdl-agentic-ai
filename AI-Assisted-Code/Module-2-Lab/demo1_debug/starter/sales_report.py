"""Regional sales report.

Demo 1: this file has two bugs. Run it, then debug it with your AI assistant.

    python demo1_debug/starter/sales_report.py

Business rule: an order worth 10,000 or more gets a 5% bulk discount.
"""
import csv
from pathlib import Path

BULK_THRESHOLD = 10000
BULK_DISCOUNT = 0.05


def load_sales(path):
    with open(path, newline="") as f:
        return list(csv.DictReader(f))


def order_value(row):
    value = row["quantity"] * row["unit_price"]
    if value > BULK_THRESHOLD:
        value = value * (1 - BULK_DISCOUNT)
    return round(value, 2)


def revenue_by_region(rows):
    totals = {}
    for row in rows:
        totals[row["region"]] = totals.get(row["region"], 0) + order_value(row)
    return totals


if __name__ == "__main__":
    rows = load_sales(Path(__file__).parent.parent / "sales.csv")
    for region, total in sorted(revenue_by_region(rows).items()):
        print(f"{region:<6} {total:>12,.2f}")
