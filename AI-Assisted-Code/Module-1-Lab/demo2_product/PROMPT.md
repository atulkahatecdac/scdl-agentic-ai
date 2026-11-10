# Demo 2 - Generate a class from a structured prompt

Open `starter/product.py`. The class is an empty placeholder.

## Step 1 - describe the class before asking for code

Write the design down first (on the whiteboard or in the chat). One class, one job:

| Part           | Decision                                                    |
|----------------|-------------------------------------------------------------|
| Responsibility | One product line: price and stock level, always valid       |
| Attributes     | `product_id`, `name`, `price`, `quantity` (default 0)       |
| Methods        | `update_price`, `add_stock`, `remove_stock`, `total_value`  |
| Not its job    | Orders, customers, saving to a database                     |

## Step 2 - the class prompt

```text
Generate a Python 3.12 class Product in product.py for a shop inventory.

Responsibility: hold one product's price and stock level and keep them valid.
It must not know about orders, customers or storage.

Attributes: product_id (non-empty str), name (non-empty str),
price (int or float >= 0, stored as float), quantity (int >= 0, default 0).

Methods:
- update_price(new_price)  same rules as price
- add_stock(qty)           qty must be a positive int
- remove_stock(qty)        positive int; ValueError if qty > quantity,
                           and leave quantity unchanged
- total_value()            price * quantity rounded to 2 decimals
- __repr__                 Product('P-100', 'Gel pen', price=12.5, quantity=40)

Validation: TypeError for wrong types (reject bool for numbers),
ValueError for wrong values. Strip spaces from id and name.
Put the validation in small private helpers so it is not repeated.
Add docstrings. No external libraries.
```

## Step 3 - ask the AI to explain its choices

```text
Explain the design choices you made in this class. Which inputs did you
treat as invalid, and why? Is anything in my spec ambiguous?
```

Good assistants point out ambiguities, for example *"should `quantity=0` be
allowed in the constructor but not in `add_stock`?"*. That is the point of this step.

## Step 4 - run the tests

```powershell
pytest demo2_product --target starter
```

The tests were written from the spec, not from the AI's code, so they check
what we asked for rather than what the AI happened to write.
`solution/product.py` is a reviewed reference answer.
