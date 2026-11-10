# shipping

Shipping charges and delivery-date estimates for the online store's checkout.

## Features

- Courier charge per parcel, by weight and zone
- Expected delivery date in working days (Sundays skipped)
- PIN code format check

## Requirements

Python 3.10 or newer. No third-party packages.

## Usage

```python
>>> from datetime import date
>>> from shipping import shipping_cost, delivery_date, is_valid_pincode
>>> shipping_cost(2.3, "regional")        # 2.3 kg -> 5 slabs of 0.5 kg x 60
300
>>> delivery_date(date(2026, 11, 13), "national")
datetime.date(2026, 11, 19)
>>> is_valid_pincode("560001")
True

```

## Rates and delivery times

| Zone     | Rate per 0.5 kg slab | Working days |
|----------|---------------------:|-------------:|
| local    | Rs 40                | 1            |
| regional | Rs 60                | 3            |
| national | Rs 90                | 5            |

Weight is rounded **up** to the next 0.5 kg. Parcels over 20 kg are rejected
with `ValueError` and must go by freight.

## Limitations

- Public holidays are not considered. Only Sundays are skipped.
- `is_valid_pincode` checks the format, not whether the PIN code exists.

## Running the tests

```powershell
pytest demo1_docs
```

The examples in this README and in the docstrings are executed by the tests.
