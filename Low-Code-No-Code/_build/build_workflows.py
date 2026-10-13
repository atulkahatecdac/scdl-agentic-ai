"""Generates the importable n8n workflow JSON files for Modules 1-5.

Run:  python build_workflows.py
Output: ../Module-N-Lab/workflows/*.json   (target: n8n 2.x)

Credentials are deliberately left out: after import, open each node that shows
a warning and pick your own credential (Google Sheets, Gmail, Docs, MySQL, OpenAI).
"""
import json
import os
import uuid

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
MODEL = "gpt-4o-mini"


def uid():
    return str(uuid.uuid4())


class WF:
    def __init__(self, module, file, name):
        self.module, self.file, self.name = module, file, name
        self.nodes, self.conns = [], {}

    def add(self, name, type_, ver, params, pos, **extra):
        node = {"parameters": params, "id": uid(), "name": name, "type": type_, "typeVersion": ver, "position": pos}
        node.update(extra)
        self.nodes.append(node)
        return name

    def link(self, src, dst, out=0, kind="main"):
        outs = self.conns.setdefault(src, {}).setdefault(kind, [])
        while len(outs) <= out:
            outs.append([])
        outs[out].append({"node": dst, "type": kind, "index": 0})

    def chain(self, *names):
        for a, b in zip(names, names[1:]):
            self.link(a, b)

    def note(self, text, pos, width=380, height=260, color=5):
        self.add(f"Note {len(self.nodes)}", "n8n-nodes-base.stickyNote", 1,
                 {"content": text, "width": width, "height": height, "color": color}, pos)

    def save(self):
        out = os.path.join(ROOT, f"Module-{self.module}-Lab", "workflows", self.file)
        data = {
            "name": self.name,
            "nodes": self.nodes,
            "connections": self.conns,
            "active": False,
            "settings": {"executionOrder": "v1"},
            "pinData": {},
            "meta": {"templateCredsSetupCompleted": False},
        }
        with open(out, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print("wrote", os.path.relpath(out, ROOT))


# ---------- parameter helpers ----------
UNARY = {"empty", "notEmpty", "exists", "notExists", "true", "false"}


def cond(left, typ, op, right: object = ""):
    c = {"id": uid(), "leftValue": left, "rightValue": right, "operator": {"type": typ, "operation": op}}
    if op in UNARY:
        c["operator"]["singleValue"] = True
    return c


def conds(*cs, combinator="and", case_sensitive=True):
    return {
        "options": {"caseSensitive": case_sensitive, "leftValue": "", "typeValidation": "loose", "version": 2},
        "conditions": list(cs),
        "combinator": combinator,
    }


def if_params(*cs, combinator="and"):
    return {"conditions": conds(*cs, combinator=combinator), "looseTypeValidation": True, "options": {}}


def assign(name, value, typ="string"):
    return {"id": uid(), "name": name, "value": value, "type": typ}


def set_params(assignments, keep_other=False):
    return {"assignments": {"assignments": assignments}, "includeOtherFields": keep_other, "options": {}}


def field(label, typ="text", options=None, required=True, **extra):
    f = {"fieldLabel": label, "requiredField": required}
    if typ != "text":
        f["fieldType"] = typ
    if options:
        f["fieldOptions"] = {"values": [{"option": o} for o in options]}
    f.update(extra)
    return f


def form_trigger(title, desc, path, fields, submitted_text=None):
    opts = {"path": path}
    if submitted_text:
        opts["respondWithOptions"] = {"values": {"respondWith": "text", "formSubmittedText": submitted_text}}
    return {"formTitle": title, "formDescription": desc, "formFields": {"values": fields}, "options": opts}


def doc_rl():
    # Pick your spreadsheet from the list after import.
    return {"__rl": True, "value": "", "mode": "list"}


def sheet_rl(name):
    # Tab resolved by name once the document is chosen.
    return {"__rl": True, "value": name, "mode": "name"}


def sheet_columns(mapping, match=None):
    cols = {
        "mappingMode": "defineBelow",
        "value": mapping,
        "schema": [
            {"id": c, "displayName": c, "required": False, "defaultMatch": False, "display": True,
             "type": "string", "canBeUsedToMatch": True}
            for c in mapping
        ],
        "attemptToConvertTypes": False,
        "convertFieldsToString": False,
    }
    if match:
        cols["matchingColumns"] = match
    return cols


def sheets_append(sheet, mapping):
    return {"operation": "append", "documentId": doc_rl(), "sheetName": sheet_rl(sheet),
            "columns": sheet_columns(mapping), "options": {}}


def gmail_send(to, subject, message, html=True):
    return {"sendTo": to, "subject": subject, "emailType": "html" if html else "text", "message": message,
            "options": {"appendAttribution": False}}


def table(name):
    return {"__rl": True, "value": name, "mode": "name"}


def mysql_query(sql, replacement=None):
    p = {"operation": "executeQuery", "query": sql, "options": {}}
    if replacement:
        p["options"]["queryReplacement"] = replacement
    return p


def mysql_insert_auto(tbl):
    return {"table": table(tbl), "options": {}}


def mysql_insert(tbl, mapping):
    return {"table": table(tbl), "dataMode": "defineBelow",
            "valuesToSend": {"values": [{"column": k, "value": v} for k, v in mapping.items()]}, "options": {}}


def mysql_update(tbl, match_col, match_val, mapping):
    return {"operation": "update", "table": table(tbl), "dataMode": "defineBelow",
            "columnToMatchOn": match_col, "valueToMatchOn": match_val,
            "valuesToSend": {"values": [{"column": k, "value": v} for k, v in mapping.items()]}, "options": {}}


def schedule(hour, minute=0):
    return {"rule": {"interval": [{"field": "days", "triggerAtHour": hour, "triggerAtMinute": minute}]}}


def form_end(title, message):
    return {"operation": "completion", "completionTitle": title, "completionMessage": message, "options": {}}


def openai_model(wf, name, pos, target, kind="ai_languageModel"):
    wf.add(name, "@n8n/n8n-nodes-langchain.lmChatOpenAi", 1.2,
           {"model": {"__rl": True, "value": MODEL, "mode": "list", "cachedResultName": MODEL},
            "options": {"temperature": 0}}, pos)
    wf.link(name, target, kind=kind)


def docs_create(title):
    return {"authentication": "oAuth2", "driveId": "myDrive", "folderId": "default", "title": title}


def docs_insert(doc_expr, text):
    return {"authentication": "oAuth2", "operation": "update", "documentURL": doc_expr,
            "actionsUi": {"actionFields": [{"object": "text", "action": "insert", "text": text}]}}


N = "n8n-nodes-base."
LC = "@n8n/n8n-nodes-langchain."
TEAM = "support-team@example.com"      # change to your own addresses after import
MANAGER = "manager@example.com"
ADMIN = "admin@example.com"

# ======================================================================
# Module 1
# ======================================================================
w = WF(1, "M1-WF1_Service_Request_Intake.json", "M1-WF1 Service Request Intake")
w.note("## M1-WF1 Service Request Intake\n**Setup**\n1. Create a Google Sheet with a tab named **Tickets**; paste the header row from `data/Tickets_header.csv` into row 1.\n2. Open **Save to Tickets Sheet** → pick your Google Sheets credential and the spreadsheet.\n3. Click **Execute workflow**, open the Test URL, submit a request.",
       [-60, -320], 460, 260)
w.add("Form Trigger", N + "formTrigger", 2.6, form_trigger(
    "Raise a Service Request", "Tell us what went wrong and we will get back to you.", "raise-request", [
        field("Name", placeholder="Your full name"),
        field("Email", "email", placeholder="you@example.com"),
        field("Category", "dropdown", ["Billing", "Technical", "General"]),
        field("Priority", "dropdown", ["Low", "Medium", "High"]),
        field("Description", "textarea", placeholder="Describe the problem"),
    ]), [0, 0], webhookId=uid())
w.add("Edit Fields", N + "set", 3.4, set_params([
    assign("ticket_id", "=SR-{{ $now.toFormat('yyMMdd') }}-{{ $execution.id }}"),
    assign("created_at", "={{ $now.toFormat('yyyy-MM-dd HH:mm') }}"),
    assign("status", "Open"),
], keep_other=True), [240, 0])
w.add("Save to Tickets Sheet", N + "googleSheets", 4.7, sheets_append("Tickets", {
    "ticket_id": "={{ $json.ticket_id }}",
    "created_at": "={{ $json.created_at }}",
    "name": "={{ $json.Name }}",
    "email": "={{ $json.Email }}",
    "category": "={{ $json.Category }}",
    "priority": "={{ $json.Priority }}",
    "description": "={{ $json.Description }}",
    "status": "={{ $json.status }}",
}), [480, 0])
w.add("Confirmation Page", N + "form", 2.5, form_end(
    "Request received", "=Your ticket ID is {{ $('Edit Fields').item.json.ticket_id }}. Please keep it for follow-up."),
    [720, 0], webhookId=uid())
w.chain("Form Trigger", "Edit Fields", "Save to Tickets Sheet", "Confirmation Page")
w.save()

w = WF(1, "M1-WF2_Status_Update.json", "M1-WF2 Status Update")
w.note("## M1-WF2 Status Update\n**Setup**\n1. Add a **comment** column (column I) to the Tickets tab.\n2. Pick your spreadsheet in **Find Ticket** and **Update Ticket**.\n3. Build the Dashboard tab (see README) for the views part of the lab.",
       [-60, -320], 460, 240)
w.add("Form Trigger", N + "formTrigger", 2.6, form_trigger(
    "Update a Ticket", "For support staff: change the status of a ticket.", "update-ticket", [
        field("Ticket ID", placeholder="SR-260929101512"),
        field("New Status", "dropdown", ["Open", "In Progress", "Resolved", "Closed"]),
        field("Comment", "textarea", required=False),
    ]), [0, 0], webhookId=uid())
w.add("Find Ticket", N + "googleSheets", 4.7, {
    "operation": "read", "documentId": doc_rl(), "sheetName": sheet_rl("Tickets"),
    "filtersUI": {"values": [{"lookupColumn": "ticket_id", "lookupValue": "={{ $json['Ticket ID'].trim() }}"}]},
    "options": {}}, [240, 0], alwaysOutputData=True)
w.add("Ticket Found?", N + "if", 2.2, if_params(cond("={{ $json.ticket_id }}", "string", "notEmpty")), [480, 0])
w.add("Update Ticket", N + "googleSheets", 4.7, {
    "operation": "update", "documentId": doc_rl(), "sheetName": sheet_rl("Tickets"),
    "columns": sheet_columns({
        "ticket_id": "={{ $json.ticket_id }}",
        "status": "={{ $('Form Trigger').item.json['New Status'] }}",
        "comment": "={{ $('Form Trigger').item.json.Comment }}",
    }, match=["ticket_id"]), "options": {}}, [720, -100])
w.add("Updated Page", N + "form", 2.5, form_end(
    "Ticket updated", "={{ $json.ticket_id }} is now {{ $('Form Trigger').item.json['New Status'] }}."), [960, -100], webhookId=uid())
w.add("Not Found Page", N + "form", 2.5, form_end(
    "Ticket not found", "=No ticket with ID {{ $('Form Trigger').item.json['Ticket ID'] }}. Check the ID and try again."),
    [720, 120], webhookId=uid())
w.chain("Form Trigger", "Find Ticket", "Ticket Found?")
w.link("Ticket Found?", "Update Ticket", 0)
w.link("Ticket Found?", "Not Found Page", 1)
w.link("Update Ticket", "Updated Page")
w.save()

w = WF(1, "M1-WF3_High_Priority_Alert.json", "M1-WF3 High-Priority Alert")
w.note(f"## M1-WF3 High-Priority Alert\n**Setup**\n1. **Sheets Trigger**: create a *Google Sheets Trigger OAuth2* credential (same client ID/secret), pick the spreadsheet and the **Tickets** tab.\n2. **Alert Support Team**: pick your Gmail credential; change the To address ({TEAM}).\n3. Activate — the trigger polls every minute.",
       [-60, -320], 460, 250)
w.add("Sheets Trigger", N + "googleSheetsTrigger", 1, {
    "pollTimes": {"item": [{"mode": "everyMinute"}]},
    "documentId": doc_rl(), "sheetName": {"__rl": True, "value": "", "mode": "list"},  # pick the Tickets tab
    "event": "rowAdded", "options": {}}, [0, 0])
w.add("Is High Priority?", N + "if", 2.2, if_params(cond("={{ $json.priority }}", "string", "equals", "High")), [240, 0])
w.add("Alert Support Team", N + "gmail", 2.1, gmail_send(
    TEAM, "=[HIGH] {{ $json.ticket_id }} - {{ $json.category }}",
    "=<h3>New high-priority ticket</h3>\n<p><b>Ticket:</b> {{ $json.ticket_id }}<br><b>Customer:</b> {{ $json.name }} ({{ $json.email }})<br><b>Category:</b> {{ $json.category }}<br><b>Issue:</b> {{ $json.description }}</p>\n<p>Open the Tickets sheet to respond.</p>"),
    [480, 0], webhookId=uid())
w.chain("Sheets Trigger", "Is High Priority?", "Alert Support Team")
w.save()

# ======================================================================
# Module 2
# ======================================================================
w = WF(2, "M2-WF1_Lead_Capture.json", "M2-WF1 Lead Capture & Qualification")
w.note("## M2-WF1 Lead Capture\n**Setup**\n1. Load `m2_schema.sql`.\n2. **MySQL**: create a MySQL credential — host `host.docker.internal`, port 3306, db `bizdb`, user `n8n`, password `n8npass`.\n3. Pick your Gmail credential in the three **Welcome** nodes.",
       [-60, -340], 460, 260)
w.add("Form Trigger", N + "formTrigger", 2.6, form_trigger(
    "Talk to Our Sales Team", "Tell us a little about your needs.", "lead", [
        field("Name"), field("Email", "email"), field("Company", required=False),
        field("Budget", "dropdown", ["Under 1 lakh", "1-5 lakh", "Above 5 lakh"]),
        field("Source", "dropdown", ["Website", "Referral", "Event"]),
    ], "Thanks! Check your inbox for a welcome email."), [0, 0], webhookId=uid())
w.add("Edit Fields", N + "set", 3.4, set_params([
    assign("name", "={{ $json.Name.trim() }}"),
    assign("email", "={{ $json.Email.trim().toLowerCase() }}"),
    assign("company", "={{ $json.Company }}"),
    assign("budget", "={{ $json.Budget }}"),
    assign("source", "={{ $json.Source }}"),
    assign("segment", "={{ $json.Budget == 'Above 5 lakh' ? 'hot' : $json.Budget == '1-5 lakh' ? 'warm' : 'cold' }}"),
]), [240, 0])
w.add("MySQL", N + "mySql", 2.5, mysql_insert_auto("leads"), [480, 0])
seg = "={{ $('Edit Fields').item.json.segment }}"
w.add("Switch", N + "switch", 3.2, {
    "rules": {"values": [
        {"conditions": conds(cond(seg, "string", "equals", s)), "renameOutput": True, "outputKey": s.title()}
        for s in ("hot", "warm", "cold")]},
    "options": {}}, [720, 0])
lead = "$('Edit Fields').item.json"
bodies = {
    "hot": "Our sales head will call you today to understand your requirements.",
    "warm": "Here is our brochure: https://example.com/brochure.pdf. We will follow up this week.",
    "cold": "You are now subscribed to our monthly newsletter with tips and offers.",
}
for i, s in enumerate(("hot", "warm", "cold")):
    name = f"Welcome {s.title()}"
    w.add(name, N + "gmail", 2.1, gmail_send(
        f"={{{{ {lead}.email }}}}", f"=Thanks for your interest, {{{{ {lead}.name }}}}",
        f"=<p>Hi {{{{ {lead}.name }}}},</p><p>Thank you for contacting us.</p><p>{bodies[s]}</p><p>Regards,<br>Sales Team</p>"),
        [960, -180 + i * 180], webhookId=uid())
    w.link("Switch", name, i)
w.chain("Form Trigger", "Edit Fields", "MySQL", "Switch")
w.save()

w = WF(2, "M2-WF2_Expense_Approval.json", "M2-WF2 Expense Approval")
w.note(f"## M2-WF2 Expense Approval\n**Setup**\n1. Pick MySQL and Gmail credentials in every red node.\n2. Change the manager address in **Ask Manager** ({MANAGER}).\n3. Claims above Rs 5,000 pause until the manager clicks Approve/Decline — open the email link on the machine running n8n.",
       [-60, -360], 480, 260)
w.add("Form Trigger", N + "formTrigger", 2.6, form_trigger(
    "Submit an Expense Claim", "Claims up to Rs 5,000 are approved automatically.", "expense", [
        field("Employee Name"), field("Email", "email"), field("Amount", "number"),
        field("Category", "dropdown", ["Travel", "Meals", "Supplies"]),
        field("Description", "textarea"),
    ], "Claim received. You will get an email with the decision."), [0, 0], webhookId=uid())
w.add("Edit Fields", N + "set", 3.4, set_params([
    assign("expense_id", "=EXP-{{ $now.toFormat('yyMMdd') }}-{{ $execution.id }}"),
    assign("employee", "={{ $json['Employee Name'] }}"),
    assign("email", "={{ $json.Email }}"),
    assign("amount", "={{ Number($json.Amount) }}", "number"),
    assign("category", "={{ $json.Category }}"),
    assign("description", "={{ $json.Description }}"),
    assign("status", "Pending"),
]), [240, 0])
w.add("Save Claim", N + "mySql", 2.5, mysql_insert_auto("expenses"), [480, 0])
w.add("Needs Approval?", N + "if", 2.2, if_params(
    cond("={{ $('Edit Fields').item.json.amount }}", "number", "gt", 5000)), [720, 0])
claim = "$('Edit Fields').item.json"
w.add("Ask Manager", N + "gmail", 2.1, {
    "operation": "sendAndWait", "sendTo": MANAGER,
    "subject": f"=Approve expense {{{{ {claim}.expense_id }}}}: Rs {{{{ {claim}.amount }}}}",
    "message": f"=Employee: {{{{ {claim}.employee }}}}\nAmount: Rs {{{{ {claim}.amount }}}}\nCategory: {{{{ {claim}.category }}}}\nDescription: {{{{ {claim}.description }}}}",
    "approvalOptions": {"values": {"approvalType": "double"}},
    "options": {}}, [960, -120], webhookId=uid())
w.add("Record Decision", N + "mySql", 2.5, mysql_update(
    "expenses", "expense_id", f"={{{{ {claim}.expense_id }}}}",
    {"status": "={{ $json.data.approved ? 'Approved' : 'Rejected' }}"}), [1200, -120])
w.add("Auto Approve", N + "mySql", 2.5, mysql_update(
    "expenses", "expense_id", f"={{{{ {claim}.expense_id }}}}", {"status": "Approved"}), [960, 120])
decision = "{{ $('Ask Manager').isExecuted ? ($('Ask Manager').item.json.data.approved ? 'Approved' : 'Rejected') : 'Approved' }}"
w.add("Notify Employee", N + "gmail", 2.1, gmail_send(
    f"={{{{ {claim}.email }}}}", f"=Expense {{{{ {claim}.expense_id }}}}: {decision}",
    f"=<p>Hi {{{{ {claim}.employee }}}},</p><p>Your claim of Rs {{{{ {claim}.amount }}}} ({{{{ {claim}.category }}}}) is <b>{decision}</b>.</p>"),
    [1440, 0], webhookId=uid())
w.chain("Form Trigger", "Edit Fields", "Save Claim", "Needs Approval?")
w.link("Needs Approval?", "Ask Manager", 0)
w.link("Needs Approval?", "Auto Approve", 1)
w.chain("Ask Manager", "Record Decision", "Notify Employee")
w.link("Auto Approve", "Notify Employee")
w.save()

w = WF(2, "M2-WF3_Daily_Sales_Report.json", "M2-WF3 Daily Sales Report")
w.note(f"## M2-WF3 Daily Sales Report\n**Setup**\n1. Pick credentials: MySQL, Google Docs (OAuth2), Gmail.\n2. Change the manager address in **Email Manager** ({MANAGER}).\n3. Click **Execute workflow** to test now; activate for 9:00 every day.",
       [-60, -320], 460, 230)
w.add("Schedule Trigger", N + "scheduleTrigger", 1.2, schedule(9), [0, 0])
w.add("MySQL", N + "mySql", 2.5, mysql_query(
    "SELECT region, COUNT(*) AS orders, SUM(amount) AS revenue\nFROM sales\nWHERE sale_date = CURDATE() - INTERVAL 1 DAY\nGROUP BY region\nORDER BY revenue DESC"),
    [240, 0])
w.add("Aggregate", N + "aggregate", 1, {"aggregate": "aggregateAllItemData", "destinationFieldName": "rows", "options": {}},
      [480, 0])
w.add("Create", N + "googleDocs", 2, docs_create(
    "=Sales report {{ $today.minus({days: 1}).toFormat('dd MMM yyyy') }}"), [720, 0])
w.add("Insert Report Text", N + "googleDocs", 2, docs_insert(
    "={{ $json.id }}",
    "=Sales report for {{ $today.minus({days: 1}).toFormat('dd MMM yyyy') }}\n\n"
    "{{ $('Aggregate').item.json.rows.map(r => r.region + ': ' + r.orders + ' orders, Rs ' + r.revenue).join('\\n') }}\n"),
    [960, 0])
w.add("Email Manager", N + "gmail", 2.1, gmail_send(
    MANAGER, "=Sales report {{ $today.minus({days: 1}).toFormat('dd MMM yyyy') }}",
    "=<p>Yesterday's sales report is ready:</p><p><a href=\"https://docs.google.com/document/d/{{ $('Create').item.json.id }}/edit\">Open the report</a></p>"),
    [1200, 0], webhookId=uid())
w.chain("Schedule Trigger", "MySQL", "Aggregate", "Create", "Insert Report Text", "Email Manager")
w.save()

# ======================================================================
# Module 3
# ======================================================================
w = WF(3, "M3-WF1_Weather_Alert.json", "M3-WF1 Weather Alert")
w.note(f"## M3-WF1 Weather Alert\nNo API key needed (Open-Meteo).\n**Setup**: pick your Gmail credential in **Rain Alert** and change the To address ({TEAM}).\nTip: set the IF threshold to 0 while testing.",
       [-60, -300], 440, 200)
w.add("Schedule Trigger", N + "scheduleTrigger", 1.2, schedule(7), [0, 0])
w.add("HTTP Request", N + "httpRequest", 4.2, {
    "url": "https://api.open-meteo.com/v1/forecast", "sendQuery": True,
    "queryParameters": {"parameters": [
        {"name": "latitude", "value": "18.52"}, {"name": "longitude", "value": "73.86"},
        {"name": "daily", "value": "precipitation_probability_max,temperature_2m_max"},
        {"name": "timezone", "value": "Asia/Kolkata"}, {"name": "forecast_days", "value": "1"}]},
    "options": {}}, [240, 0])
w.add("Edit Fields", N + "set", 3.4, set_params([
    assign("rain_chance", "={{ $json.daily.precipitation_probability_max[0] }}", "number"),
    assign("max_temp", "={{ $json.daily.temperature_2m_max[0] }}", "number"),
]), [480, 0])
w.add("Rain Likely?", N + "if", 2.2, if_params(cond("={{ $json.rain_chance }}", "number", "gte", 60)), [720, 0])
w.add("Rain Alert", N + "gmail", 2.1, gmail_send(
    TEAM, "=Rain alert: {{ $json.rain_chance }}% chance today",
    "=<p>Max temperature: {{ $json.max_temp }} °C</p><p>Carry rain covers for equipment and schedule indoor jobs first.</p>"),
    [960, 0], webhookId=uid())
w.chain("Schedule Trigger", "HTTP Request", "Edit Fields", "Rain Likely?", "Rain Alert")
w.save()

w = WF(3, "M3-WF2_Order_Currency_Converter.json", "M3-WF2 Order Currency Converter")
w.note("## M3-WF2 Currency Converter\nNo API key needed (Frankfurter).\n**Setup**\n1. Load `m3_schema.sql`.\n2. Pick MySQL and Google Sheets credentials.\n3. Create a tab **INR Report** with headers: order_id, customer, currency, amount, rate, amount_inr.",
       [-60, -320], 460, 250)
w.add("Manual Trigger", N + "manualTrigger", 1, {}, [0, 0])
w.add("MySQL", N + "mySql", 2.5, mysql_query(
    "SELECT order_id, customer, currency, amount\nFROM orders\nWHERE currency <> 'INR'   -- Frankfurter rejects INR -> INR (422)\nORDER BY order_id"),
    [240, 0])
w.add("HTTP Request", N + "httpRequest", 4.2, {
    "url": "https://api.frankfurter.dev/v1/latest", "sendQuery": True,
    "queryParameters": {"parameters": [{"name": "base", "value": "={{ $json.currency }}"},
                                       {"name": "symbols", "value": "INR"}]},
    "options": {"batching": {"batch": {"batchSize": 5, "batchInterval": 1000}}}}, [480, 0])
order = "$('MySQL').item.json"
w.add("Edit Fields", N + "set", 3.4, set_params([
    assign("order_id", f"={{{{ {order}.order_id }}}}"),
    assign("customer", f"={{{{ {order}.customer }}}}"),
    assign("currency", f"={{{{ {order}.currency }}}}"),
    assign("amount", f"={{{{ Number({order}.amount) }}}}", "number"),
    assign("rate", "={{ $json.rates.INR }}", "number"),
    assign("amount_inr", f"={{{{ (Number({order}.amount) * $json.rates.INR).toFixed(2) }}}}", "number"),
]), [720, 0])
w.add("Google Sheets", N + "googleSheets", 4.7, sheets_append("INR Report", {
    c: f"={{{{ $json.{c} }}}}" for c in ("order_id", "customer", "currency", "amount", "rate", "amount_inr")}), [960, 0])
w.chain("Manual Trigger", "MySQL", "HTTP Request", "Edit Fields", "Google Sheets")
w.save()

w = WF(3, "M3-WF3_Service_Request_API.json", "M3-WF3 Service Request API")
w.note("## M3-WF3 Your Own API\n**Setup**: pick your MySQL credential in **MySQL**.\n**Test** (PowerShell) — see README for the full command:\n`Invoke-RestMethod -Method Post -Uri http://localhost:5678/webhook-test/service-request ...`",
       [-60, -320], 480, 200)
w.add("Webhook", N + "webhook", 2, {"httpMethod": "POST", "path": "service-request",
                                     "responseMode": "responseNode", "options": {}}, [0, 0], webhookId=uid())
body = "$json.body"
w.add("Valid Request?", N + "if", 2.2, if_params(
    cond(f"={{{{ {body}.name }}}}", "string", "notEmpty"),
    cond(f"={{{{ {body}.email }}}}", "string", "notEmpty"),
    cond(f"={{{{ {body}.issue }}}}", "string", "notEmpty")), [240, 0])
w.add("Edit Fields", N + "set", 3.4, set_params([
    assign("ticket_id", "=SR-{{ $now.toFormat('yyMMdd') }}-{{ $execution.id }}"),
    assign("name", f"={{{{ {body}.name }}}}"),
    assign("email", f"={{{{ {body}.email }}}}"),
    assign("issue", f"={{{{ {body}.issue }}}}"),
]), [480, -100])
w.add("MySQL", N + "mySql", 2.5, mysql_insert_auto("tickets"), [720, -100])
w.add("Respond 201", N + "respondToWebhook", 1.1, {
    "respondWith": "json",
    "responseBody": "={{ { \"status\": \"created\", \"ticket_id\": $('Edit Fields').item.json.ticket_id } }}",
    "options": {"responseCode": 201}}, [960, -100])
w.add("Respond 400", N + "respondToWebhook", 1.1, {
    "respondWith": "json",
    "responseBody": "{\n  \"error\": \"name, email and issue are required\"\n}",
    "options": {"responseCode": 400}}, [480, 120])
w.chain("Webhook", "Valid Request?")
w.link("Valid Request?", "Edit Fields", 0)
w.link("Valid Request?", "Respond 400", 1)
w.chain("Edit Fields", "MySQL", "Respond 201")
w.save()

# ======================================================================
# Module 4
# ======================================================================
w = WF(4, "M4-WF1_Email_Triage.json", "M4-WF1 Email Triage")
w.note("## M4-WF1 Email Triage\n**Setup**\n1. In Gmail create labels AI/Sales, AI/Support, AI/Billing, AI/Spam.\n2. Pick credentials: Gmail (all Gmail nodes), OpenAI, Google Sheets.\n3. In each **Label …** node choose the matching label.\n4. Create a tab **Email Log** with headers: time, from, subject, category.",
       [-60, -420], 480, 280)
w.add("Gmail Trigger", N + "gmailTrigger", 1.2, {
    "pollTimes": {"item": [{"mode": "everyMinute"}]}, "simple": True,
    "filters": {"labelIds": ["INBOX"], "readStatus": "unread"}, "options": {}}, [0, 0])
cats = [
    ("Sales", "Questions about buying: quotes, pricing, licences, demos, bulk orders"),
    ("Support", "Problems using the product: errors, crashes, how-to questions, bugs"),
    ("Billing", "Payments, invoices, refunds, double charges, subscription changes"),
    ("Spam", "Unsolicited promotions, prizes, phishing, anything not from a real customer"),
]
w.add("Text Classifier", LC + "textClassifier", 1.1, {
    "inputText": "=Subject: {{ $json.Subject }}\nBody: {{ $json.snippet }}",
    "categories": {"categories": [{"category": c, "description": d} for c, d in cats]},
    "options": {"fallback": "other"}}, [240, 0])
openai_model(w, "OpenAI Chat Model", [240, 220], "Text Classifier")
for i, (c, _) in enumerate(cats):
    name = f"Label {c}"
    w.add(name, N + "gmail", 2.1, {"operation": "addLabels",
                                    "messageId": "={{ $('Gmail Trigger').item.json.id }}", "labelIds": []},
          [560, -330 + i * 160], webhookId=uid())
    w.link("Text Classifier", name, i)
w.add("Log to Sheet", N + "googleSheets", 4.7, sheets_append("Email Log", {
    "time": "={{ $now.toFormat('yyyy-MM-dd HH:mm') }}",
    "from": "={{ $('Gmail Trigger').item.json.From }}",
    "subject": "={{ $('Gmail Trigger').item.json.Subject }}",
    "category": "={{ $prevNode.name.startsWith('Label ') ? $prevNode.name.replace('Label ', '') : 'Other' }}",
}), [860, 0])
for c, _ in cats:
    w.link(f"Label {c}", "Log to Sheet")
w.link("Text Classifier", "Log to Sheet", 4)      # 'Other' output
w.add("Mark as Read", N + "gmail", 2.1, {"operation": "markAsRead",
                                          "messageId": "={{ $('Gmail Trigger').item.json.id }}"},
      [1100, 0], webhookId=uid())
w.chain("Gmail Trigger", "Text Classifier")
w.link("Log to Sheet", "Mark as Read")
w.save()

w = WF(4, "M4-WF2_Invoice_Extraction.json", "M4-WF2 Invoice Data Extraction")
w.note("## M4-WF2 Invoice Extraction\n**Setup**\n1. Load `m4_schema.sql`.\n2. Pick OpenAI and MySQL credentials.\n3. Execute, open the Test URL and upload `data/invoice_1.pdf`, then `invoice_2.pdf`.",
       [-60, -320], 440, 220)
w.add("Form Trigger", N + "formTrigger", 2.6, form_trigger(
    "Upload a Supplier Invoice", "Text-based PDF invoices only (not scanned photos).", "invoice", [
        field("Invoice", "file", multipleFiles=False, acceptFileTypes=".pdf"),
    ]), [0, 0], webhookId=uid())
w.add("Extract from File", N + "extractFromFile", 1, {"operation": "pdf", "binaryPropertyName": "Invoice", "options": {}},
      [240, 0])
attrs = [
    ("vendor_name", "string", "Name of the company that issued the invoice"),
    ("invoice_number", "string", "Invoice number exactly as printed"),
    ("invoice_date", "string", "Invoice date in YYYY-MM-DD format"),
    ("gstin", "string", "Supplier's 15-character GSTIN"),
    ("total_amount", "number", "Final total payable including tax, as a plain number without commas"),
    ("currency", "string", "3-letter currency code, e.g. INR"),
]
w.add("Information Extractor", LC + "informationExtractor", 1.1, {
    "text": "={{ $json.text }}",
    "attributes": {"attributes": [{"name": n, "type": t, "description": d, "required": True} for n, t, d in attrs]},
    "options": {}}, [480, 0])
openai_model(w, "OpenAI Chat Model", [480, 220], "Information Extractor")
w.add("Save Invoice", N + "mySql", 2.5, mysql_insert("invoices", {
    n: f"={{{{ $json.output.{n} }}}}" for n, _, _ in attrs}), [800, 0])
w.add("Show Result", N + "form", 2.5, form_end(
    "Invoice saved",
    "=Saved invoice {{ $('Information Extractor').item.json.output.invoice_number }} from {{ $('Information Extractor').item.json.output.vendor_name }} for {{ $('Information Extractor').item.json.output.currency }} {{ $('Information Extractor').item.json.output.total_amount }}."),
    [1040, 0], webhookId=uid())
w.chain("Form Trigger", "Extract from File", "Information Extractor", "Save Invoice", "Show Result")
w.save()

w = WF(4, "M4-WF3_Meeting_Minutes.json", "M4-WF3 Meeting Notes to Minutes")
w.note("## M4-WF3 Meeting Minutes\n**Setup**\n1. Paste `data/meeting_notes.txt` into a new Google Doc; copy its URL.\n2. Pick credentials: Google Docs (OAuth2), OpenAI, Gmail.\n3. Execute, open the Test URL and submit the doc URL. Review the Gmail **draft** before sending.",
       [-60, -320], 460, 240)
w.add("Form Trigger", N + "formTrigger", 2.6, form_trigger(
    "Turn Meeting Notes into Minutes", "Paste the link to a Google Doc with raw notes.", "minutes", [
        field("Notes doc URL", placeholder="https://docs.google.com/document/d/..."),
        field("Meeting title", placeholder="Pune store launch - weekly sync"),
        field("Attendee emails", placeholder="priya@example.com, sameer@example.com"),
    ], "Done! Your minutes doc and a Gmail draft are ready."), [0, 0], webhookId=uid())
w.add("Get Notes", N + "googleDocs", 2, {"authentication": "oAuth2", "operation": "get",
                                         "documentURL": "={{ $json['Notes doc URL'] }}"}, [240, 0])
w.add("Write Minutes", LC + "chainLlm", 1.7, {
    "promptType": "define",
    "text": "=Raw meeting notes:\n\n{{ $json.content }}",
    "messages": {"messageValues": [{"message":
        "You write concise, professional meeting minutes. Use exactly three headings in capitals: SUMMARY (2-3 sentences), "
        "DECISIONS (bullet list), ACTION ITEMS (bullet list, each as 'Owner: task (due date)'). "
        "Use only facts that appear in the notes. If an owner or date is missing, write 'TBD'. Plain text, no markdown symbols other than '-' bullets."}]}},
    [480, 0])
openai_model(w, "OpenAI Chat Model", [480, 220], "Write Minutes")
w.add("Create Minutes Doc", N + "googleDocs", 2, docs_create(
    "=Minutes: {{ $('Form Trigger').item.json['Meeting title'] }}"), [800, 0])
w.add("Insert Minutes", N + "googleDocs", 2, docs_insert(
    "={{ $json.id }}", "={{ $('Write Minutes').item.json.text }}"), [1040, 0])
w.add("Draft Email", N + "gmail", 2.1, {
    "resource": "draft", "subject": "=Minutes: {{ $('Form Trigger').item.json['Meeting title'] }}",
    "emailType": "text",
    "message": "=Hi all,\n\nPlease find the minutes below. Full document: https://docs.google.com/document/d/{{ $('Create Minutes Doc').item.json.id }}/edit\n\n{{ $('Write Minutes').item.json.text }}\n\nRegards",
    "options": {"sendTo": "={{ $('Form Trigger').item.json['Attendee emails'] }}"}}, [1280, 0], webhookId=uid())
w.chain("Form Trigger", "Get Notes", "Write Minutes", "Create Minutes Doc", "Insert Minutes", "Draft Email")
w.save()

# ======================================================================
# Module 5
# ======================================================================
w = WF(5, "M5-Helper_Customer_Lookup_API.json", "M5-Helper Customer Lookup API")
w.note("## Customer Lookup API (helper)\nImport, pick your MySQL credential, then **activate** it.\nTest: `Invoke-RestMethod 'http://localhost:5678/webhook/customer?email=asha@example.com'`\nUnknown emails return tier **Standard**.",
       [-60, -300], 460, 200)
w.add("Webhook", N + "webhook", 2, {"httpMethod": "GET", "path": "customer",
                                     "responseMode": "responseNode", "options": {}}, [0, 0], webhookId=uid())
w.add("Find Customer", N + "mySql", 2.5, mysql_query(
    "SELECT customer_id, tier FROM customers WHERE email = $1", "={{ ($json.query.email || '').toLowerCase() }}"),
    [240, 0], alwaysOutputData=True)
w.add("Respond", N + "respondToWebhook", 1.1, {
    "respondWith": "json",
    "responseBody": "={{ { \"tier\": $json.tier || \"Standard\", \"customer_id\": $json.customer_id || null } }}",
    "options": {}}, [480, 0])
w.chain("Webhook", "Find Customer", "Respond")
w.save()

w = WF(5, "M5-WF1_AI_Support_Desk.json", "M5-WF1 AI Support Desk")
w.note(f"## M5-WF1 AI Support Desk\n**Setup**\n1. Load `m5_schema.sql`; import and **activate** the Customer Lookup API helper.\n2. Pick credentials: OpenAI, MySQL, Gmail, Google Sheets.\n3. Create a tab **Ticket Log** with headers: time, ticket_id, category, priority, reply_sent.\n4. Change the support lead address in **Alert Support Lead** ({TEAM}).\n5. After importing WF3: Workflow **Settings → Error workflow → M5-WF3**.",
       [-60, -440], 520, 300)
w.add("Form Trigger", N + "formTrigger", 2.6, form_trigger(
    "Contact Support", "We usually reply within a few hours.", "support", [
        field("Name"), field("Email", "email"),
        field("Order number", required=False, placeholder="Optional"),
        field("Message", "textarea"),
    ], "Thanks! We have received your request and will email you shortly."), [0, 0], webhookId=uid())
w.add("HTTP Request", N + "httpRequest", 4.2, {
    "url": "http://localhost:5678/webhook/customer", "sendQuery": True,
    "queryParameters": {"parameters": [{"name": "email", "value": "={{ $json.Email }}"}]}, "options": {}}, [240, 0])
w.add("Classify & Draft Reply", LC + "chainLlm", 1.7, {
    "promptType": "define",
    "text": "=Customer name: {{ $('Form Trigger').item.json.Name }}\nCustomer tier: {{ $json.tier }}\nOrder number: {{ $('Form Trigger').item.json['Order number'] || 'not given' }}\n\nMessage:\n{{ $('Form Trigger').item.json.Message }}",
    "hasOutputParser": True,
    "messages": {"messageValues": [{"message":
        "You are the support triage assistant for an online electronics store. Read the customer's message and return: "
        "category (one of Billing, Technical, Delivery, General); "
        "priority (Low, Medium or High; High = money lost, service down, or a very upset customer); "
        "summary (max 12 words); "
        "reply (polite, max 80 words, greet the customer by first name, do not promise refunds, amounts or dates)."}]}},
    [480, 0])
openai_model(w, "OpenAI Chat Model", [420, 240], "Classify & Draft Reply")
w.add("Structured Output Parser", LC + "outputParserStructured", 1.2, {
    "jsonSchemaExample": "{\n  \"category\": \"Billing\",\n  \"priority\": \"High\",\n  \"summary\": \"Charged twice for September plan\",\n  \"reply\": \"Dear Asha, ...\"\n}"},
    [620, 240])
w.link("Structured Output Parser", "Classify & Draft Reply", kind="ai_outputParser")
ai = "$json.output"
form = "$('Form Trigger').item.json"
w.add("Edit Fields", N + "set", 3.4, set_params([
    assign("ticket_id", "=SR-{{ $now.toFormat('yyMMdd') }}-{{ $execution.id }}"),
    assign("name", f"={{{{ {form}.Name }}}}"),
    assign("email", f"={{{{ {form}.Email.toLowerCase() }}}}"),
    assign("issue", f"={{{{ {form}.Message }}}}"),
    assign("tier", "={{ $('HTTP Request').item.json.tier }}"),
    assign("category", f"={{{{ {ai}.category }}}}"),
    assign("priority", f"={{{{ {ai}.priority }}}}"),
    assign("summary", f"={{{{ {ai}.summary }}}}"),
    assign("reply", f"={{{{ {ai}.reply }}}}"),
    assign("sla_hours", "={{ $('HTTP Request').item.json.tier == 'Gold' ? 4 : 24 }}", "number"),
]), [800, 0])
w.add("MySQL", N + "mySql", 2.5, mysql_insert("tickets", {
    c: f"={{{{ $json.{c} }}}}" for c in ("ticket_id", "name", "email", "issue", "category", "priority", "sla_hours", "summary")}),
    [1040, 0])
t = "$('Edit Fields').item.json"
w.add("High Priority?", N + "if", 2.2, if_params(cond(f"={{{{ {t}.priority }}}}", "string", "equals", "High")), [1280, 0])
subject = f"=[{{{{ {t}.ticket_id }}}}] We've received your request"
reply_body = f"={{{{ {t}.reply }}}}\n\nYour ticket ID is {{{{ {t}.ticket_id }}}}. We will respond within {{{{ {t}.sla_hours }}}} hours.\n\nSupport Team"
w.add("Draft Reply", N + "gmail", 2.1, {"resource": "draft", "subject": subject, "emailType": "text", "message": reply_body,
                                        "options": {"sendTo": f"={{{{ {t}.email }}}}"}}, [1520, -120], webhookId=uid())
w.add("Alert Support Lead", N + "gmail", 2.1, gmail_send(
    TEAM, f"=[HIGH] {{{{ {t}.ticket_id }}}} - {{{{ {t}.category }}}} ({{{{ {t}.tier }}}})",
    f"=<p><b>{{{{ {t}.summary }}}}</b></p><p>Customer: {{{{ {t}.name }}}} ({{{{ {t}.email }}}}), tier {{{{ {t}.tier }}}}, SLA {{{{ {t}.sla_hours }}}} h</p><p>An AI-drafted reply is waiting in Gmail Drafts — review and send it.</p>"),
    [1760, -120], webhookId=uid())
w.add("Send Reply", N + "gmail", 2.1, gmail_send(f"={{{{ {t}.email }}}}", subject, reply_body, html=False),
      [1520, 120], webhookId=uid())
w.add("Log Ticket", N + "googleSheets", 4.7, sheets_append("Ticket Log", {
    "time": "={{ $now.toFormat('yyyy-MM-dd HH:mm') }}",
    "ticket_id": f"={{{{ {t}.ticket_id }}}}",
    "category": f"={{{{ {t}.category }}}}",
    "priority": f"={{{{ {t}.priority }}}}",
    "reply_sent": f"={{{{ {t}.priority == 'High' ? 'draft' : 'sent' }}}}",
}), [2000, 0])
w.chain("Form Trigger", "HTTP Request", "Classify & Draft Reply", "Edit Fields", "MySQL", "High Priority?")
w.link("High Priority?", "Draft Reply", 0)
w.link("High Priority?", "Send Reply", 1)
w.link("Draft Reply", "Alert Support Lead")
w.link("Alert Support Lead", "Log Ticket")
w.link("Send Reply", "Log Ticket")
w.save()

w = WF(5, "M5-WF2_Daily_Management_Report.json", "M5-WF2 Daily Management Report")
w.note(f"## M5-WF2 Daily Management Report\n**Setup**\n1. Pick credentials: MySQL, OpenAI, Google Docs (OAuth2), Gmail.\n2. Change the manager address ({MANAGER}).\n3. Submit a few tickets via WF1, then **Execute workflow**.\n4. Settings → Error workflow → M5-WF3.",
       [-60, -320], 460, 250)
w.add("Schedule Trigger", N + "scheduleTrigger", 1.2, schedule(18), [0, 0])
w.add("MySQL", N + "mySql", 2.5, mysql_query(
    "SELECT COALESCE(category, 'Uncategorised') AS category,\n       COALESCE(priority, '-') AS priority,\n       COUNT(*) AS n\nFROM tickets\nWHERE DATE(created_at) = CURDATE()\nGROUP BY 1, 2\nORDER BY 1, 2"),
    [240, 0], alwaysOutputData=True)
w.add("Aggregate", N + "aggregate", 1, {"aggregate": "aggregateAllItemData", "destinationFieldName": "stats", "options": {}},
      [480, 0])
w.add("Write Summary", LC + "chainLlm", 1.7, {
    "promptType": "define",
    "text": "=Ticket counts for today as JSON (category, priority, n):\n{{ JSON.stringify($json.stats.filter(s => s.n)) }}",
    "messages": {"messageValues": [{"message":
        "You write a short daily report for a support manager. Write at most 5 lines of plain text. "
        "Use ONLY the numbers given; do not invent numbers or causes. Give the total, the split by category, "
        "and point out every High priority count. If there are no tickets, say so in one line."}]}},
    [720, 0])
openai_model(w, "OpenAI Chat Model", [720, 220], "Write Summary")
w.add("Create", N + "googleDocs", 2, docs_create("=Support report {{ $today.toFormat('dd MMM yyyy') }}"), [1040, 0])
w.add("Insert Summary", N + "googleDocs", 2, docs_insert(
    "={{ $json.id }}",
    "=Support report - {{ $today.toFormat('dd MMM yyyy') }}\n\n{{ $('Write Summary').item.json.text }}\n\n"
    "Raw counts:\n{{ $('Aggregate').item.json.stats.filter(s => s.n).map(s => s.category + ' / ' + s.priority + ': ' + s.n).join('\\n') || 'No tickets today' }}\n"),
    [1280, 0])
w.add("Email Manager", N + "gmail", 2.1, gmail_send(
    MANAGER, "=Support report {{ $today.toFormat('dd MMM yyyy') }}",
    "=<p>{{ $('Write Summary').item.json.text.replace(/\\n/g, '<br>') }}</p><p><a href=\"https://docs.google.com/document/d/{{ $('Create').item.json.id }}/edit\">Open the full report</a></p>"),
    [1520, 0], webhookId=uid())
w.chain("Schedule Trigger", "MySQL", "Aggregate", "Write Summary", "Create", "Insert Summary", "Email Manager")
w.save()

w = WF(5, "M5-WF3_Error_Handler.json", "M5-WF3 Error Handler")
w.note(f"## M5-WF3 Error Handler\n**Setup**\n1. Pick Google Sheets and Gmail credentials; change the admin address ({ADMIN}).\n2. Create a tab **Error Log** with headers: time, workflow, node, message, execution_url.\n3. In WF1 and WF2: Settings → Error workflow → this workflow.\n4. Test: `docker stop mysql`, submit the WF1 form, then `docker start mysql`.",
       [-60, -340], 480, 270)
w.add("Error Trigger", N + "errorTrigger", 1, {}, [0, 0])
w.add("Edit Fields", N + "set", 3.4, set_params([
    assign("time", "={{ $now.toFormat('yyyy-MM-dd HH:mm:ss') }}"),
    assign("workflow", "={{ $json.workflow.name }}"),
    assign("node", "={{ $json.execution.lastNodeExecuted }}"),
    assign("message", "={{ $json.execution.error.message }}"),
    assign("execution_url", "={{ $json.execution.url }}"),
]), [240, 0])
w.add("Log Error", N + "googleSheets", 4.7, sheets_append("Error Log", {
    c: f"={{{{ $json.{c} }}}}" for c in ("time", "workflow", "node", "message", "execution_url")}), [480, 0])
w.add("Alert Admin", N + "gmail", 2.1, gmail_send(
    ADMIN, "=[n8n ERROR] {{ $('Edit Fields').item.json.workflow }}",
    "=<p><b>Workflow:</b> {{ $('Edit Fields').item.json.workflow }}<br><b>Failed node:</b> {{ $('Edit Fields').item.json.node }}<br><b>Error:</b> {{ $('Edit Fields').item.json.message }}</p><p><a href=\"{{ $('Edit Fields').item.json.execution_url }}\">Open the failed execution</a></p>"),
    [720, 0], webhookId=uid())
w.chain("Error Trigger", "Edit Fields", "Log Error", "Alert Admin")
w.save()
