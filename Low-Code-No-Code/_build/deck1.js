// Module 1: No-Code Applications with Forms, Tables & Views
const { Deck, C, MONO, tb, iconData } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(1, "No-Code Applications with Forms, Tables & Views");

  await d.titleSlide({
    title: "No-Code Applications with Forms, Tables & Views",
    subtitle: "Build a working business app with n8n Forms, Google Sheets and Gmail — without writing code.",
    flow: [
      ["FaWpforms", "Form", "Customer submits a request", C.coral],
      ["FaProjectDiagram", "n8n", "Workflow adds ID + rules", C.navy],
      ["FaTable", "Google Sheets", "Stores every ticket", C.teal],
      ["FaEnvelope", "Gmail", "Alerts the support team", C.coral],
    ],
    notes: "Today we build a real service-request app end to end: a form to collect requests, a Google Sheet as the database, and n8n to connect them and send Gmail alerts. The same Service Request Desk grows through all five modules.",
  });

  await d.goalsAgenda({
    sub: "3 hands-on workflows",
    goals: [
      ["FaLightbulb", "Explain no-code vs low-code and when each fits"],
      ["FaCubes", "Name the five building blocks of a no-code app"],
      ["FaWpforms", "Publish a form that saves records to Google Sheets"],
      ["FaBell", "Automate an email alert from a business rule"],
    ],
    agenda: [
      "Welcome & objectives",
      "Core concepts",
      "Setup: n8n and Google credentials",
      "WF1  Service Request Intake app",
      "WF2  Status Update app + Sheet views",
      "WF3  High-Priority alert",
      "Troubleshooting, challenge, Q&A",
    ],
    notes: "Most of the session is hands-on. Concepts are kept short: just enough to understand what we click.",
  });

  await d.cards3({
    title: "Code, Low-Code, No-Code",
    sub: "Three ways to build software — trading flexibility for speed",
    cards: [
      { icon: "FaCode", color: C.gray, head: "Traditional Code", body: ["**Who:** Developers", "**How:** Write every line in Python, Java, JS", "**Trade-off:** Unlimited flexibility; slowest to build"] },
      { icon: "FaPuzzlePiece", color: C.teal, head: "Low-Code", body: ["**Who:** Developers + power users", "**How:** Visual builder, with code where needed", "**Trade-off:** Fast, and still extendable"] },
      { icon: "FaMousePointer", color: C.coral, head: "No-Code", body: ["**Who:** Business users", "**How:** Drag, drop and configure — no code", "**Trade-off:** Fastest; limited to platform features"] },
    ],
    below: [
      "**Where n8n sits:** no-code nodes for most steps, plus an optional Code node — so it spans no-code and low-code.",
      "**Good fit:** forms, approvals, internal tools, reports, prototypes",
      "**Poor fit:** complex algorithms, very high scale, strict compliance, pixel-perfect UI",
    ],
    notes: "Ask the class: who has built a Google Form? That's no-code. The trade-off is always speed versus flexibility. n8n lets you stay no-code but drop into JavaScript when a step needs it.",
  });

  await d.flowBlocks({
    title: "Five Building Blocks of a No-Code App",
    sub: "Every app you build in this course has the same parts",
    blocks: [
      { icon: "FaTable", name: "Data", what: "Where records live", k1: "TOOL", v1: "Google Sheets", k2: "EXAMPLE", v2: "Tickets sheet" },
      { icon: "FaWpforms", name: "Form", what: "How data comes in", k1: "TOOL", v1: "n8n Form Trigger", k2: "EXAMPLE", v2: "Request form" },
      { icon: "FaCodeBranch", name: "Logic", what: "Rules and calculations", k1: "TOOL", v1: "n8n IF, Edit Fields", k2: "EXAMPLE", v2: "Add ID, check priority" },
      { icon: "FaChartBar", name: "View", what: "How people see data", k1: "TOOL", v1: "Sheets filters, charts", k2: "EXAMPLE", v2: "Open tickets by status" },
      { icon: "FaEnvelope", name: "Automation", what: "What happens next", k1: "TOOL", v1: "n8n + Gmail", k2: "EXAMPLE", v2: "Email on High priority" },
    ],
    notes: "Walk left to right using the Service Request Desk. Data first: design the sheet columns before anything else. The cards show which tool plays each role today.",
  });

  // n8n in five words (custom layout)
  {
    const s = d.slide("This is the exact shape of WF1. Data moves between nodes as JSON items. One form submission = one item; 20 sheet rows = 20 items, and each node runs on all of them. {{ $json.field }} is the one piece of syntax needed today.");
    d.heading(s, "n8n in Five Words", "Workflow · Trigger · Node · Item · Execution");
    s.addShape("roundRect", { x: 0.5, y: 1.45, w: 5.2, h: 1.55, fill: { color: C.light }, line: { color: C.light }, rectRadius: 0.1 });
    const nodes = [["FaBolt", "Form Trigger", C.coral], ["FaPen", "Edit Fields", C.navy], ["FaTable", "Google Sheets", C.teal]];
    for (let i = 0; i < nodes.length; i++) {
      const x = 0.85 + i * 1.7;
      s.addShape("roundRect", { x, y: 1.7, w: 1.1, h: 0.75, fill: { color: C.white }, line: { color: C.line, width: 1 }, rectRadius: 0.08 });
      s.addImage({ data: await iconData(nodes[i][0], nodes[i][2]), x: x + 0.37, y: 1.82, w: 0.36, h: 0.36 });
      tb(s, nodes[i][1], { x: x - 0.2, y: 2.52, w: 1.5, h: 0.3, fontSize: 11, bold: true, align: "center" });
      if (i < nodes.length - 1) s.addShape("line", { x: x + 1.12, y: 2.07, w: 0.56, h: 0, line: { color: C.gray, width: 1.5, endArrowType: "triangle" } });
    }
    const terms = [
      ["Workflow", "The whole canvas — one automated process"],
      ["Trigger", "The first node; starts a run (form, schedule, webhook)"],
      ["Node", "One step that does one job"],
      ["Item", "One record flowing between nodes, stored as JSON"],
      ["Execution", "One run of the workflow, saved for debugging"],
    ];
    tb(s, terms.flatMap(([t, desc], i) => [
      { text: t + "  ", options: { bold: true, color: C.coral } },
      { text: desc, options: { breakLine: i < terms.length - 1 } },
    ]), { x: 0.5, y: 3.2, w: 5.2, h: 1.85, fontSize: 12.5, paraSpaceAfter: 5 });
    const end = d.codePanel(s, { caption: "One item, as n8n sees it", fontSize: 12, lines: [
      "{", '  "ticket_id": "SR-1001",', '  "name": "Asha Patil",', '  "category": "Billing",', '  "priority": "High",', '  "status": "Open"', "}",
    ] }, 6.1, 1.45, 3.4);
    tb(s, [
      { text: "Read a field in any node:", options: { breakLine: true } },
      { text: "{{ $json.priority }}", options: { fontFace: MONO, bold: true, color: C.coral } },
    ], { x: 6.1, y: end + 0.2, w: 3.4, h: 0.6, fontSize: 13, paraSpaceAfter: 4 });
  }

  await d.tableSlide({
    title: "Google Sheets as Your Database",
    sub: "One tab = one table. This is the Tickets sheet all three workflows share.",
    head: ["ticket_id", "created_at", "name", "email", "category", "priority", "description", "status"],
    rows: [
      ["SR-260929-41", "29 Sep 10:15", "Asha Patil", "asha@example.com", "Billing", "High", "Charged twice for plan", "Open"],
      ["SR-260929-42", "29 Sep 10:30", "Rahul Deshmukh", "rahul@example.com", "Technical", "Medium", "App crashes on login", "In Progress"],
      ["SR-260929-47", "29 Sep 11:12", "Meera Iyer", "meera@example.com", "General", "Low", "Update billing address", "Closed"],
    ],
    colW: [1.4, 1.0, 1.0, 1.45, 0.8, 0.7, 1.7, 0.95],
    fontSize: 10,
    belowY: 3.0,
    below: [
      "**Rules:** row 1 holds the column headers n8n will use · one row per record · a unique ID column · one kind of value per column · no merged cells or blank rows.",
    ],
    notes: "Create this sheet now with the header row only. Explain why a unique ID matters: WF2 finds rows by ticket_id. Sheets is fine for hundreds or a few thousand rows; Module 2 moves to MySQL.",
  });

  await d.grid4({
    title: "Test vs Production",
    sub: "Every trigger has two URLs — know which one you are using",
    cells: [
      { icon: "FaWrench", color: C.navy, head: "Test URL", text: "Listens only after you click **Execute workflow**, for one run. Each node's data appears live on the canvas. URL contains `/form-test/`." },
      { icon: "FaRocket", color: C.coral, head: "Production URL", text: "Works any time once the workflow is active. This is the link you share with users. URL contains `/form/`." },
      { icon: "FaPlay", color: C.teal, head: "Activate (Publish)", text: "Switch the workflow on (called **Publish** in newer n8n versions). Triggers then run without the editor open." },
      { icon: "FaHistory", color: C.navy, head: "Executions", text: "Every production run is logged in the **Executions** tab. Open one to see what each node received and returned." },
    ],
    notes: "The single most common beginner confusion: sharing the test URL. It stops working after one submission.",
  });

  await d.stepsCode({
    title: "Setup: n8n and Google Credentials",
    sub: "Done once — every later module reuses these",
    steps: [
      "Start n8n with the commands on the right",
      "Open `http://localhost:5678` and create the owner account",
      "Google Cloud Console: new project, enable the **Sheets, Drive, Gmail** and **Docs** APIs",
      "OAuth consent screen: External; add your Gmail as a **test user**",
      "Create an OAuth client ID (Web application) with n8n's redirect URL",
      "In n8n, add Google Sheets and Gmail credentials with that client ID and secret",
    ],
    panel: { caption: "PowerShell", fontSize: 9, lines: [
      "# Start n8n (first time only)",
      "docker volume create n8n_data",
      "docker run -d --name n8n -p 5678:5678 `",
      "  -e GENERIC_TIMEZONE=Asia/Kolkata `",
      "  -e TZ=Asia/Kolkata `",
      "  -v n8n_data:/home/node/.n8n `",
      "  docker.n8n.io/n8nio/n8n",
      "",
      "# Every later session",
      "docker start n8n",
      "",
      "# OAuth redirect URL (also shown in n8n)",
      "http://localhost:5678/rest/oauth2-credential/callback",
    ] },
    notes: "Google OAuth is the slowest part of the course; do it carefully once. The redirect URL is shown in the n8n credential dialog: copy it from there.",
  });

  // ---------- WF1 ----------
  await d.wfOverview({
    wf: "WF1", name: "Service Request Intake App",
    nodes: [["form", "Form Trigger", "On submission"], ["edit", "Edit Fields", "ticket_id, time"], ["sheets", "Google Sheets", "Append row"], ["formEnd", "Form", "Completion page"]],
    goal: "Give customers a web form to raise a service request. Each submission gets a ticket ID, is saved as a new row in the **Tickets** sheet, and the customer sees a confirmation page.",
    learn: ["Form fields: text, email, dropdown, required", "Building an ID with `$now`", "Mapping fields to sheet columns", "Test URL vs production URL"],
  });
  await d.wfBuild({
    wf: "WF1", name: "Service Request Intake App", fontSize: 11,
    rows: [
      ["Form Trigger", "Title `Raise a Service Request`. Fields: Name (text), Email (email), Category (dropdown: Billing, Technical, General), Priority (dropdown: Low, Medium, High), Description (textarea). All **required**."],
      ["Edit Fields (Set)", "Add `ticket_id` = `SR-{{ $now.toFormat('yyMMdd') }}-{{ $execution.id }}`, `created_at` = `{{ $now.toFormat('yyyy-MM-dd HH:mm') }}`, `status` = `Open`. Keep **Include Other Input Fields** on."],
      ["Google Sheets", "Operation **Append Row**, Tickets sheet. Mapping **Map Each Column Manually**: drag each form field onto its column."],
      ["Form (ending)", "Page type **Form Ending**. Title `Request received`, text `Your ticket ID is {{ $('Edit Fields').item.json.ticket_id }}`."],
    ],
    tip: "Submit one sample request via the **Test URL** first — every later node then shows real data you can drag in.",
  });
  await d.wfTest({
    wf: "WF1", name: "Service Request Intake App",
    steps: ["Click **Execute workflow**, open the Test URL", "Submit a request with priority **High**", "Watch each node turn green; inspect its output", "Open the Tickets sheet: the new row is there", "Activate, then share the **Production URL**"],
    panel: { caption: "Edit Fields output (trimmed)", fontSize: 10, lines: [
      "{", '  "Name": "Asha Patil",', '  "Email": "asha@example.com",', '  "Category": "Billing",', '  "Priority": "High",',
      '  "Description": "Charged twice",', '  "ticket_id": "SR-260929-41",', '  "created_at": "2026-09-29 10:15",', '  "status": "Open"', "}",
    ] },
    check: "A row with a new `SR-…` ID appears in **Tickets**, and the confirmation page shows the same ID.",
  });

  // ---------- WF2 ----------
  await d.wfOverview({
    wf: "WF2", name: "Status Update App + Sheet Views",
    nodes: [["form", "Form Trigger", "Ticket ID + status"], ["sheets", "Google Sheets", "Get row(s)"], ["if", "IF", "Ticket found?"], ["sheets", "Google Sheets", "Update row"], ["formEnd", "Form", "Updated / not found"]],
    goal: "Support staff update a ticket's status through a second form. The workflow finds the ticket, updates its row and replies. A **Dashboard** tab gives managers a live view.",
    learn: ["Reading and updating existing rows", "IF node and **Always Output Data**", "Referencing an earlier node: `$('Node').item`", "Views: filter views, COUNTIF, charts"],
  });
  await d.wfBuild({
    wf: "WF2", name: "Status Update App + Sheet Views", fontSize: 11,
    rows: [
      ["Form Trigger", "Fields: Ticket ID (text, required), New Status (dropdown: Open, In Progress, Resolved, Closed), Comment (textarea)."],
      ["Get Row(s)", "Filter: column `ticket_id` = `{{ $json['Ticket ID'] }}`. Node **Settings → Always Output Data** on, so a wrong ID still continues."],
      ["IF", "`{{ $json.ticket_id }}` **is not empty**. True → update the row; False → 'not found' page."],
      ["Update Row", "Column to match on `ticket_id`. `status` = `{{ $('Form Trigger').item.json['New Status'] }}`, `comment` = the form's Comment."],
      ["Form (x2)", "True branch: `Ticket updated`. False branch: `No ticket with that ID`."],
    ],
    tip: "Add a `comment` column to the Tickets sheet first, then reopen the node so it sees the new column.",
  });
  await d.wfTest({
    wf: "WF2", name: "Status Update App + Sheet Views",
    steps: ["Submit the form with a real ticket ID", "Try a wrong ID: you get the 'not found' page", "Add a **Dashboard** tab with the formulas on the right", "Insert a column chart of the status counts", "**Data → Create filter view**: High priority, not Closed"],
    panel: { caption: "Dashboard tab", fontSize: 10, lines: [
      "# Status counts (status = column H)",
      "A2 Open         B2 =COUNTIF(Tickets!H:H,A2)",
      "A3 In Progress  B3 =COUNTIF(Tickets!H:H,A3)",
      "A4 Resolved     B4 =COUNTIF(Tickets!H:H,A4)",
      "A5 Closed       B5 =COUNTIF(Tickets!H:H,A5)",
      "",
      "# Open High-priority tickets",
      "=COUNTIFS(Tickets!F:F,\"High\",",
      "         Tickets!H:H,\"<>Closed\")",
    ] },
    check: "The status changes in the sheet within seconds, and the dashboard counts and chart update on their own.",
  });

  // ---------- WF3 ----------
  await d.wfOverview({
    wf: "WF3", name: "High-Priority Alert",
    nodes: [["sheetsTrigger", "Sheets Trigger", "Row added"], ["if", "IF", "priority = High"], ["gmail", "Gmail", "Email the team"]],
    goal: "Whenever a new ticket row arrives with priority **High**, email the support team straight away with the details and a link to the sheet.",
    learn: ["Polling triggers (check every minute)", "IF conditions on text values", "Gmail node: HTML email with expressions", "Why a separate workflow: loose coupling"],
  });
  await d.wfBuild({
    wf: "WF3", name: "High-Priority Alert",
    rows: [
      ["Sheets Trigger", "Trigger on **Row Added** in the Tickets sheet, poll every minute. Uses its own credential type (**Google Sheets Trigger OAuth2**) with the same client ID and secret."],
      ["IF", "`{{ $json.priority }}` **is equal to** `High`. Leave the False branch empty: nothing happens."],
      ["Gmail", "Resource Message → **Send**. To: the team address. Subject `[HIGH] {{ $json.ticket_id }} - {{ $json.category }}`. Email type HTML; body shows name, email, description and the sheet link."],
    ],
    tip: "While building, use **Fetch Test Event** on the trigger. Once active, it polls by itself.",
  });
  await d.wfTest({
    wf: "WF3", name: "High-Priority Alert",
    steps: ["Activate WF3 (keep WF1 active too)", "Submit a **High** request on WF1's production form", "Wait up to a minute for the trigger to poll", "Check the team inbox and the Executions tab", "Submit a **Low** request: no email should arrive"],
    panel: { caption: "Email the team receives", fontSize: 10, lines: [
      "Subject: [HIGH] SR-260929-41 - Billing", "", "New high-priority ticket", "",
      "Customer : Asha Patil", "Email    : asha@example.com", "Category : Billing", "Issue    : Charged twice for plan", "",
      "Open the Tickets sheet to respond.",
    ] },
    check: "Three workflows now form one small app: intake (WF1), updates (WF2) and alerts (WF3), sharing one Google Sheet.",
  });

  await d.troubleshoot({
    items: [
      ["`redirect_uri_mismatch` from Google", "The redirect URI in Google Cloud must match n8n's OAuth Redirect URL exactly. Copy it from the credential dialog."],
      ["'Access blocked' / app not verified", "On the OAuth consent screen, add your Gmail address under **Test users**."],
      ["Test URL shows 404 / not listening", "Click **Execute workflow** first. The test URL listens for one submission only."],
      ["Columns are blank in the sheet", "Row 1 must hold the headers. Reopen the Sheets node after adding columns."],
      ["Sheets Trigger never fires", "The workflow must be **active**. It polls every minute, so wait before retrying."],
      ["Times are 5½ hours off", "Start the container with `GENERIC_TIMEZONE` and `TZ` set to `Asia/Kolkata`."],
    ],
  });
  await d.challenge({
    items: [
      { level: "EASY", head: "Customer confirmation email", text: "In WF1, add a Gmail node after the sheet so the customer receives their ticket ID by email.", hint: "Map To from the form's Email field with `$('Form Trigger')`." },
      { level: "MEDIUM", head: "Assign an agent", text: "Add an `assigned_to` dropdown to the WF2 form and a matching column, then one filter view per agent.", hint: "Update Row can set several columns at once." },
      { level: "STRETCH", head: "Evening digest", text: "At 6 pm, read all Open tickets and email one summary list to the manager.", hint: "Schedule → Get Row(s) with a filter → **Aggregate** → Gmail." },
    ],
  });
  await d.summary({
    built: [
      ["WF1", "Service Request Intake", "Form → ID → Google Sheets → confirmation"],
      ["WF2", "Status Update + Views", "Look up, update, dashboard"],
      ["WF3", "High-Priority Alert", "Sheets Trigger → IF → Gmail"],
    ],
    takeaways: [
      "Design the data (sheet columns) before the form",
      "Nodes pass JSON items; expressions like `$json.priority` read them",
      "Build with test URLs, share production URLs",
      "Small single-purpose workflows are easier to debug",
    ],
    next: "Module 2: Business workflow automation with n8n and MySQL",
  });

  await d.save(out);
};
