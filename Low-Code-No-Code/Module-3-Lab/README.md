# Module 3 Lab — APIs & External Service Integration

| File | What it does |
|---|---|
| `workflows/M3-WF1_Weather_Alert.json` | Every day 7:00 → Open-Meteo forecast for Pune → rain ≥ 60%? → email the field team |
| `workflows/M3-WF2_Order_Currency_Converter.json` | Orders from MySQL → Frankfurter exchange rate per order → INR amounts → Google Sheet |
| `workflows/M3-WF3_Service_Request_API.json` | Your own REST API: `POST /webhook/service-request` → validate → MySQL `tickets` → `201` JSON (or `400`) |
| `m3_schema.sql` | Creates `orders` (6 sample orders) and `tickets` |

Both public APIs are free and need no key.

## Setup

```powershell
Get-Content m3_schema.sql | docker exec -i mysql mysql -un8n -pn8npass bizdb
```

Try the APIs first:

- Browser: https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.86&daily=precipitation_probability_max,temperature_2m_max&timezone=Asia/Kolkata&forecast_days=1
- PowerShell: `Invoke-RestMethod "https://api.frankfurter.dev/v1/latest?base=USD&symbols=INR"`

For WF2 create a tab **INR Report** in your sheet with headers:
`order_id, customer, currency, amount, rate, amount_inr`.

Import the three workflows and pick credentials (MySQL, Google Sheets, Gmail).

## Run and verify

**WF1 — Weather Alert**: Execute. The **HTTP Request** output has `daily` arrays; **Edit Fields** turns
them into `rain_chance` and `max_temp`. Set the IF threshold to `0` while testing so the email always sends.

**WF2 — Currency Converter**: Execute. The HTTP node runs once per order (5 orders; the INR order is
filtered out in SQL because Frankfurter returns `422` for INR→INR). The INR Report tab gets 5 rows.
Because the HTTP node replaces each item with the API response, Edit Fields reads the order back
with `$('MySQL').item`.

**WF3 — Your Own API**: Click **Execute workflow** (it now listens on the *test* URL), then:

```powershell
$body = @{ name = 'Asha Patil'; email = 'asha@example.com'; issue = 'Printer not working' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:5678/webhook-test/service-request' `
  -ContentType 'application/json' -Body $body
# status  ticket_id
# ------  ---------
# created SR-260929-26
```

Remove `email` from the body and send again → HTTP `400` with `{"error": "name, email and issue are required"}`.
After you **activate** the workflow, use `/webhook/` instead of `/webhook-test/`.

## Troubleshooting

| Problem | Fix |
|---|---|
| `404` from your webhook | `/webhook-test/` only while listening in the editor; `/webhook/` once active. Method must be POST. |
| `422 bad currency pair` | Frankfurter can't convert a currency to itself. |
| `429 Too Many Requests` | Keep **Batching** on in the HTTP node options, or turn on **Retry On Fail**. |
| Field is `undefined` | Arrays need `[0]`; webhook data sits under `$json.body`. |
| `curl` behaves oddly | In Windows PowerShell `curl` is an alias — use `curl.exe` or `Invoke-RestMethod`. |
