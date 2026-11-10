"""Currency conversion using the free Frankfurter API.

Reference answer for Demo 2: the two problems the mocked tests found are fixed.

    python demo2_mock/solution/exchange.py     # live call (needs internet)
"""
import json
import urllib.error
import urllib.request

API = "https://api.frankfurter.dev/v1/latest?base={base}&symbols={target}"


class RateUnavailableError(Exception):
    """The exchange rate could not be fetched."""


def get_rate(base, target):
    base, target = base.upper(), target.upper()
    if base == target:
        return 1.0  # the API answers 422 for a same-currency pair
    url = API.format(base=base, target=target)
    try:
        with urllib.request.urlopen(url, timeout=5) as resp:
            data = json.load(resp)
        return data["rates"][target]
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError) as exc:
        raise RateUnavailableError(f"no rate for {base}->{target}") from exc


def convert(amount, base, target):
    if amount < 0:
        raise ValueError("amount cannot be negative")
    return round(amount * get_rate(base, target), 2)


if __name__ == "__main__":
    print("100 USD =", convert(100, "USD", "INR"), "INR")
