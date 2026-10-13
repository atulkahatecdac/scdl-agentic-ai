// Module 3: APIs & External Service Integration
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(3, "APIs & External Service Integration");

  await d.titleSlide({
    title: "APIs & External Service Integration",
    subtitle: "Call REST APIs from n8n, work with JSON, and publish an API of your own.",
    flow: [
      ["FaClock", "Trigger", "Schedule, form or webhook", C.coral],
      ["FaGlobe", "HTTP Request", "Calls a REST API", C.teal],
      ["FaCode", "JSON", "Pick out the fields you need", C.navy],
      ["FaDatabase", "Sheets, MySQL, Gmail", "Store or act on the result", C.coral],
    ],
    notes: "Every business system exposes an API. Today we consume two free public APIs and then turn n8n into an API that others can call.",
  });

  await d.goalsAgenda({
    sub: "3 hands-on workflows",
    goals: [
      ["FaGlobe", "Explain REST requests, responses and status codes"],
      ["FaCode", "Read nested JSON and pick out fields"],
      ["FaPlug", "Call any REST API with the HTTP Request node"],
      ["FaServer", "Publish your own API with a Webhook"],
    ],
    agenda: [
      "Welcome & objectives",
      "Core concepts",
      "Setup: try the APIs in a browser",
      "WF1  Weather Alert",
      "WF2  Order Currency Converter",
      "WF3  Build Your Own API",
      "Troubleshooting, challenge, Q&A",
    ],
  });

  await d.iconRows({
    title: "What Is an API?",
    sub: "A contract that lets one program ask another for data or actions",
    rows: [
      { icon: "FaProjectDiagram", color: C.coral, head: "Client", text: "Your workflow asks, via the HTTP Request node" },
      { icon: "FaPaperPlane", head: "Request", text: "Method + URL + headers + (optional) body" },
      { icon: "FaServer", color: C.teal, head: "Server", text: "The service does the work: looks up rates, weather, orders" },
      { icon: "FaReply", head: "Response", text: "Status code + headers + a JSON body" },
    ],
    panel: { caption: "One request, one response", fontSize: 10, lines: [
      "GET /v1/latest?base=USD&symbols=INR",
      "Host: api.frankfurter.dev",
      "",
      "HTTP/1.1 200 OK",
      "Content-Type: application/json",
      "",
      "{",
      '  "base": "USD",',
      '  "date": "2026-09-28",',
      '  "rates": { "INR": 95.98 }',
      "}",
    ] },
    notes: "Restaurant analogy: you (client) give an order (request) to the waiter (API), the kitchen (server) prepares it, the waiter brings the dish (response).",
  });

  await d.tableSlide({
    title: "HTTP Methods & URL Anatomy",
    sub: "The verb says what you want; the URL says what you want it on",
    head: ["Method", "Meaning", "Example"],
    rows: [
      ["GET", "Read data", "`GET /v1/forecast?latitude=18.52`"],
      ["POST", "Create something", "`POST /webhook/service-request`"],
      ["PUT / PATCH", "Replace / update part of it", "`PATCH /tickets/SR-1001`"],
      ["DELETE", "Remove", "`DELETE /tickets/SR-1001`"],
    ],
    colW: [1.6, 2.8, 4.6],
    fontSize: 13,
    belowY: 3.35,
    below: [
      "**URL anatomy:** `https://api.open-meteo.com` (base) + `/v1/forecast` (path) + `?latitude=18.52&longitude=73.86` (query parameters, joined with `&`)",
    ],
  });

  await d.tableSlide({
    title: "Status Codes",
    sub: "The first thing to check when a call fails",
    head: ["Code", "Meaning", "What to do"],
    rows: [
      ["200 OK", "Success; the body has your data", "Carry on"],
      ["201 Created", "A new resource was created", "Read the new ID from the body"],
      ["400 / 422", "Bad request / invalid input", "Fix the parameters or body"],
      ["401 / 403", "Not authenticated / not allowed", "Check the API key or permissions"],
      ["404", "Wrong URL or unknown resource", "Check the path and IDs"],
      ["429", "Too many requests", "Slow down: batching, retry with a wait"],
      ["500 / 503", "Problem on the server", "Retry later"],
    ],
    colW: [1.6, 3.5, 3.9],
    fontSize: 12,
  });

  await d.iconRows({
    title: "Reading JSON",
    sub: "n8n shows every response as JSON — learn to find your way around it",
    rows: [
      { icon: "FaCubes", color: C.coral, head: "Object { }", text: "Named fields: `$json.timezone`" },
      { icon: "FaSitemap", head: "Nested object", text: "Dots go deeper: `$json.rates.INR` → 95.98" },
      { icon: "FaListOl", color: C.teal, head: "Array [ ]", text: "Numbered from 0: `$json.daily.temperature_2m_max[0]`" },
      { icon: "FaMousePointer", head: "Drag, don't type", text: "Drag a field from the input panel and n8n writes the path for you" },
    ],
    panel: { caption: "Open-Meteo response (trimmed)", fontSize: 9, lines: [
      "{",
      '  "timezone": "Asia/Kolkata",',
      '  "daily": {',
      '    "time": ["2026-09-29"],',
      '    "precipitation_probability_max": [80],',
      '    "temperature_2m_max": [32.2]',
      "  }",
      "}",
    ] },
  });

  await d.grid4({
    title: "Authentication & the HTTP Request Node",
    sub: "How APIs know who you are — and the fastest way to set up a call",
    cells: [
      { icon: "FaGlobe", color: C.teal, head: "No auth", text: "Public APIs such as Open-Meteo and Frankfurter: just call the URL." },
      { icon: "FaKey", color: C.coral, head: "API key / Bearer token", text: "Sent as a header (`Authorization: Bearer …`) or query parameter. Store it as a **Header Auth** credential." },
      { icon: "FaUserShield", color: C.navy, head: "OAuth2", text: "Sign in with the provider (Google, Microsoft). n8n refreshes the tokens for you." },
      { icon: "FaFileImport", color: C.teal, head: "Import cURL", text: "Paste a cURL example from the API docs into the HTTP Request node: method, URL, headers and body are filled in." },
    ],
  });

  await d.stepsCode({
    title: "Setup: Try the APIs First",
    sub: "If it works in a browser, it will work in n8n",
    steps: [
      "Paste the weather URL into a browser: JSON appears",
      "Change `latitude` / `longitude` to your city",
      "In PowerShell, use `Invoke-RestMethod` or `curl.exe` (plain `curl` differs)",
      "Load `m3_schema.sql`: tables `orders` and `tickets`",
      "Check both containers are up: `docker ps`",
    ],
    panel: { caption: "Browser / PowerShell", fontSize: 9, lines: [
      "# Weather for Pune (browser)",
      "https://api.open-meteo.com/v1/forecast",
      "  ?latitude=18.52&longitude=73.86",
      "  &daily=precipitation_probability_max,",
      "   temperature_2m_max",
      "  &timezone=Asia/Kolkata&forecast_days=1",
      "",
      "# Exchange rate (PowerShell)",
      "Invoke-RestMethod ('https://api.frankfurter.dev' +",
      "  '/v1/latest?base=USD&symbols=INR')",
      "",
      "# Tables for this module",
      "Get-Content m3_schema.sql |",
      "  docker exec -i mysql mysql -un8n -pn8npass bizdb",
    ] },
  });

  // ---------- WF1 ----------
  await d.wfOverview({
    wf: "WF1", name: "Weather Alert",
    nodes: [["schedule", "Schedule", "Daily 7:00"], ["http", "HTTP Request", "GET Open-Meteo"], ["edit", "Edit Fields", "rain %, max temp"], ["if", "IF", "rain ≥ 60%"], ["gmail", "Gmail", "Alert field team"]],
    goal: "A field-service company checks the weather every morning. If rain is likely in Pune, the field team gets an email to carry rain covers and schedule indoor jobs first.",
    learn: ["HTTP Request with query parameters", "Values from nested arrays", "Number comparisons in IF", "Turning API data into a business decision"],
  });
  await d.wfBuild({
    wf: "WF1", name: "Weather Alert",
    rows: [
      ["Schedule Trigger", "Every day at 7:00."],
      ["HTTP Request", "GET `https://api.open-meteo.com/v1/forecast`. **Send Query Parameters**: latitude `18.52`, longitude `73.86`, daily `precipitation_probability_max,temperature_2m_max`, timezone `Asia/Kolkata`, forecast_days `1`."],
      ["Edit Fields", "`rain_chance` = `{{ $json.daily.precipitation_probability_max[0] }}`, `max_temp` = `{{ $json.daily.temperature_2m_max[0] }}`"],
      ["IF", "`{{ $json.rain_chance }}` **is greater than or equal to** `60` (Number)."],
      ["Gmail", "Subject `Rain alert: {{ $json.rain_chance }}% chance today`. Body: max temperature and advice."],
    ],
    fontSize: 11,
    tip: "Set the threshold to `0` while testing so the email always sends — then put it back to `60`.",
  });
  await d.wfTest({
    wf: "WF1", name: "Weather Alert",
    steps: ["Execute the workflow", "Open the HTTP output; find the `daily` arrays", "Check Edit Fields shows two plain numbers", "Confirm the email arrives (threshold 0)", "Activate for the daily run"],
    panel: { caption: "Edit Fields output → email", fontSize: 10, lines: [
      "{",
      '  "rain_chance": 80,',
      '  "max_temp": 32.2',
      "}",
      "",
      "Subject: Rain alert: 80% chance today",
      "",
      "Max temperature: 32.2 C",
      "Carry rain covers for equipment and",
      "schedule indoor jobs first.",
    ] },
    check: "One API call, two fields, one decision — the pattern behind most API integrations.",
  });

  // ---------- WF2 ----------
  await d.wfOverview({
    wf: "WF2", name: "Order Currency Converter",
    nodes: [["manual", "Manual Trigger", "Run on demand"], ["mysql", "MySQL", "Select orders"], ["http", "HTTP Request", "Rate per order"], ["edit", "Edit Fields", "amount_inr"], ["sheets", "Google Sheets", "Append rows"]],
    goal: "An export business stores orders in USD, EUR, GBP and JPY. For each order the workflow fetches today's rate, converts the amount to rupees and writes a report to Google Sheets for the accounts team.",
    learn: ["One API call per item (n8n loops for you)", "Expressions inside query parameters", "Pairing API results with the original item", "Batching to respect rate limits"],
  });
  await d.wfBuild({
    wf: "WF2", name: "Order Currency Converter", fontSize: 11,
    rows: [
      ["Manual Trigger", "Run with **Execute workflow** (swap for a Schedule later)."],
      ["MySQL", "**Execute a SQL query**: `SELECT order_id, customer, currency, amount FROM orders WHERE currency <> 'INR'`"],
      ["HTTP Request", "GET `https://api.frankfurter.dev/v1/latest`; query `base` = `{{ $json.currency }}`, `symbols` = `INR`. Options → **Batching**: 5 items every 1000 ms."],
      ["Edit Fields", "`order_id` = `{{ $('MySQL').item.json.order_id }}`, `rate` = `{{ $json.rates.INR }}`, `amount_inr` = `{{ ($('MySQL').item.json.amount * $json.rates.INR).toFixed(2) }}`"],
      ["Google Sheets", "Append Row to the `INR Report` sheet: order_id, customer, currency, amount, rate, amount_inr."],
    ],
    tip: "The HTTP node replaces each item with the API response; `$('MySQL').item` fetches the matching order.",
  });
  await d.wfTest({
    wf: "WF2", name: "Order Currency Converter",
    steps: ["Execute; the HTTP node runs once per order", "Input and output item counts should match", "Open the `INR Report` sheet", "Spot-check one conversion by hand"],
    panel: { caption: "INR Report sheet", fontSize: 10, lines: [
      "order_id cur  amount    rate  amount_inr",
      "ORD-101  USD    1200   95.98   115176.00",
      "ORD-102  EUR     850  112.40    95540.00",
      "ORD-103  GBP     400  129.10    51640.00",
      "ORD-104  JPY  250000    0.64   160000.00",
      "",
      "# Rates change every working day",
    ] },
    check: "Every order has an INR value, and the sheet has exactly as many rows as there are orders in MySQL.",
  });

  // ---------- WF3 ----------
  await d.wfOverview({
    wf: "WF3", name: "Build Your Own API",
    nodes: [["webhook", "Webhook", "POST /service-request"], ["if", "IF", "Fields present?"], ["edit", "Edit Fields", "ticket_id"], ["mysql", "MySQL", "Insert ticket"], ["respond", "Respond to Webhook", "201 + JSON"]],
    goal: "Turn n8n into a small REST API. A website, mobile app or partner POSTs a service request as JSON; the API validates it, stores it in MySQL and replies with the new ticket ID.",
    learn: ["Webhook node as an API endpoint", "Validating a JSON body", "Custom status codes and JSON replies", "Testing with `Invoke-RestMethod`"],
  });
  await d.wfBuild({
    wf: "WF3", name: "Build Your Own API", fontSize: 11,
    rows: [
      ["Webhook", "HTTP Method **POST**, path `service-request`, Respond **Using 'Respond to Webhook' Node**."],
      ["IF", "All of `{{ $json.body.name }}`, `{{ $json.body.email }}`, `{{ $json.body.issue }}` **is not empty**."],
      ["Edit Fields", "`ticket_id` = `SR-{{ $now.toFormat('yyMMdd') }}-{{ $execution.id }}`, plus name, email and issue from `$json.body`."],
      ["MySQL", "Insert into `tickets`, map automatically."],
      ["Respond (x2)", "True: code `201`, body `{ \"status\": \"created\", \"ticket_id\": \"SR-…\" }`. False: code `400`, body `{ \"error\": \"name, email and issue are required\" }`."],
    ],
    tip: "Test URLs contain `/webhook-test/`; production URLs contain `/webhook/` — the most common mix-up.",
  });
  await d.wfTest({
    wf: "WF3", name: "Build Your Own API",
    steps: ["Click **Execute workflow** so it listens", "Send a valid request (right)", "Remove `email` and send again: expect `400`", "Check the `tickets` table for the new row", "Activate, then call the `/webhook/` URL"],
    panel: { caption: "PowerShell", fontSize: 9, lines: [
      "$body = @{",
      "  name  = 'Asha Patil'",
      "  email = 'asha@example.com'",
      "  issue = 'Printer not working'",
      "} | ConvertTo-Json",
      "",
      "$url = 'http://localhost:5678/webhook-test/' +",
      "       'service-request'",
      "Invoke-RestMethod -Method Post -Uri $url `",
      "  -ContentType 'application/json' -Body $body",
      "",
      "# status  ticket_id",
      "# ------  ---------",
      "# created SR-260929-26",
    ] },
    check: "The API answers in under a second with `201` and a ticket ID, or `400` with a clear error. Only valid requests reach MySQL.",
  });

  await d.troubleshoot({
    items: [
      ["`404` from your webhook", "Test URL (`/webhook-test/`) while building, production URL (`/webhook/`) once active. Is the method POST?"],
      ["`422 bad currency pair`", "Frankfurter can't convert a currency to itself. Filter out `INR` orders first."],
      ["`429 Too Many Requests`", "Turn on **Batching** in the HTTP node options, or **Retry On Fail** with a wait."],
      ["A field shows `undefined`", "Check the exact path: arrays need `[0]`, and webhook data sits under `body`."],
      ["`curl` acts strangely in PowerShell", "In Windows PowerShell `curl` is an alias. Use `curl.exe` or `Invoke-RestMethod`."],
      ["Call times out", "Raise **Timeout** in the HTTP node options; check your network or proxy."],
    ],
  });
  await d.challenge({
    items: [
      { level: "EASY", head: "Three-city forecast", text: "Check Pune, Mumbai and Nagpur, then send one email listing all three.", hint: "Read the cities from a sheet (3 items); the HTTP node runs once per city." },
      { level: "MEDIUM", head: "Ticket status API", text: "Add `GET /service-request?id=SR-…` that returns the ticket's status from MySQL.", hint: "A second Webhook with method GET; read `$json.query.id`." },
      { level: "STRETCH", head: "Two currencies", text: "Add EUR next to INR in the report, still with one API call per order.", hint: "`symbols=INR,EUR` returns both rates in `rates`." },
    ],
  });
  await d.summary({
    built: [
      ["WF1", "Weather Alert", "Schedule → Open-Meteo → IF → Gmail"],
      ["WF2", "Order Currency Converter", "MySQL → Frankfurter per order → Sheets"],
      ["WF3", "Your Own API", "Webhook → validate → MySQL → JSON reply"],
    ],
    takeaways: [
      "A call is method + URL + headers + body; the reply is status + JSON",
      "Read nested JSON by path; arrays start at `[0]`",
      "The HTTP node runs once per item, so batch to be polite",
      "Webhook + Respond to Webhook turns n8n into an API",
    ],
    next: "Module 4: Adding generative AI (GPT-4o mini) to workflows",
  });

  await d.save(out);
};
