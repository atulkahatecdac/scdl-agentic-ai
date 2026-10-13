# Module 4 Lab — Generative AI in Business Automation

All AI nodes use **OpenAI `gpt-4o-mini`, temperature 0** via an *OpenAI Chat Model* sub-node.

| File | What it does |
|---|---|
| `workflows/M4-WF1_Email_Triage.json` | New unread email → **Text Classifier** (Sales / Support / Billing / Spam / Other) → Gmail label → log row → mark as read |
| `workflows/M4-WF2_Invoice_Extraction.json` | Upload a PDF invoice → Extract from File → **Information Extractor** (6 fields) → MySQL `invoices` → result page |
| `workflows/M4-WF3_Meeting_Minutes.json` | Google Doc of raw notes → **Basic LLM Chain** writes minutes → new Google Doc → Gmail **draft** to attendees |
| `m4_schema.sql` | Creates the `invoices` table |
| `data/invoice_1.pdf`, `data/invoice_2.pdf` | Two text-based sample invoices with different layouts |
| `data/meeting_notes.txt` | Raw notes for WF3 |
| `data/test_emails.txt` | Four test emails for WF1 with the expected label |

## Setup

1. OpenAI: create an API key at platform.openai.com → **API keys**, add billing credit (US$5 is plenty)
   and set a monthly usage limit. In n8n: **Credentials → Add credential → OpenAI**.
2. `Get-Content m4_schema.sql | docker exec -i mysql mysql -un8n -pn8npass bizdb`
3. Gmail: create labels `AI/Sales`, `AI/Support`, `AI/Billing`, `AI/Spam`.
4. Sheet: add a tab **Email Log** with headers `time, from, subject, category`.
5. Import the three workflows and pick credentials. In WF1 open each **Label …** node and choose its label
   (Gmail needs the label's internal ID, so it must be picked from the list).

## Run and verify

**WF1 — Email Triage**: send the four emails in `data/test_emails.txt` to your inbox, then Execute.
Each email leaves the classifier on a different output, gets its label and a row in Email Log
(`category` comes from `$prevNode.name`, e.g. `Label Billing` → `Billing`). The email is then marked as read
so it is not processed twice. Activate to sort new mail every minute.

**WF2 — Invoice Extraction** (form: http://localhost:5678/form/invoice once active):
upload `invoice_1.pdf`, then `invoice_2.pdf`. Both layouts should produce the same six fields:

```sql
SELECT vendor_name, invoice_number, invoice_date, gstin, total_amount FROM invoices;
-- expected:
-- Sahyadri Office Supplies | SOS/2026/0412 | 2026-09-18 | 27ABCDE1234F1Z5 | 18408.00
-- Deccan IT Services Pvt Ltd | DIS-7781   | 2026-09-22 | 27AAKCD5678M1Z2 | 123900.00
```

The extractor's result is under `$json.output` (e.g. `$json.output.vendor_name`).

**WF3 — Meeting Minutes**: paste `data/meeting_notes.txt` into a Google Doc, submit its URL on the form.
A "Minutes: …" doc is created with SUMMARY / DECISIONS / ACTION ITEMS, and a Gmail **draft** waits in
Drafts — read it, check nothing was invented, then send.

## Troubleshooting

| Problem | Fix |
|---|---|
| `401 Incorrect API key` | Copy the key again; check for spaces in the credential. |
| `429 insufficient_quota` | Add billing credit in the OpenAI dashboard. |
| Wrong category | Improve the category descriptions; keep temperature 0. |
| Extract from File returns no text | The PDF is a scanned image — use a text PDF. |
| Same email processed twice | Keep the trigger on **Unread** and the **Mark as Read** node. |
