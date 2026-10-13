// Module 5: End-to-End No-Code AI Automation (capstone)
const { Deck, C, tb, runs, iconCircle, iconData } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(5, "End-to-End No-Code AI Automation");

  await d.titleSlide({
    title: "End-to-End No-Code AI Automation",
    subtitle: "Combine forms, n8n, MySQL, an API, GPT-4o mini, Gmail and Google Docs into one working system.",
    flow: [
      ["FaWpforms", "Customer form", "A request comes in", C.coral],
      ["FaBrain", "n8n + GPT-4o mini", "Classify, prioritise, draft reply", C.purple],
      ["FaDatabase", "MySQL + API", "Store and enrich", C.teal],
      ["FaEnvelope", "Gmail + Docs", "Replies, reports, alerts", C.navy],
    ],
    notes: "The capstone: an AI support desk that uses one skill from each earlier module, plus the operations work that makes it safe to run for real.",
  });

  await d.goalsAgenda({
    sub: "Capstone: 3 workflows, one system",
    goals: [
      ["FaSitemap", "Design a multi-workflow solution from requirements"],
      ["FaProjectDiagram", "Connect app, API, LLM and external services end to end"],
      ["FaRocket", "Deploy and monitor workflows in production"],
      ["FaShieldAlt", "Handle errors, backups and security"],
    ],
    agenda: [
      "Welcome & objectives",
      "Architecture and operations",
      "Setup: capstone database",
      "WF1  AI Support Desk",
      "WF2  Daily Management Report",
      "WF3  Error Handler",
      "Production checklist, challenge, Q&A",
    ],
  });

  await d.flowBlocks({
    title: "What You Already Know",
    sub: "The capstone uses one skill from each earlier module",
    blocks: [
      { icon: "FaWpforms", name: "Module 1", what: "No-code apps", k1: "SKILL", v1: "Forms + Sheets", k2: "USED FOR", v2: "Request form, logs" },
      { icon: "FaRandom", name: "Module 2", what: "Automation", k1: "SKILL", v1: "IF, MySQL, schedules", k2: "USED FOR", v2: "Routing, storage, report" },
      { icon: "FaGlobe", name: "Module 3", what: "APIs", k1: "SKILL", v1: "HTTP + Webhook", k2: "USED FOR", v2: "Customer lookup API" },
      { icon: "FaBrain", color: C.purple, name: "Module 4", what: "Generative AI", k1: "SKILL", v1: "GPT-4o mini, JSON", k2: "USED FOR", v2: "Classify + draft reply" },
    ],
  });

  // Architecture diagram
  {
    const s = d.slide("Walk the three rows: a customer request drives WF1, the clock drives WF2, and any failure drives WF3. All three share credentials and the same MySQL database.");
    d.heading(s, "Capstone Architecture", "Three workflows, one database, shared credentials");
    const inputs = [
      ["FaWpforms", "Customer form", "New request"],
      ["FaClock", "Schedule", "Every day 18:00"],
      ["FaExclamationTriangle", "Any failure", "In WF1 or WF2"],
    ];
    const wfs = [["WF1", "AI Support Desk"], ["WF2", "Daily Report"], ["WF3", "Error Handler"]];
    const ys = [1.7, 2.85, 4.0], h = 0.75;
    s.addShape("roundRect", { x: 3.0, y: 1.35, w: 3.3, h: 3.55, fill: { color: C.white }, line: { color: C.line, width: 1.25 }, rectRadius: 0.1 });
    tb(s, "n8n (Docker)", { x: 3.2, y: 1.4, w: 2.5, h: 0.25, fontSize: 10, bold: true, color: C.gray });
    for (let i = 0; i < 3; i++) {
      const y = ys[i];
      s.addShape("roundRect", { x: 0.5, y, w: 2.1, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.08 });
      await iconCircle(s, inputs[i][0], 0.62, y + 0.15, 0.45, C.coral);
      tb(s, [
        { text: inputs[i][1], options: { bold: true, fontSize: 12, breakLine: true } },
        { text: inputs[i][2], options: { fontSize: 10, color: C.gray } },
      ], { x: 1.17, y, w: 1.4, h, valign: "middle" });
      s.addShape("line", { x: 2.62, y: y + h / 2, w: 0.56, h: 0, line: { color: C.gray, width: 1.25, endArrowType: "triangle" } });
      s.addShape("roundRect", { x: 3.2, y, w: 2.9, h, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.08 });
      s.addShape("roundRect", { x: 3.35, y: y + 0.22, w: 0.55, h: 0.3, fill: { color: C.coral }, line: { color: C.coral }, rectRadius: 0.05 });
      tb(s, wfs[i][0], { x: 3.35, y: y + 0.22, w: 0.55, h: 0.3, fontSize: 10, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, wfs[i][1], { x: 4.05, y, w: 2.0, h, fontSize: 13, bold: true, valign: "middle" });
    }
    const outs = [
      ["FaDatabase", "MySQL", "tickets, customers", C.teal],
      ["FaGlobe", "Customer API", "tier lookup (webhook)", C.teal],
      ["FaBrain", "GPT-4o mini", "classify, reply, report", C.purple],
      ["FaEnvelope", "Gmail", "replies, reports, alerts", C.teal],
      ["FaFileAlt", "Google Docs", "daily report", C.teal],
      ["FaTable", "Google Sheets", "ticket + error logs", C.teal],
    ];
    const oh = 0.48, og = 0.1;
    for (let i = 0; i < outs.length; i++) {
      const y = 1.35 + i * (oh + og);
      s.addShape("line", { x: 6.32, y: y + oh / 2, w: 0.56, h: 0, line: { color: C.line, width: 1.25, endArrowType: "triangle" } });
      s.addShape("roundRect", { x: 6.9, y, w: 2.6, h: oh, fill: { color: C.white }, line: { color: C.line, width: 1 }, rectRadius: 0.06 });
      s.addImage({ data: await iconData(outs[i][0], outs[i][3]), x: 7.02, y: y + 0.11, w: 0.26, h: 0.26 });
      tb(s, [
        { text: outs[i][1], options: { bold: true, fontSize: 11, breakLine: true } },
        { text: outs[i][2], options: { fontSize: 9, color: C.gray } },
      ], { x: 7.4, y, w: 2.0, h: oh, valign: "middle" });
    }
  }

  await d.tableSlide({
    title: "Data Design",
    sub: "Agree the tables and field names before building anything",
    head: ["Table / sheet", "Key columns", "Written by"],
    rows: [
      ["`customers` (MySQL)", "customer_id, name, email, tier (Gold / Standard)", "Seed script"],
      ["`tickets` (MySQL)", "ticket_id, email, category, priority, sla_hours, summary, status, created_at", "WF1"],
      ["Customer Lookup API", "GET `/webhook/customer?email=…` returns tier and customer_id", "Ready-made workflow"],
      ["`Ticket Log` (Sheets)", "time, ticket_id, category, priority, reply_sent", "WF1"],
      ["`Error Log` (Sheets)", "time, workflow, node, message, execution_url", "WF3"],
    ],
    colW: [2.3, 4.8, 1.9],
    fontSize: 11.5,
    belowY: 4.1,
    below: ["**Same names everywhere:** `ticket_id`, `email`, `category`, `priority` mean the same thing in every workflow. Renaming one later breaks expressions."],
  });

  await d.grid4({
    title: "Deploy: From Test to Production",
    sub: "What changes when real users depend on your workflows",
    cells: [
      { icon: "FaRocket", color: C.coral, head: "Activate (Publish)", text: "Switch each workflow on. Production URLs (`/form/`, `/webhook/`) work only while it is active." },
      { icon: "FaClock", color: C.navy, head: "Time zone", text: "`GENERIC_TIMEZONE` on the container drives every Schedule Trigger." },
      { icon: "FaLink", color: C.teal, head: "Public URL", text: "On a server, set `WEBHOOK_URL=https://your-domain/` so forms, webhooks and approval links point to the right place." },
      { icon: "FaServer", color: C.navy, head: "Where to run it", text: "Your laptop for class; a small cloud VM with Docker and HTTPS, or n8n Cloud, for real use." },
    ],
  });

  await d.iconRows({
    title: "Manage: Monitor, Back Up, Recover",
    sub: "Running a workflow is a job, not a one-off",
    rows: [
      { icon: "FaHistory", head: "Executions list", text: "Filter for failed runs; open one to see the exact node and input" },
      { icon: "FaExclamationTriangle", color: C.coral, head: "Error workflow", text: "Emails you about any failure (today's WF3)" },
      { icon: "FaFileExport", color: C.teal, head: "Export workflows", text: "Download as JSON and keep them in Git" },
      { icon: "FaArchive", head: "Back up data", text: "Dump MySQL and export n8n regularly (right)" },
    ],
    panel: { caption: "PowerShell backups", fontSize: 8.5, lines: [
      "# All workflows as JSON",
      "docker exec n8n n8n export:workflow --all `",
      "  --output=/home/node/.n8n/workflows.json",
      "docker cp n8n:/home/node/.n8n/workflows.json .",
      "",
      "# MySQL dump",
      "docker exec mysql mysqldump -uroot -proot123 `",
      "  --result-file=/tmp/bizdb.sql bizdb",
      "docker cp mysql:/tmp/bizdb.sql .",
    ] },
    notes: "--result-file inside the container avoids PowerShell 5.1 re-encoding the dump as UTF-16, which a plain > redirect would do.",
  });

  await d.stepsCode({
    title: "Setup: Capstone Database",
    sub: "Everything from Modules 1–4 stays; add two tables and one helper workflow",
    steps: [
      "Check both containers are running: `docker ps`",
      "Load `m5_schema.sql`: `customers` + `tickets` tables",
      "Import the ready-made **Customer Lookup API** workflow and activate it",
      "Create the `Ticket Log` and `Error Log` sheets",
      "Check the credentials: MySQL, Google, Gmail, OpenAI",
    ],
    panel: { caption: "PowerShell", fontSize: 9, lines: [
      "docker ps",
      "# NAMES   STATUS",
      "# n8n     Up 2 minutes",
      "# mysql   Up 2 minutes",
      "",
      "Get-Content m5_schema.sql |",
      "  docker exec -i mysql mysql -un8n -pn8npass bizdb",
      "",
      "# Test the lookup API",
      "Invoke-RestMethod ('http://localhost:5678/' +",
      "  'webhook/customer?email=asha@example.com')",
      "",
      "# tier  customer_id",
      "# Gold  C-001",
    ] },
  });

  // ---------- WF1 (4 slides) ----------
  await d.wfOverview({
    wf: "WF1", name: "AI Support Desk",
    nodes: [["form", "Form Trigger", "Customer request"], ["http", "HTTP Request", "Customer API"], ["ai", "LLM Chain", "Classify + draft"], ["edit", "Edit Fields", "ID + SLA"], ["mysql", "MySQL", "Insert ticket"], ["gmail", "Gmail", "Reply / draft"], ["sheets", "Google Sheets", "Log"]],
    goal: "A customer submits a request. The workflow looks up their tier, asks GPT-4o mini for category, priority, a summary and a reply, sets the SLA (Gold 4 h, Standard 24 h), stores the ticket, answers the customer and logs it all.",
    learn: ["Chaining API → AI → database in one run", "Asking the model for several JSON fields", "Business rules on top of AI output", "Deciding when a human must review"],
  });
  await d.wfBuild({
    wf: "WF1", name: "AI Support Desk", part: "Build 1/2: intake + AI", fontSize: 11,
    rows: [
      ["Form Trigger", "Fields: Name, Email, Order number (optional), Message (textarea)."],
      ["HTTP Request", "GET `http://localhost:5678/webhook/customer`, query `email` = `{{ $json.Email }}`. Returns `tier` (unknown email → `Standard`)."],
      ["LLM Chain", "Sub-nodes: OpenAI Chat Model (`gpt-4o-mini`, temp 0) + **Structured Output Parser**. System: 'Return JSON with category (Billing, Technical, Delivery, General), priority (Low, Medium, High), summary (max 12 words), reply (polite, max 80 words, promise no refunds).'"],
      ["Edit Fields", "Flatten the AI JSON into fields. `ticket_id` = `SR-{{ $now.toFormat('yyMMdd') }}-{{ $execution.id }}`; `sla_hours` = `{{ $('HTTP Request').item.json.tier == 'Gold' ? 4 : 24 }}`"],
    ],
    tip: "Inside the n8n container, `localhost:5678` is n8n itself — so one workflow can call another's webhook this way.",
  });
  await d.wfBuild({
    wf: "WF1", name: "AI Support Desk", part: "Build 2/2: store, reply, log", fontSize: 11,
    rows: [
      ["MySQL", "Insert into `tickets`: ticket_id, email, category, priority, sla_hours, summary, status `Open`."],
      ["IF", "`priority` = `High` → true: Gmail **draft** reply + alert to the support lead. False: Gmail **send** reply."],
      ["Gmail", "Subject `[SR-…] We've received your request`; body = the AI `reply` + 'We will respond within N hours'. Read fields from `$('Edit Fields')`."],
      ["Google Sheets", "Append to `Ticket Log`: time, ticket_id, category, priority, reply_sent."],
      ["Workflow settings", "**Error workflow** → WF3 (built later today)."],
    ],
    tip: "Only the reply text is AI-written. IDs, SLA and routing come from rules you control.",
  });
  await d.wfTest({
    wf: "WF1", name: "AI Support Desk",
    steps: ["Submit as a Gold customer (asha@example.com) with a billing complaint", "Submit as an unknown customer with a general question", "Check `tickets` in MySQL: category, priority, SLA", "Check the sent email, the draft and the `Ticket Log`"],
    panel: { caption: "LLM Chain output ($json.output)", fontSize: 9.5, lines: [
      "{",
      '  "category": "Billing",',
      '  "priority": "High",',
      '  "summary": "Charged twice for Sept plan",',
      '  "reply": "Dear Asha, sorry about the',
      "    double charge. We have raised it with",
      "    our billing team and will update you",
      '    within 4 hours."',
      "}",
    ] },
    check: "Gold + High → 4 h SLA, reply held as a draft, lead alerted. Unknown + Low → 24 h SLA, reply sent automatically.",
  });

  // ---------- WF2 ----------
  await d.wfOverview({
    wf: "WF2", name: "Daily Management Report",
    nodes: [["schedule", "Schedule", "Daily 18:00"], ["mysql", "MySQL", "Today's stats"], ["aggregate", "Aggregate", "One list"], ["ai", "LLM Chain", "Write summary"], ["docs", "Google Docs", "Create + insert"], ["gmail", "Gmail", "Email manager"]],
    goal: "At 6 pm the support manager gets a short report: ticket counts by category and priority and a plain-English summary written by GPT-4o mini — saved as a Google Doc and emailed.",
    learn: ["Aggregating SQL results for a prompt", "AI that explains numbers without inventing them", "Reusing Module 2's Docs + Gmail pattern", "Scheduling in production"],
  });
  await d.wfBuild({
    wf: "WF2", name: "Daily Management Report", fontSize: 11,
    rows: [
      ["Schedule Trigger", "Every day at 18:00."],
      ["MySQL", "`SELECT category, priority, COUNT(*) AS n FROM tickets WHERE DATE(created_at) = CURDATE() GROUP BY category, priority`"],
      ["Aggregate", "All item data into one field, `stats`."],
      ["LLM Chain", "`gpt-4o-mini`: 'Write a 5-line summary for a support manager using ONLY these numbers: `{{ JSON.stringify($json.stats) }}`. Point out anything High priority.'"],
      ["Google Docs", "Create `Support report {{ $today.toFormat('dd MMM') }}`, then Insert the summary."],
      ["Gmail", "To the manager, with the link to the doc."],
    ],
    tip: "Give the model the numbers and tell it to use only those: its job is to explain the data, not to invent it.",
  });
  await d.wfTest({
    wf: "WF2", name: "Daily Management Report",
    steps: ["Submit a few tickets through WF1", "Execute WF2 manually", "Read the report: do the numbers match MySQL?", "Activate it for the 18:00 run"],
    panel: { caption: "Report in Google Docs", fontSize: 10, lines: [
      "Support report - 29 Sep",
      "",
      "12 tickets today: 5 Billing, 4 Technical,",
      "2 Delivery and 1 General.",
      "",
      "3 are High priority, all Billing: double",
      "charges after the plan change.",
      "",
      "Suggest checking the payment gateway.",
    ] },
    check: "The summary matches the SQL numbers exactly. Spot-check two of them every time you change the prompt.",
  });

  // ---------- WF3 (2 slides) ----------
  await d.wfOverview({
    wf: "WF3", name: "Error Handler",
    nodes: [["errorTrigger", "Error Trigger", "Any failure"], ["edit", "Edit Fields", "Pick details"], ["sheets", "Google Sheets", "Error Log"], ["gmail", "Gmail", "Alert admin"]],
    goal: "When WF1 or WF2 fails — MySQL down, API key expired, Google quota reached — this workflow records the failure and emails the admin a link to the failed run.",
    learn: ["Error Trigger and workflow settings", "Execution URLs for fast debugging", "Testing failure on purpose", "Why every production workflow needs one"],
  });
  await d.wfBuild({
    wf: "WF3", name: "Error Handler", part: "Build & test", fontSize: 11,
    rows: [
      ["Error Trigger", "No settings. Then in WF1 and WF2: **Settings → Error workflow → WF3**."],
      ["Edit Fields", "`workflow` = `{{ $json.workflow.name }}`, `node` = `{{ $json.execution.lastNodeExecuted }}`, `message` = `{{ $json.execution.error.message }}`, `url` = `{{ $json.execution.url }}`"],
      ["Google Sheets", "Append the four fields and the time to `Error Log`."],
      ["Gmail", "Subject `[n8n ERROR] {{ $json.workflow }}`; body: node, message and the link."],
      ["Test it", "`docker stop mysql` → submit the WF1 form → the alert arrives → `docker start mysql`."],
    ],
    tip: "The Error Trigger fires for automatic (production) runs of active workflows, not for manual test runs.",
  });

  // Production checklist + stretch challenges
  {
    const s = d.slide("Go through the checklist as a class before anyone calls the capstone finished.");
    d.heading(s, "Production Checklist & Challenge", "Tick every box before real users depend on it");
    const items = [
      "All workflows active; users get production URLs",
      "Error workflow set on every workflow",
      "Secrets only in n8n credentials, never in node fields",
      "Temperature 0 for decisions; humans review High priority",
      "OpenAI monthly usage limit set",
      "Weekly backup: workflow JSON + MySQL dump",
      "Container time zone set",
      "Workflow JSON committed to Git",
    ];
    for (let i = 0; i < items.length; i++) {
      const y = 1.45 + i * 0.44;
      s.addImage({ data: await iconData("FaCheckCircle", C.teal), x: 0.5, y: y + 0.04, w: 0.26, h: 0.26 });
      tb(s, runs(items[i]), { x: 0.9, y, w: 4.4, h: 0.34, fontSize: 12.5, valign: "middle" });
    }
    s.addShape("roundRect", { x: 5.6, y: 1.4, w: 3.9, h: 3.65, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
    tb(s, "STRETCH CHALLENGES", { x: 5.85, y: 1.55, w: 3.4, h: 0.25, fontSize: 10, bold: true, color: C.coral, charSpacing: 3 });
    const ch = [
      ["Satisfaction score", "Add a rating link to the closing email and store the score in MySQL."],
      ["SLA breach alert", "Every hour, email the lead about Open tickets past their SLA."],
      ["FAQ answers", "Give GPT-4o mini an FAQ Google Doc so replies quote real policy."],
    ];
    for (let i = 0; i < ch.length; i++) {
      const y = 1.95 + i * 1.0;
      s.addShape("ellipse", { x: 5.85, y: y + 0.02, w: 0.36, h: 0.36, fill: { color: C.navy }, line: { color: C.navy } });
      tb(s, String(i + 1), { x: 5.85, y: y + 0.02, w: 0.36, h: 0.36, fontSize: 12, bold: true, color: C.white, align: "center", valign: "middle" });
      tb(s, [
        { text: ch[i][0], options: { bold: true, fontSize: 13, breakLine: true } },
        { text: ch[i][1], options: { fontSize: 11.5, color: C.gray } },
      ], { x: 6.35, y, w: 3.0, h: 0.9 });
    }
  }

  await d.flowBlocks({
    title: "Course Recap",
    sub: "Five sessions, fifteen workflows, one stack",
    blocks: [
      { icon: "FaWpforms", name: "Module 1", what: "No-code apps", k1: "BUILT", v1: "Service request app", k2: "KEY NODES", v2: "Form, Sheets" },
      { icon: "FaRandom", name: "Module 2", what: "Automation", k1: "BUILT", v1: "Leads, expenses, reports", k2: "KEY NODES", v2: "Switch, Send and Wait" },
      { icon: "FaGlobe", name: "Module 3", what: "APIs", k1: "BUILT", v1: "Weather, currency, own API", k2: "KEY NODES", v2: "HTTP Request, Webhook" },
      { icon: "FaBrain", color: C.purple, name: "Module 4", what: "Generative AI", k1: "BUILT", v1: "Triage, invoices, minutes", k2: "KEY NODES", v2: "Classifier, Extractor" },
      { icon: "FaRocket", color: C.coral, name: "Module 5", what: "End to end", k1: "BUILT", v1: "AI support desk", k2: "KEY NODES", v2: "Error Trigger" },
    ],
  });

  await d.summary({
    built: [
      ["WF1", "AI Support Desk", "Form → API → GPT → MySQL → Gmail → Sheets"],
      ["WF2", "Daily Management Report", "Schedule → SQL → GPT → Docs → Gmail"],
      ["WF3", "Error Handler", "Error Trigger → log → alert"],
    ],
    takeaways: [
      "Agree data fields first; every workflow shares them",
      "Let rules decide; let AI read and write text",
      "Every production workflow needs an error workflow",
      "Back up workflows (JSON) and data (MySQL dump)",
    ],
    nextLabel: "THANK YOU",
    next: "Questions and discussion — Atul Kahate",
  });

  await d.save(out);
};
