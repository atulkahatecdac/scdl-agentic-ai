"""Invoice endpoint for the customer portal (framework-free for the demo).

handle_get_invoice(user, invoice_id) -> (http_status, body) is what the web
framework calls for GET /invoices/<invoice_id>.

Reference answer for Demo 3: authentication, authorization (owner or admin),
input validation and safe error messages.
"""
import logging
import os

log = logging.getLogger(__name__)

DB_URL = os.environ.get("BILLING_DB_URL", "")  # never in source, never in responses

INVOICES = {
    101: {"id": 101, "owner": "asha", "amount": 18408.0, "status": "paid"},
    102: {"id": 102, "owner": "rohan", "amount": 5600.0, "status": "due"},
}


def get_invoice(invoice_id):
    return INVOICES.get(invoice_id)


def can_view(user, invoice):
    return user["role"] == "admin" or invoice["owner"] == user["name"]


def handle_get_invoice(user, invoice_id):
    # 1. Authentication: who is asking?
    if not user or not user.get("name") or user.get("role") not in ("customer", "admin"):
        return 401, {"error": "login required"}

    # 2. Input validation: a positive integer ID only
    if isinstance(invoice_id, bool):
        return 400, {"error": "invalid invoice id"}
    try:
        invoice_id = int(str(invoice_id).strip())
    except ValueError:
        return 400, {"error": "invalid invoice id"}
    if invoice_id <= 0:
        return 400, {"error": "invalid invoice id"}

    try:
        invoice = get_invoice(invoice_id)
    except Exception:
        log.exception("invoice lookup failed")  # details go to the log only
        return 500, {"error": "something went wrong"}

    # 3. Authorization: the same answer for "missing" and "not yours",
    #    so IDs of other customers' invoices cannot be discovered.
    if invoice is None or not can_view(user, invoice):
        return 404, {"error": "invoice not found"}
    return 200, invoice
