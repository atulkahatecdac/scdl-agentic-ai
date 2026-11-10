"""Currency conversion using the free Frankfurter API.

Demo 2: generate tests that never touch the network, using mocks - see PROMPT.md.

    python demo2_mock/starter/exchange.py      # live call (needs internet)
"""
import json
import urllib.request

API = "https://api.frankfurter.dev/v1/latest?base={base}&symbols={target}"


class RateUnavailableError(Exception):
    """The exchange rate could not be fetched."""


def get_rate(base, target):
    url = API.format(base=base.upper(), target=target.upper())
    with urllib.request.urlopen(url, timeout=5) as resp:
        data = json.load(resp)
    return data["rates"][target.upper()]


def convert(amount, base, target):
    if amount < 0:
        raise ValueError("amount cannot be negative")
    return round(amount * get_rate(base, target), 2)


if __name__ == "__main__":
    print("100 USD =", convert(100, "USD", "INR"), "INR")
