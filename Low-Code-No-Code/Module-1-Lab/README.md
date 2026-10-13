# Module 1 Lab — No-Code Applications with Forms, Tables & Views

Three workflows that together make a small **Service Request Desk** app:

| File | What it does |
|---|---|
| `workflows/M1-WF1_Service_Request_Intake.json` | Web form → ticket ID → new row in the **Tickets** sheet → confirmation page |
| `workflows/M1-WF2_Status_Update.json` | Staff form → find ticket by ID → update its status → "updated" / "not found" page |
| `workflows/M1-WF3_High_Priority_Alert.json` | New row in Tickets with priority **High** → email to the support team |

## 1. Start n8n (first time only)

```powershell
docker volume create n8n_data
docker run -d --name n8n -p 5678:5678 `
  -e GENERIC_TIMEZONE=Asia/Kolkata -e TZ=Asia/Kolkata `
  -v n8n_data:/home/node/.n8n `
  docker.n8n.io/n8nio/n8n
```

Later sessions: `docker start n8n`. Open http://localhost:5678 and create the owner account.

## 2. Google credentials (done once for the whole course)

1. [Google Cloud Console](https://console.cloud.google.com/) → create a project.
2. **APIs & Services → Library**: enable **Google Sheets API**, **Google Drive API**, **Gmail API**, **Google Docs API**.
3. **OAuth consent screen**: External; add your own Gmail address under **Test users**.
4. **Credentials → Create credentials → OAuth client ID** → *Web application*.
   Authorized redirect URI: `http://localhost:5678/rest/oauth2-credential/callback`
5. In n8n (**Credentials → Add credential**) create each of these with the same client ID and secret, then click **Sign in with Google**:
   - *Google Sheets OAuth2 API*
   - *Google Sheets Trigger OAuth2 API* (used by WF3)
   - *Gmail OAuth2*
   - *Google Docs OAuth2 API* (used from Module 2)

## 3. Create the Tickets sheet

Create a Google Sheet (any name) with a tab called **Tickets**. Paste the header row from
`data/Tickets_header.csv` into row 1:

```
ticket_id,created_at,name,email,category,priority,description,status,comment
```

## 4. Import the workflows

In n8n: **Workflows → Create → ⋯ (top right) → Import from File**, one file at a time.
Each workflow has a yellow note with its own setup steps. After import, open every node that
shows a warning and pick your credential; in the Google Sheets nodes also pick your spreadsheet
(the **Tickets** tab is selected by name; in WF3's trigger pick it from the list).

## 5. Run and verify

**WF1 — Service Request Intake**
1. Click **Execute workflow**, open the **Test URL** shown on the Form Trigger.
2. Submit a request with priority **High**.
3. A new row appears in Tickets with an ID like `SR-260929-41`; the confirmation page shows the same ID.
4. Activate (Publish) the workflow. Users now use the production URL: http://localhost:5678/form/raise-request

**WF2 — Status Update + views**
1. Execute, open the Test URL, enter a real ticket ID and a new status → "Ticket updated".
2. Try a wrong ID → "Ticket not found".
3. Add a **Dashboard** tab to the sheet:

   | | A | B |
   |---|---|---|
   | 1 | Status | Count |
   | 2 | Open | `=COUNTIF(Tickets!H:H,A2)` |
   | 3 | In Progress | `=COUNTIF(Tickets!H:H,A3)` |
   | 4 | Resolved | `=COUNTIF(Tickets!H:H,A4)` |
   | 5 | Closed | `=COUNTIF(Tickets!H:H,A5)` |

   Open High-priority tickets: `=COUNTIFS(Tickets!F:F,"High",Tickets!H:H,"<>Closed")`.
   Insert → Chart on A1:B5 for a column chart. **Data → Create filter view** for "High, not Closed".

**WF3 — High-Priority Alert**
1. Change the To address in **Alert Support Team** (it is `support-team@example.com`).
2. Activate WF3 (and WF1). Submit a **High** request on the WF1 production form.
3. Within about a minute the team gets `[HIGH] SR-… - Billing`. A **Low** request sends nothing.

## Troubleshooting

| Problem | Fix |
|---|---|
| `redirect_uri_mismatch` | The redirect URI in Google Cloud must match n8n's OAuth Redirect URL exactly. |
| "Access blocked: app not verified" | Add your Gmail address as a **Test user** on the consent screen. |
| Test URL shows 404 | Click **Execute workflow** first; the test URL listens for one submission only. |
| Columns stay blank | Row 1 of the Tickets tab must contain the headers above. |
| Sheets Trigger never fires | The workflow must be active; it polls once a minute. |
| Times are 5½ hours off | Start the container with `GENERIC_TIMEZONE` and `TZ` set to `Asia/Kolkata`. |
