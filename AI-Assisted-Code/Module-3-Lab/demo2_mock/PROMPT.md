# Demo 2 - Mock an external API

`starter/exchange.py` converts currency with the live Frankfurter API. Tests
that call the real API are slow, need internet, and break when the rate
changes. A **mock** replaces `urlopen` with a fake response we control.

## Step 1 - see the real thing once

```powershell
python demo2_mock/starter/exchange.py
```

```text
100 USD = 9393.0 INR      (the rate changes every day)
```

## Step 2 - ask for mocked tests

```text
Write pytest tests for exchange.py. Do not call the network: patch
urllib.request.urlopen with unittest.mock and return a fake JSON body.

Cover:
- the rate is read from the response, and convert() rounds to 2 decimals
- the URL has upper-case codes and urlopen gets a timeout
- a negative amount raises ValueError WITHOUT calling the API
- what SHOULD happen when the network fails (URLError)
- what SHOULD happen when the JSON has no "rates" key
- what SHOULD happen for a same-currency pair (USD -> USD)

For the last three, tell me what the current code does and whether that is
a good behaviour for callers.
```

## Step 3 - run against the starter

```powershell
pytest demo2_mock --target starter
```

```text
FAILED test_same_currency_returns_one_without_calling_the_api
FAILED test_network_failure_raises_rate_unavailable
FAILED test_unexpected_response_raises_rate_unavailable
3 failed, 4 passed
```

The mocks let us test failures we can't easily trigger for real: no internet,
a strange response, and the API's HTTP 422 for `USD -> USD`.

## Step 4 - fix the code, keep the tests

```text
Update get_rate so that a same-currency pair returns 1.0 without a request,
and any network or response problem raises RateUnavailableError
(chain the original exception with "from").
```

```powershell
pytest demo2_mock --target starter      # 7 passed, in well under a second
```

`solution/exchange.py` is a reviewed reference answer.
