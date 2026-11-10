"""AI-generated tests for exchange.py (Demo 2), after review.

urlopen is replaced by a mock, so these tests are fast, free and work offline.
"""
import io
import json
import urllib.error
from unittest.mock import patch

import pytest

import exchange
from exchange import RateUnavailableError, convert, get_rate


def fake_response(payload):
    """Something that behaves like urlopen's result inside a with-block."""
    return io.BytesIO(json.dumps(payload).encode())


@pytest.fixture
def mock_urlopen():
    with patch.object(exchange.urllib.request, "urlopen") as m:
        m.return_value = fake_response({"base": "USD", "rates": {"INR": 83.25}})
        yield m


def test_get_rate_reads_the_rate_from_the_response(mock_urlopen):
    assert get_rate("usd", "inr") == 83.25


def test_get_rate_calls_the_right_url_with_a_timeout(mock_urlopen):
    get_rate("usd", "inr")
    url = mock_urlopen.call_args.args[0]
    assert url.endswith("latest?base=USD&symbols=INR")
    assert mock_urlopen.call_args.kwargs.get("timeout")


def test_convert_multiplies_and_rounds(mock_urlopen):
    assert convert(12.5, "USD", "INR") == 1040.62


def test_negative_amount_is_rejected_without_calling_the_api(mock_urlopen):
    with pytest.raises(ValueError):
        convert(-1, "USD", "INR")
    mock_urlopen.assert_not_called()


def test_same_currency_returns_one_without_calling_the_api(mock_urlopen):
    # The real API answers HTTP 422 for USD->USD.
    assert get_rate("INR", "INR") == 1.0
    mock_urlopen.assert_not_called()


def test_network_failure_raises_rate_unavailable(mock_urlopen):
    mock_urlopen.side_effect = urllib.error.URLError("no internet")
    with pytest.raises(RateUnavailableError):
        get_rate("USD", "INR")


def test_unexpected_response_raises_rate_unavailable(mock_urlopen):
    mock_urlopen.return_value = fake_response({"message": "not found"})
    with pytest.raises(RateUnavailableError):
        get_rate("USD", "XYZ")
