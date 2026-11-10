"""Order service: the new component for Demo 3.

Ask your AI assistant to implement place_order. Give it inventory_repo.py
as context first - see PROMPT.md.
"""
from inventory_repo import ProductRepository


class OrderService:
    def __init__(self, repo: ProductRepository):
        self.repo = repo

    def place_order(self, items):
        raise NotImplementedError("Ask your AI assistant to write this - see PROMPT.md")
