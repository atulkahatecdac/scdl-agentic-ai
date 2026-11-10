"""Order service: the new component for Demo 3.

Reference answer: generated with inventory_repo.py as context, then reviewed.
"""
from decimal import Decimal

from inventory_repo import OutOfStockError, ProductRepository, money

GST_RATE = Decimal("0.18")


class OrderService:
    def __init__(self, repo: ProductRepository):
        self.repo = repo

    def place_order(self, items: list[tuple[str, int]]) -> dict:
        """Place an order for [(sku, qty), ...] and reduce stock.

        All-or-nothing: every line is checked before any stock changes.

        Returns:
            {"lines": [{"sku", "name", "qty", "unit_price", "line_total"}, ...],
             "subtotal": Decimal, "gst": Decimal, "total": Decimal}

        Raises:
            ValueError: empty order, bad quantity or unknown SKU.
            OutOfStockError: a line asks for more units than are in stock.
        """
        if not items:
            raise ValueError("order has no items")

        # Merge repeated SKUs so stock is checked against the combined quantity.
        wanted: dict[str, int] = {}
        for sku, qty in items:
            if isinstance(qty, bool) or not isinstance(qty, int) or qty <= 0:
                raise ValueError(f"{sku}: quantity must be a positive integer")
            wanted[sku] = wanted.get(sku, 0) + qty

        # 1. Validate everything first.
        products = {}
        for sku, qty in wanted.items():
            product = self.repo.get_product(sku)
            if product is None:
                raise ValueError(f"unknown SKU: {sku}")
            if qty > product["stock"]:
                raise OutOfStockError(sku, qty, product["stock"])
            products[sku] = product

        # 2. Only now change stock and build the result.
        lines = []
        for sku, qty in wanted.items():
            p = products[sku]
            self.repo.update_stock(sku, p["stock"] - qty)
            lines.append({
                "sku": sku,
                "name": p["name"],
                "qty": qty,
                "unit_price": money(p["price"]),
                "line_total": money(p["price"] * qty),
            })

        subtotal = money(sum(line["line_total"] for line in lines))
        gst = money(subtotal * GST_RATE)
        return {"lines": lines, "subtotal": subtotal, "gst": gst, "total": money(subtotal + gst)}
