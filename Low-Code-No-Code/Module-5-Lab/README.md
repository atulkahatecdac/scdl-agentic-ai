# Module 5 Lab — End-to-End No-Code AI Automation (Capstone)

An AI support desk built from three workflows plus one helper API.

| File | What it does |
|---|---|
| `workflows/M5-Helper_Customer_Lookup_API.json` | `GET /webhook/customer?email=…` → `{ "tier": "Gold", "customer_id": "C-001" }` (unknown email → `Standard`) |
| `workflows/M5-WF1_AI_Support_Desk.json` | Contact form → customer tier (API) → **LLM Chain + Structured Output Parser** (category, priority, summary, reply) → SLA (Gold 4 h / Standard 24 h) → MySQL `tickets` → High: reply saved as **draft** + lead alerted; otherwise reply sent → Ticket Log |
| `workflows/M5-WF2_Daily_Management_Report.json` | Every day 18:00 → today's ticket counts → GPT-4o mini summary (numbers only) → Google Doc → manager email |
| `workflows/M5-WF3_Error_Handler.json` | Error Trigger → Error Log sheet → admin email with a link to the failed execution |
| `m5_schema.sql` | Creates `customers` (4 sample customers, 2 Gold) and `tickets` |

## Setup

1. Check containers: `docker ps` (start with `docker start n8n mysql`).
2. `Get-Content m5_schema.sql | docker exec -i mysql mysql -un8n -pn8npass bizdb`
3. Import **M5-Helper_Customer_Lookup_API.json**, pick your MySQL credential, **activate** it, and test:
   `Invoke-RestMethod 'http://localhost:5678/webhook/customer?email=asha@example.com'` → `Gold  C-001`
4. Sheet tabs: **Ticket Log** (`time, ticket_id, category, priority, reply_sent`) and
   **Error Log** (`time, workflow, node, message, execution_url`).
5. Import WF1, WF2, WF3; pick credentials (MySQL, OpenAI, Gmail, Google Sheets, Google Docs).
   Change the example addresses (`support-team@example.com`, `manager@example.com`, `admin@example.com`).
6. In WF1 and WF2: **⋯ → Settings → Error workflow → M5-WF3 Error Handler**.

## Run and verify

**WF1** (form: http://localhost:5678/form/support once active)
1. As a Gold customer (`asha@example.com`): "I was charged twice for my September plan!"
   → expected Billing / High, SLA 4 h, reply saved as a Gmail draft, support lead alerted, Ticket Log `reply_sent = draft`.
2. As an unknown customer: "What are your store timings?" → expected General / Low, SLA 24 h, reply sent automatically.
3. `SELECT ticket_id, category, priority, sla_hours, summary FROM tickets;`

The HTTP node calls `http://localhost:5678/webhook/customer` — inside the n8n container `localhost:5678`
is n8n itself, so one workflow can call another's webhook. Ticket IDs look like `SR-260929-24`
(date + execution number), so two customers submitting in the same second still get different IDs.

**WF2**: after a few tickets, Execute. The summary must match the SQL counts — spot-check two numbers.

**WF3**: activate WF1, then `docker stop mysql`, submit the WF1 form, and `docker start mysql`.
Within seconds the Error Log gets a row and the admin an email with the failed node and error.
The Error Trigger only fires for production (automatic) runs, not for manual test runs.

## Backups

```powershell
docker exec n8n n8n export:workflow --all --output=/home/node/.n8n/workflows.json
docker cp n8n:/home/node/.n8n/workflows.json .
docker exec mysql mysqldump -uroot -proot123 --result-file=/tmp/bizdb.sql bizdb
docker cp mysql:/tmp/bizdb.sql .
```
