"""AI-generated security tests for GET /invoices/<id> (Demo 3), after review.

Grouped the way a security tester thinks: who are you (authentication),
what may you see (authorization), what can you send (input), and what do
errors reveal (information leakage).
"""
import pytest

from invoices_api import handle_get_invoice

ASHA = {"name": "asha", "role": "customer"}     # owns invoice 101
ROHAN = {"name": "rohan", "role": "customer"}   # owns invoice 102
ADMIN = {"name": "meera", "role": "admin"}

LEAK_MARKERS = ["postgresql://", "S3cr3t", "db.internal", "Traceback", "KeyError", "ValueError"]


def assert_no_leak(body):
    text = str(body)
    for marker in LEAK_MARKERS:
        assert marker not in text, f"response leaks {marker!r}: {text}"


# --- functional baseline ----------------------------------------------------------
def test_owner_can_read_own_invoice():
    status, body = handle_get_invoice(ASHA, 101)
    assert status == 200 and body["amount"] == 18408.0


def test_admin_can_read_any_invoice():
    assert handle_get_invoice(ADMIN, 102)[0] == 200


# --- authentication ----------------------------------------------------------------
@pytest.mark.parametrize("user", [None, {}, {"name": "", "role": "customer"}, {"name": "x", "role": "hacker"}])
def test_anonymous_or_malformed_user_gets_401(user):
    status, body = handle_get_invoice(user, 101)
    assert status == 401
    assert "amount" not in body


# --- authorization (IDOR) -----------------------------------------------------------
def test_customer_cannot_read_someone_elses_invoice():
    status, body = handle_get_invoice(ROHAN, 101)
    assert status == 404
    assert "amount" not in body and "owner" not in body


def test_not_yours_and_does_not_exist_look_the_same():
    # Otherwise an attacker can discover which invoice IDs exist.
    assert handle_get_invoice(ROHAN, 101) == handle_get_invoice(ROHAN, 999)


# --- input validation ----------------------------------------------------------------
@pytest.mark.parametrize("bad_id", ["abc", "101 OR 1=1", "", None, -1, 0, True, "1e3"])
def test_bad_ids_get_400_not_500(bad_id):
    status, body = handle_get_invoice(ASHA, bad_id)
    assert status == 400
    assert_no_leak(body)


def test_numeric_string_id_is_accepted():
    assert handle_get_invoice(ASHA, " 101 ")[0] == 200


# --- information leakage --------------------------------------------------------------
@pytest.mark.parametrize("invoice_id", [999, "abc", None])
def test_error_responses_reveal_nothing_internal(invoice_id):
    status, body = handle_get_invoice(ASHA, invoice_id)
    assert status != 200
    assert_no_leak(body)
