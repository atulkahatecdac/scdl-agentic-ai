# Module 2 Lab — Business Workflow Automation with n8n

| File | What it does |
|---|---|
| `workflows/M2-WF1_Lead_Capture.json` | Lead form → clean data + segment (hot/warm/cold) → MySQL `leads` → Switch → 3 different welcome emails |
| `workflows/M2-WF2_Expense_Approval.json` | Expense form → MySQL `expenses` (Pending) → over Rs 5,000? manager approves by email → status updated → employee told |
| `workflows/M2-WF3_Daily_Sales_Report.json` | Every day 9:00 → yesterday's sales by region from MySQL → Google Doc → link emailed to the manager |
| `m2_schema.sql` | Creates `leads`, `expenses`, `sales` (with sample sales for the last 3 days) |

## 1. Start MySQL in its own container (first time only)

```powershell
docker volume create scdl_my_sql_data
docker run -d --name mysql -p 3306:3306 `
  -e MYSQL_ROOT_PASSWORD=root123 `
  -e MYSQL_DATABASE=bizdb `
  -e MYSQL_USER=n8n -e MYSQL_PASSWORD=n8npass `
  -v scdl_my_sql_data:/var/lib/mysql mysql:8.4
```

Wait about 20 seconds on the first start, then load the tables:

```powershell
Get-Content m2_schema.sql | docker exec -i mysql mysql -un8n -pn8npass bizdb
```

Later sessions: `docker start n8n mysql`.

## 2. MySQL credential in n8n

**Credentials → Add credential → MySQL**

| Field | Value |
|---|---|
| Host | `host.docker.internal` (not `localhost` — that would be the n8n container itself) |
| Database | `bizdb` |
| User / Password | `n8n` / `n8npass` |
| Port | `3306` |

## 3. Import and configure

Import the three JSON files. In each workflow pick your MySQL, Gmail and (WF3) Google Docs credentials.
Change the example addresses: `manager@example.com` in WF2 (**Ask Manager**) and WF3 (**Email Manager**).

## 4. Run and verify

**WF1 — Lead Capture** (form: http://localhost:5678/form/lead once active)
Submit three leads, one per budget band, then check:

```powershell
docker exec -it mysql mysql -un8n -pn8npass bizdb -e "SELECT name, budget, segment FROM leads"
```

Each lead has the right segment and got a different welcome email. Note: after the **MySQL** node,
`$json` is only `{"success": true}` — that is why the emails read the lead from `$('Edit Fields')`.

**WF2 — Expense Approval** (form: http://localhost:5678/form/expense)
1. Submit Rs 1,200 → approved immediately, employee emailed.
2. Submit Rs 12,000 → the run shows **Waiting**; the manager gets an email with **Approve / Decline**.
   The buttons link to `localhost:5678`, so click them on the machine running n8n.
3. After the click the run resumes, `expenses.status` becomes Approved/Rejected and the employee is told.

**WF3 — Daily Sales Report**
Click **Execute workflow**. A Google Doc "Sales report dd MMM yyyy" is created in My Drive with one
line per region, and the manager gets its link. Activate for the daily 9:00 run.
The sample sales rows are dated relative to the day you loaded `m2_schema.sql`; reload it if "yesterday" has no data.

## Troubleshooting

| Problem | Fix |
|---|---|
| `ECONNREFUSED 127.0.0.1:3306` | Host must be `host.docker.internal`. |
| `ECONNREFUSED` on host.docker.internal | The MySQL container must publish the port: `-p 3306:3306`. |
| `port is already allocated` | Another MySQL uses 3306 — use `-p 3307:3306` and port 3307 in the credential. |
| `Access denied for user 'n8n'` | Credentials must match the `docker run` values. |
| Expression shows `undefined` | Field names are case-sensitive (`Email` ≠ `email`). |
