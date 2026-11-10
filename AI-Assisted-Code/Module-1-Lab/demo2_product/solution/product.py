"""Inventory model for a small shop.

Reference answer for Demo 2: the class the structured prompt produces after review.
"""


class Product:
    """One product line in the shop's inventory.

    Responsibility: hold a product's price and stock level and keep them valid.
    It does not know about orders, customers or storage.
    """

    def __init__(self, product_id: str, name: str, price: float, quantity: int = 0):
        if not isinstance(product_id, str) or not product_id.strip():
            raise ValueError("product_id must be a non-empty string")
        if not isinstance(name, str) or not name.strip():
            raise ValueError("name must be a non-empty string")
        self.product_id = product_id.strip()
        self.name = name.strip()
        self.price = self._check_price(price)
        self.quantity = self._check_quantity(quantity, allow_zero=True)

    # --- validation helpers -------------------------------------------------
    @staticmethod
    def _check_price(price) -> float:
        if isinstance(price, bool) or not isinstance(price, (int, float)):
            raise TypeError("price must be a number")
        if price < 0:
            raise ValueError("price cannot be negative")
        return float(price)

    @staticmethod
    def _check_quantity(qty, allow_zero: bool = False) -> int:
        if isinstance(qty, bool) or not isinstance(qty, int):
            raise TypeError("quantity must be an integer")
        if qty < 0 or (qty == 0 and not allow_zero):
            raise ValueError("quantity must be positive")
        return qty

    # --- behaviour ----------------------------------------------------------
    def update_price(self, new_price: float) -> None:
        """Set a new unit price (must be a number >= 0)."""
        self.price = self._check_price(new_price)

    def add_stock(self, qty: int) -> None:
        """Add qty units to stock (qty must be a positive integer)."""
        self.quantity += self._check_quantity(qty)

    def remove_stock(self, qty: int) -> None:
        """Remove qty units; raise ValueError if there is not enough stock."""
        qty = self._check_quantity(qty)
        if qty > self.quantity:
            raise ValueError(f"only {self.quantity} units of {self.product_id} in stock")
        self.quantity -= qty

    def total_value(self) -> float:
        """Stock value: price x quantity, rounded to 2 decimals."""
        return round(self.price * self.quantity, 2)

    def __repr__(self) -> str:
        return f"Product({self.product_id!r}, {self.name!r}, price={self.price}, quantity={self.quantity})"
