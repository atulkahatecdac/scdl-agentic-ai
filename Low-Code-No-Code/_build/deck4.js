// Module 4: Generative AI in Business Automation
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(4, "Generative AI in Business Automation");

  await d.titleSlide({
    title: "Generative AI in Business Automation",
    subtitle: "Add GPT-4o mini to workflows to classify, extract, summarise and write business content.",
    flow: [
      ["FaInbox", "Input", "Emails, PDFs, meeting notes", C.coral],
      ["FaBrain", "GPT-4o mini", "Understands the text", C.purple],
      ["FaProjectDiagram", "n8n", "Acts on the AI's answer", C.navy],
      ["FaDatabase", "Gmail, MySQL, Docs", "Labels, records, documents", C.teal],
    ],
    notes: "Rules handle structured data; an LLM handles unstructured text like emails and documents. Today the LLM becomes one node inside the workflows we already know how to build.",
  });

  await d.goalsAgenda({
    sub: "3 hands-on workflows",
    goals: [
      ["FaBrain", "Pick the right AI task: classify, extract, summarise, generate"],
      ["FaCode", "Write prompts that return reliable, structured output"],
      ["FaTags", "Use n8n's AI nodes with GPT-4o mini"],
      ["FaShieldAlt", "Control cost, errors and data privacy"],
    ],
    agenda: [
      "Welcome & objectives",
      "Core concepts",
      "Setup: OpenAI credential",
      "WF1  Email Triage",
      "WF2  Invoice Data Extraction",
      "WF3  Meeting Notes → Minutes",
      "Troubleshooting, challenge, Q&A",
    ],
  });

  await d.flowBlocks({
    title: "Four Things LLMs Do Well in Workflows",
    sub: "Each one is a single node inside an otherwise normal workflow",
    blocks: [
      { icon: "FaTags", color: C.purple, name: "Classify", what: "Pick a label", k1: "INPUT", v1: "Customer email", k2: "OUTPUT", v2: "Billing" },
      { icon: "FaMagic", color: C.navy, name: "Extract", what: "Pull out fields", k1: "INPUT", v1: "Invoice PDF text", k2: "OUTPUT", v2: "vendor, date, total" },
      { icon: "FaCompressAlt", color: C.purple, name: "Summarise", what: "Make it shorter", k1: "INPUT", v1: "2 pages of notes", k2: "OUTPUT", v2: "5 bullet points" },
      { icon: "FaPen", color: C.navy, name: "Generate", what: "Write new text", k1: "INPUT", v1: "Ticket + policy", k2: "OUTPUT", v2: "Draft reply" },
    ],
    notes: "Today's three workflows cover all four: WF1 classifies, WF2 extracts, WF3 summarises and generates.",
  });

  await d.iconRows({
    title: "Prompts for Automation",
    sub: "Chat prompts can be loose; workflow prompts must be exact",
    rows: [
      { icon: "FaUserTie", color: C.purple, head: "Role", text: "Who the model is: a support triage assistant" },
      { icon: "FaTasks", head: "Task + allowed answers", text: "Exactly what to do and the only valid outputs" },
      { icon: "FaListOl", color: C.teal, head: "Format", text: "JSON only, with fixed field names" },
      { icon: "FaClipboardList", head: "Examples", text: "One or two sample inputs with the right outputs" },
      { icon: "FaCog", color: C.coral, head: "Temperature 0", text: "Same input, same answer: best for decisions" },
    ],
    panel: { caption: "Prompt template", fontSize: 9.5, lines: [
      "You are a support triage assistant.",
      "",
      "Classify the email into exactly one of:",
      "Sales, Support, Billing, Spam.",
      "",
      "Return JSON only:",
      '{"category": "...", "reason": "..."}',
      "",
      "Email:",
      "{{ $json.Subject }}",
      "{{ $json.snippet }}",
    ] },
  });

  await d.cards3({
    title: "Structured Output",
    sub: "Later nodes (IF, Switch, MySQL) need fixed field names, not sentences",
    cards: [
      { icon: "FaExclamationTriangle", color: C.coral, head: "Free text", body: ["**Output:** \"Sure! This looks like a billing question about…\"", "Hard to route: the wording changes every time."] },
      { icon: "FaCode", color: C.navy, head: "JSON in prompt", body: ["**Output:** `{\"category\": \"Billing\"}`", "Easy to read with `$json.category` — but the model can still break the format."] },
      { icon: "FaCheckCircle", color: C.teal, head: "Schema-enforced", body: ["**Information Extractor** or a **Structured Output Parser** define the fields and types.", "n8n validates, so bad output fails loudly."] },
    ],
    below: [
      "**Rule of thumb:** if a later node reads the AI's answer, ask for JSON — and prefer a schema-enforced node.",
      "WF2 uses the Information Extractor; WF1's Text Classifier returns a fixed set of outputs for the same reason.",
    ],
  });

  await d.tableSlide({
    title: "n8n AI Nodes",
    sub: "All of them can use GPT-4o mini",
    head: ["Node", "Use it for", "In this module"],
    rows: [
      ["OpenAI (Message a model)", "Direct prompt → text or JSON", "Not used"],
      ["Basic LLM Chain", "Prompt + chat model sub-node + optional output parser", "Setup, WF3"],
      ["Text Classifier", "One output per category", "WF1 triage"],
      ["Information Extractor", "Typed fields from text, by schema", "WF2 invoices"],
      ["Sentiment Analysis", "Positive / neutral / negative routing", "Challenge"],
      ["AI Agent", "A model that picks tools itself", "Beyond this course"],
    ],
    colW: [2.5, 4.4, 2.1],
    fontSize: 12,
    belowY: 3.9,
    below: ["Chain-style nodes need an **OpenAI Chat Model** sub-node: model `gpt-4o-mini`, temperature `0`."],
  });

  await d.grid4({
    title: "Cost, Reliability & Privacy",
    sub: "Four questions to answer before an AI workflow goes live",
    cells: [
      { icon: "FaCoins", color: C.teal, head: "Cost", text: "gpt-4o-mini: about $0.15 per 1M input and $0.60 per 1M output tokens. One email ≈ 1 paisa. Set a monthly limit anyway." },
      { icon: "FaExclamationTriangle", color: C.coral, head: "Wrong answers", text: "Models can be confidently wrong. Validate outputs, keep an 'Other' path, and log what the AI decided." },
      { icon: "FaUserShield", color: C.navy, head: "Privacy", text: "Text you send leaves your network. Don't send passwords, card numbers or personal data you may not share." },
      { icon: "FaShieldAlt", color: C.purple, head: "Prompt injection", text: "An email can contain instructions ('ignore previous…'). Treat input as data; never let AI output trigger payments unchecked." },
    ],
    notes: "Prices as of 2026 — check the OpenAI pricing page before class. The whole course costs well under the US$5 credit.",
  });

  await d.stepsCode({
    title: "Setup: OpenAI in n8n",
    sub: "One credential, reused by every AI node",
    steps: [
      "Create an API key at platform.openai.com → **API keys**",
      "Add billing credit (US$5 covers the whole course)",
      "Set a monthly usage limit",
      "n8n: **Credentials → OpenAI**, paste the key → **Test**",
      "Gmail: create labels `AI/Sales`, `AI/Support`, `AI/Billing`, `AI/Spam`",
      "Load `m4_schema.sql` (adds the `invoices` table)",
    ],
    panel: { caption: "Quick test in n8n", fontSize: 10, lines: [
      "# Manual Trigger → Basic LLM Chain",
      "#   + OpenAI Chat Model (gpt-4o-mini)",
      "",
      "Prompt:",
      "  Classify: \"My card was charged",
      "  twice this month.\"",
      "  Answer with one word:",
      "  Sales, Support or Billing.",
      "",
      "Output:",
      "  { \"text\": \"Billing\" }",
    ] },
  });

  // ---------- WF1 ----------
  await d.wfOverview({
    wf: "WF1", name: "Email Triage",
    nodes: [["gmailTrigger", "Gmail Trigger", "New email"], ["classifier", "Text Classifier", "4 categories"], ["gmail", "Gmail ×4", "Add label"], ["sheets", "Google Sheets", "Log decision"]],
    goal: "Each new email in the support inbox is read by GPT-4o mini and sorted into **Sales, Support, Billing or Spam**. The email gets a matching Gmail label, and the decision is logged to a sheet for review.",
    learn: ["Gmail Trigger (polling)", "Text Classifier with category descriptions", "One output per category", "Logging AI decisions for audit"],
  });
  await d.wfBuild({
    wf: "WF1", name: "Email Triage", fontSize: 11,
    rows: [
      ["Gmail Trigger", "Poll every minute. Filters: label `INBOX`, read status **Unread only**. **Simplify** on."],
      ["Text Classifier", "Text: `Subject: {{ $json.Subject }} Body: {{ $json.snippet }}`. Categories with descriptions, e.g. **Billing**: 'payments, invoices, refunds, charges'. When no clear match: **Output on extra 'Other' branch**."],
      ["OpenAI Chat Model", "Sub-node of the classifier: model `gpt-4o-mini`, temperature `0`."],
      ["Gmail ×4", "Name them `Label Sales`, `Label Support`… Operation **Add Label**, message ID `{{ $('Gmail Trigger').item.json.id }}`."],
      ["Google Sheets", "Append to `Email Log`: time, from, subject, and category = `{{ $prevNode.name.replace('Label ', '') }}`. Then Gmail **Mark as Read**."],
    ],
    tip: "Good category descriptions matter more than clever prompts — describe in plain words what belongs in each class.",
  });
  await d.wfTest({
    wf: "WF1", name: "Email Triage",
    steps: ["Send the 4 test emails (right) to the inbox", "Execute; each email takes a different output", "Check the labels in Gmail", "Review the `Email Log` sheet", "Activate: new mail is sorted within a minute"],
    panel: { caption: "Test emails → expected label", fontSize: 10, lines: [
      "\"Can I get a quote for 50 licences?\"",
      "  → AI/Sales",
      "",
      "\"The app crashes when I upload a file\"",
      "  → AI/Support",
      "",
      "\"I was charged twice for September\"",
      "  → AI/Billing",
      "",
      "\"You WON a free iPhone, click here!!!\"",
      "  → AI/Spam",
    ] },
    check: "4 emails, 4 correct labels, 4 log rows — for well under one rupee in API cost.",
  });

  // ---------- WF2 ----------
  await d.wfOverview({
    wf: "WF2", name: "Invoice Data Extraction",
    nodes: [["form", "Form Trigger", "Upload PDF"], ["file", "Extract from File", "PDF → text"], ["extractor", "Information Extractor", "6 fields"], ["mysql", "MySQL", "Insert invoice"], ["formEnd", "Form", "Show result"]],
    goal: "The accounts team uploads a supplier invoice PDF. GPT-4o mini reads the text and pulls out vendor, invoice number, date, GSTIN and total, which are saved in MySQL — no manual typing.",
    learn: ["File upload fields in forms", "Extracting text from PDFs", "Schema-based extraction with types", "Checking AI output before saving"],
  });
  await d.wfBuild({
    wf: "WF2", name: "Invoice Data Extraction", fontSize: 11,
    rows: [
      ["Form Trigger", "One **File** field, label `Invoice`, accepted type `.pdf`, required."],
      ["Extract from File", "Operation **Extract From PDF**; input binary field `Invoice` (the form field's label)."],
      ["Information Extractor", "Text `{{ $json.text }}`. Attributes: `vendor_name`, `invoice_number`, `invoice_date` (YYYY-MM-DD), `gstin`, `total_amount` (number), `currency`. Chat model: gpt-4o-mini, temperature 0."],
      ["MySQL", "Insert into `invoices`, mapping each column manually, e.g. `{{ $json.output.vendor_name }}`."],
      ["Form (ending)", "`Saved invoice {{ $('Information Extractor').item.json.output.invoice_number }}`"],
    ],
    tip: "Scanned invoices (photos) have no text layer, so Extract from File returns nothing. Use text-based PDFs in this lab.",
  });
  await d.wfTest({
    wf: "WF2", name: "Invoice Data Extraction",
    steps: ["Open the form; upload `invoice_1.pdf`", "Inspect Extract from File: plain text", "Inspect the extractor's JSON (right)", "Check the new row in `invoices`", "Repeat with `invoice_2.pdf` (a different layout)"],
    panel: { caption: "Information Extractor output", fontSize: 9.5, lines: [
      "{",
      '  "output": {',
      '    "vendor_name": "Sahyadri Office Supplies",',
      '    "invoice_number": "SOS/2026/0412",',
      '    "invoice_date": "2026-09-18",',
      '    "gstin": "27ABCDE1234F1Z5",',
      '    "total_amount": 18408,',
      '    "currency": "INR"',
      "  }",
      "}",
    ] },
    check: "Two invoices with different layouts produce the same six fields — that is the value of schema-based extraction.",
  });

  // ---------- WF3 ----------
  await d.wfOverview({
    wf: "WF3", name: "Meeting Notes → Minutes",
    nodes: [["form", "Form Trigger", "Doc link + emails"], ["docs", "Google Docs", "Get notes"], ["ai", "LLM Chain", "Write minutes"], ["docs", "Google Docs", "Create + insert"], ["gmail", "Gmail", "Create draft"]],
    goal: "After a meeting, paste the link to the raw notes. GPT-4o mini writes minutes — summary, decisions and action items with owners — into a new Google Doc, and a Gmail draft to the attendees waits for review.",
    learn: ["Reading a Google Doc", "Prompting for a fixed output layout", "Creating and filling a new Doc", "Drafts, not sends: a human reviews AI text"],
  });
  await d.wfBuild({
    wf: "WF3", name: "Meeting Notes → Minutes", fontSize: 11,
    rows: [
      ["Form Trigger", "Fields: Notes doc URL, Meeting title, Attendee emails (comma separated)."],
      ["Docs: Get", "Doc ID or URL `{{ $json['Notes doc URL'] }}`, **Simplify** on → returns `content`."],
      ["Basic LLM Chain", "Prompt: the notes. Chat Messages → System: 'Write concise meeting minutes with three headings: SUMMARY, DECISIONS, ACTION ITEMS (owner, due date). Use only facts in the notes.' Sub-node: OpenAI Chat Model, `gpt-4o-mini`, temperature 0."],
      ["Docs: Create + Update", "Title `Minutes: {{ $('Form Trigger').item.json['Meeting title'] }}`; then **Insert** the model's reply (drag it in from the input panel)."],
      ["Gmail", "Resource **Draft** → Create. To the attendees; body = summary + link to the minutes."],
    ],
    tip: "Create a **draft**, not a sent email: a person checks AI-written text before it reaches anyone.",
  });
  await d.wfTest({
    wf: "WF3", name: "Meeting Notes → Minutes",
    steps: ["Put the sample raw notes into a Google Doc", "Submit the form with the doc link", "Open the new **Minutes** doc", "Open Gmail → Drafts; review, then send", "Compare with the notes: anything invented?"],
    panel: { caption: "Generated minutes (excerpt)", fontSize: 10, lines: [
      "SUMMARY",
      "Agreed launch plan for the Pune store.",
      "",
      "DECISIONS",
      "- Launch date moved to 15 Oct",
      "- Budget capped at Rs 4 lakh",
      "",
      "ACTION ITEMS",
      "- Priya: confirm vendor quotes (3 Oct)",
      "- Sameer: draft launch email (6 Oct)",
      "- Anil: book the venue (8 Oct)",
    ] },
    check: "Minutes in one consistent layout, every action item has an owner and date, and nothing goes out until a person clicks Send.",
  });

  await d.troubleshoot({
    items: [
      ["`401 Incorrect API key`", "Copy the key again (it is shown only once) and check for extra spaces in the credential."],
      ["`429 insufficient_quota`", "The account has no credit. Add billing in the OpenAI dashboard."],
      ["Wrong category chosen", "Improve the category descriptions, set temperature `0`, keep the 'Other' output."],
      ["Extract from File gives no text", "The PDF is a scanned image. Use a text PDF, or run OCR first."],
      ["AI output breaks the next node", "Use Information Extractor or a Structured Output Parser instead of free text."],
      ["The same email is processed twice", "Filter on **Unread only** and mark the email as read after labelling it."],
    ],
  });
  await d.challenge({
    items: [
      { level: "EASY", head: "Escalate angry customers", text: "Add a Sentiment Analysis node on WF1's Support branch and email a manager when the tone is negative.", hint: "The Negative output → Gmail." },
      { level: "MEDIUM", head: "Suggested replies", text: "For Billing emails, generate a polite reply and save it as a draft in the same thread.", hint: "Gmail draft has a Thread ID option: use the trigger's `threadId`." },
      { level: "STRETCH", head: "Check the invoice", text: "Send invoices for manual review when the GSTIN is not 15 characters or the total is above Rs 1 lakh.", hint: "An IF node after the extractor, before MySQL." },
    ],
  });
  await d.summary({
    built: [
      ["WF1", "Email Triage", "Gmail → Text Classifier → labels + log"],
      ["WF2", "Invoice Extraction", "PDF → text → Information Extractor → MySQL"],
      ["WF3", "Meeting Minutes", "Doc → GPT-4o mini → new Doc → Gmail draft"],
    ],
    takeaways: [
      "The LLM is one node; the workflow does the rest",
      "Schemas make AI output safe to use downstream",
      "Temperature 0 for decisions; review generated text",
      "gpt-4o-mini is cheap, but set limits and protect data",
    ],
    next: "Module 5: Capstone — an end-to-end AI support desk",
  });

  await d.save(out);
};
