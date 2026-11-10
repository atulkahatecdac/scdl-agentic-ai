"""Invoice endpoint for the customer portal (framework-free for the demo).

handle_get_invoice(user, invoice_id) -> (http_status, body) is what the web
framework calls for GET /invoices/<invoice_id>.

Demo 3: ask your AI assistant to generate SECURITY tests for this endpoint,
run them, then fix what they find - see PROMPT.md.
"""

DB_URL = "postgresql://billing_app:S3cr3t-Pa55@db.internal:5432/billing"  # FAKE

INVOICES = {
    101: {"id": 101, "owner": "asha", "amount": 18408.0, "status": "paid"},
    102: {"id": 102, "owner": "rohan", "amount": 5600.0, "status": "due"},
}


def get_invoice(invoice_id):
    return INVOICES[int(invoice_id)]


def handle_get_invoice(user, invoice_id):
    try:
        return 200, get_invoice(invoice_id)
    except Exception as e:
        return 500, {"error": repr(e), "db": DB_URL}
