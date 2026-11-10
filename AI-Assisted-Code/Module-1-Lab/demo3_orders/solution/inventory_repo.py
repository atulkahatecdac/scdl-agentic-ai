"""Existing project code: the product repository and shared helpers.

Do NOT ask the AI to change this file. It is the context the new component
must fit into. Share it with the assistant (attach it, or #file / @file it).
"""
from decimal import ROUND_HALF_UP, Decimal


class OutOfStockError(Exception):
    """Raised when an order asks for more units than are in stock."""

    def __init__(self, sku: str, requested: int, available: int):
        super().__init__(f"{sku}: requested {requested}, only {available} in stock")
        self.sku = sku
        self.requested = requested
        self.available = available


def money(value) -> Decimal:
    """Project convention: all money is Decimal, rounded half-up to 2 places."""
    return Decimal(str(value)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


class ProductRepository:
    """In-memory product store. Production uses MySQL behind the same methods."""

    def __init__(self, products=None):
        self._products = {p["sku"]: dict(p) for p in (products or [])}

    def get_product(self, sku: str):
        """Return a copy of the product dict, or None if the SKU is unknown.

        Keys: sku, name, price (Decimal), stock (int).
        """
        p = self._products.get(sku)
        return dict(p) if p else None

    def update_stock(self, sku: str, new_stock: int) -> None:
        self._products[sku]["stock"] = new_stock
