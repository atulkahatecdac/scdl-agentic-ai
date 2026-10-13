// Module 2: Business Workflow Automation with n8n
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(2, "Business Workflow Automation with n8n");

  await d.titleSlide({
    title: "Business Workflow Automation with n8n",
    subtitle: "Collect data, apply business rules and store the results in MySQL — automatically.",
    flow: [
      ["FaWpforms", "Form", "A lead or expense arrives", C.coral],
      ["FaProjectDiagram", "n8n", "Rules: route, approve, report", C.navy],
      ["FaDatabase", "MySQL", "Stores every record", C.teal],
      ["FaEnvelope", "Gmail + Docs", "Emails and daily reports", C.coral],
    ],
    notes: "Module 1 used Google Sheets as the database. Today we move to MySQL, running in its own Docker container, and build three classic business automations: lead handling, approvals and reporting.",
  });

  await d.goalsAgenda({
    sub: "3 hands-on workflows",
    goals: [
      ["FaSitemap", "Turn a manual business process into a workflow"],
      ["FaCodeBranch", "Route items with IF and Switch"],
      ["FaDatabase", "Read and write MySQL from n8n"],
      ["FaUserCheck", "Pause a workflow for a human approval"],
    ],
    agenda: [
      "Welcome & objectives",
      "Core concepts",
      "Setup: MySQL container + credential",
      "WF1  Lead Capture & Qualification",
      "WF2  Expense Approval",
      "WF3  Daily Sales Report",
      "Troubleshooting, challenge, Q&A",
    ],
  });

  await d.cards3({
    title: "What Is Worth Automating?",
    sub: "Look for work that is frequent, rule-based and already digital",
    cards: [
      { icon: "FaUserPlus", color: C.coral, head: "Sales", body: ["Capture leads from forms", "Score and route them", "Send the first email instantly"] },
      { icon: "FaMoneyBillWave", color: C.teal, head: "Finance", body: ["Expense claims and approvals", "Invoice reminders", "Payment alerts"] },
      { icon: "FaChartLine", color: C.navy, head: "Operations", body: ["Daily and weekly reports", "Stock and SLA alerts", "Onboarding checklists"] },
    ],
    below: [
      "**Automate when:** it happens often · the rules are clear · the data is already digital.",
      "**Keep a human in the loop when:** money, legal risk or customer-facing judgement is involved — WF2 shows how.",
    ],
    notes: "Ask students to name one repetitive task from their own job. Most will fit one of these three columns.",
  });

  await d.iconRows({
    title: "Expressions: Reading Data Anywhere",
    sub: "Everything inside {{ }} is a small piece of JavaScript",
    rows: [
      { icon: "FaBolt", color: C.coral, head: "Current item", text: "`{{ $json.email }}`: a field from the node just before" },
      { icon: "FaProjectDiagram", head: "Any earlier node", text: "`{{ $('Form Trigger').item.json.email }}`" },
      { icon: "FaClock", color: C.teal, head: "Dates and times", text: "`{{ $now }}`, `{{ $today.minus({days: 1}) }}` (Luxon)" },
      { icon: "FaCode", head: "JavaScript methods", text: "`{{ $json.Email.trim().toLowerCase() }}`" },
    ],
    panel: { caption: "Cleaning form input in Edit Fields", fontSize: 10, lines: [
      "# field = expression",
      "email =",
      "  {{ $json.Email.trim().toLowerCase() }}",
      "name =",
      "  {{ $json.Name.trim() }}",
      "big_deal =",
      "  {{ $json.Budget == 'Above 5 lakh' }}",
      "received_on =",
      "  {{ $now.toFormat('yyyy-MM-dd') }}",
    ] },
    notes: "Show the expression editor: the right-hand preview evaluates the expression on the current item as you type.",
  });

  await d.grid4({
    title: "Four Logic Nodes",
    sub: "Between them they cover almost every business rule",
    cells: [
      { icon: "FaCodeBranch", color: C.navy, head: "IF", text: "Two paths: true and false. Example: `amount > 5000` → needs approval." },
      { icon: "FaRandom", color: C.coral, head: "Switch", text: "Many paths, one per rule or value. Example: budget band → hot, warm or cold." },
      { icon: "FaFilter", color: C.teal, head: "Filter", text: "Drops items that fail a condition. Example: keep only `status = Open`." },
      { icon: "FaCompressAlt", color: C.navy, head: "Merge", text: "Joins two branches into one — by position, or by matching a field like `email`." },
    ],
  });

  await d.grid4({
    title: "Working Efficiently in n8n",
    sub: "Four habits that save hours of debugging",
    cells: [
      { icon: "FaKey", color: C.teal, head: "Credentials", text: "Stored once, encrypted, reused by every node. Never paste passwords into node fields." },
      { icon: "FaHistory", color: C.navy, head: "Executions", text: "Each run is saved with every node's input and output — your first stop when something fails." },
      { icon: "FaSave", color: C.coral, head: "Pin data", text: "Freeze a node's output so you can rebuild later nodes without submitting the form again." },
      { icon: "FaPlay", color: C.navy, head: "Execute step", text: "Run just one node on its current input to test a change quickly." },
    ],
  });

  await d.iconRows({
    title: "Error Handling Basics",
    sub: "Plan for failure from the first workflow",
    rows: [
      { icon: "FaRedo", color: C.teal, head: "Retry On Fail", text: "Node **Settings**: retry up to 3 times with a wait. Good for brief network or API hiccups." },
      { icon: "FaCodeBranch", head: "On Error → Continue (using error output)", text: "Failed items go down a separate output instead of stopping the whole run." },
      { icon: "FaExclamationTriangle", color: C.coral, head: "Error workflow", text: "Workflow **Settings → Error workflow**: a separate workflow that alerts you on any failure (built in Module 5)." },
      { icon: "FaSearch", head: "Read the failed execution", text: "The red node shows the exact error message and the input that caused it." },
    ],
  });

  await d.stepsCode({
    title: "Setup: MySQL in Its Own Container",
    sub: "n8n keeps running in its container; MySQL gets a second one",
    steps: [
      "Start MySQL with the commands on the right",
      "Load `m2_schema.sql`: tables `leads`, `expenses`, `sales` with sample rows",
      "In n8n: **Credentials → MySQL**. Host `host.docker.internal`, port `3306`",
      "Database `bizdb`, user `n8n`, password `n8npass` → **Test**",
      "Why not `localhost`? Inside the n8n container, it means n8n itself",
    ],
    panel: { caption: "PowerShell", fontSize: 9, lines: [
      "# Start MySQL (first time only)",
      "docker volume create mysql_data",
      "docker run -d --name mysql -p 3306:3306 `",
      "  -e MYSQL_ROOT_PASSWORD=root123 `",
      "  -e MYSQL_DATABASE=bizdb `",
      "  -e MYSQL_USER=n8n -e MYSQL_PASSWORD=n8npass `",
      "  -v mysql_data:/var/lib/mysql mysql:8.4",
      "",
      "# Wait ~20 s on first start, then load tables",
      "Get-Content m2_schema.sql |",
      "  docker exec -i mysql mysql -un8n -pn8npass bizdb",
      "",
      "# Every later session",
      "docker start n8n mysql",
    ] },
    notes: "PowerShell has no < redirection, hence Get-Content piped into docker exec -i. host.docker.internal is Docker Desktop's name for the host machine, where port 3306 is published.",
  });

  // ---------- WF1 ----------
  await d.wfOverview({
    wf: "WF1", name: "Lead Capture & Qualification",
    nodes: [["form", "Form Trigger", "Lead form"], ["edit", "Edit Fields", "Clean + segment"], ["mysql", "MySQL", "Insert lead"], ["switch", "Switch", "hot / warm / cold"], ["gmail", "Gmail ×3", "Welcome emails"]],
    goal: "Leads arrive through a web form. The workflow cleans the data, labels each lead **hot, warm or cold** by budget, saves it in MySQL and sends a welcome email that suits the segment.",
    learn: ["Computing a field with an expression", "MySQL **Insert** with automatic mapping", "Switch node with named outputs", "Reading an earlier node with `$('Edit Fields')`"],
  });
  await d.wfBuild({
    wf: "WF1", name: "Lead Capture & Qualification", fontSize: 11,
    rows: [
      ["Form Trigger", "Fields: Name, Email, Company, Budget (dropdown: `Under 1 lakh`, `1-5 lakh`, `Above 5 lakh`), Source (dropdown: Website, Referral, Event)."],
      ["Edit Fields", "`email` = `{{ $json.Email.trim().toLowerCase() }}`, plus name, company, budget, source. `segment` = `{{ $json.Budget == 'Above 5 lakh' ? 'hot' : $json.Budget == '1-5 lakh' ? 'warm' : 'cold' }}`"],
      ["MySQL", "Operation **Insert**, table `leads`, **Map Automatically** (field names = column names)."],
      ["Switch", "Mode **Rules** on `{{ $('Edit Fields').item.json.segment }}`: `hot`, `warm`, `cold`. Rename the outputs Hot / Warm / Cold."],
      ["Gmail ×3", "To `{{ $('Edit Fields').item.json.email }}`. Hot: 'Our sales head will call you today.' Warm: brochure link. Cold: newsletter welcome."],
    ],
    tip: "After the MySQL node, `$json` holds the database result, not the lead — so later nodes read the lead from `$('Edit Fields')`.",
  });
  await d.wfTest({
    wf: "WF1", name: "Lead Capture & Qualification",
    steps: ["Execute workflow; submit 3 leads, one per budget band", "Check each lead leaves by the right Switch output", "Query MySQL (right): 3 new rows with segments", "Check the three different welcome emails"],
    panel: { caption: "Check in MySQL", fontSize: 9.5, lines: [
      "docker exec -it mysql mysql -un8n -pn8npass bizdb",
      "",
      "SELECT name, budget, segment",
      "  FROM leads ORDER BY id DESC LIMIT 3;",
      "+-------------+--------------+---------+",
      "| name        | budget       | segment |",
      "+-------------+--------------+---------+",
      "| Kiran Joshi | Under 1 lakh | cold    |",
      "| Neha Rao    | 1-5 lakh     | warm    |",
      "| Vikram Shah | Above 5 lakh | hot     |",
      "+-------------+--------------+---------+",
    ] },
    check: "Each lead is stored once with the right `segment`, and each person got the email meant for their band.",
  });

  // ---------- WF2 ----------
  await d.wfOverview({
    wf: "WF2", name: "Expense Approval",
    nodes: [["form", "Form Trigger", "Expense claim"], ["edit", "Edit Fields", "expense_id"], ["mysql", "MySQL", "Insert: Pending"], ["if", "IF", "amount > 5000"], ["gmail", "Gmail", "Send and wait"], ["mysql", "MySQL", "Update status"], ["gmail", "Gmail", "Tell employee"]],
    goal: "Employees submit expense claims. Small claims are approved automatically; claims above Rs 5,000 wait until the manager clicks **Approve** or **Decline** in an email. MySQL keeps the status and the employee hears the result.",
    learn: ["Human-in-the-loop with **Send and Wait**", "IF branches that rejoin", "MySQL **Update** matched on a key", "Status fields: Pending → Approved / Rejected"],
  });
  await d.wfBuild({
    wf: "WF2", name: "Expense Approval", fontSize: 10.5,
    rows: [
      ["Form Trigger", "Fields: Employee name, Email, Amount (number), Category (Travel, Meals, Supplies), Description."],
      ["Edit Fields", "`expense_id` = `EXP-{{ $now.toFormat('yyMMdd') }}-{{ $execution.id }}`, `status` = `Pending`, plus the form fields in lowercase."],
      ["MySQL: Insert", "Table `expenses`, map automatically."],
      ["IF", "`{{ $('Edit Fields').item.json.amount }}` **is greater than** `5000` (Number)."],
      ["Gmail (true)", "Operation **Send and Wait for Response**, response type **Approval**, to the manager. Message shows employee, amount and description."],
      ["MySQL: Update", "Table `expenses`, match on `expense_id`; `status` = `{{ $json.data.approved ? 'Approved' : 'Rejected' }}`. The false branch updates to `Approved` directly."],
      ["Gmail", "Tell the employee the result; read their email from `$('Edit Fields')`."],
    ],
  });
  await d.wfTest({
    wf: "WF2", name: "Expense Approval",
    steps: ["Submit a Rs 1,200 claim: approved at once", "Submit a Rs 12,000 claim: the run pauses", "Manager clicks **Approve** in the email", "The run resumes; the employee gets the result", "Check the `expenses` table (right)"],
    panel: { caption: "expenses table after both claims", fontSize: 10, lines: [
      "SELECT expense_id, amount, status",
      "  FROM expenses ORDER BY id DESC LIMIT 2;",
      "",
      "+---------------+--------+----------+",
      "| expense_id    | amount | status   |",
      "+---------------+--------+----------+",
      "| EXP-260929-58 |  12000 | Approved |",
      "| EXP-260929-57 |   1200 | Approved |",
      "+---------------+--------+----------+",
    ] },
    check: "While it waits, the run shows as **Waiting** under Executions. n8n resumes it when the manager responds, even hours later.",
  });

  // ---------- WF3 ----------
  await d.wfOverview({
    wf: "WF3", name: "Daily Sales Report",
    nodes: [["schedule", "Schedule", "Daily 9:00"], ["mysql", "MySQL", "Yesterday's sales"], ["aggregate", "Aggregate", "Rows → one list"], ["docs", "Google Docs", "Create doc"], ["docs", "Google Docs", "Insert text"], ["gmail", "Gmail", "Send link"]],
    goal: "Every morning at 9, read yesterday's sales from MySQL, summarise them by region, write the summary into a new Google Doc and email the link to the sales manager.",
    learn: ["Schedule Trigger and time zones", "SQL with **Execute a SQL query**", "Aggregating many items into one", "Google Docs: create, then insert text"],
  });
  await d.wfBuild({
    wf: "WF3", name: "Daily Sales Report", fontSize: 11,
    rows: [
      ["Schedule Trigger", "Every day at 9:00 (uses the container's `GENERIC_TIMEZONE`)."],
      ["MySQL", "**Execute a SQL query**: `SELECT region, COUNT(*) AS orders, SUM(amount) AS revenue FROM sales WHERE sale_date = CURDATE() - INTERVAL 1 DAY GROUP BY region`"],
      ["Aggregate", "**All Item Data (Into a Single List)**, output field `rows`."],
      ["Docs: Create", "Rename the node `Create`. Title `Sales report {{ $today.minus({days: 1}).toFormat('dd MMM yyyy') }}`, choose a Drive folder."],
      ["Docs: Update", "Document ID `{{ $json.id }}`, action **Insert** text: the report text (expression on the next slide)."],
      ["Gmail", "To the manager: `https://docs.google.com/document/d/{{ $('Create').item.json.id }}`"],
    ],
    tip: "Click **Execute workflow** to test now — there is no need to wait until 9 am.",
  });
  await d.wfTest({
    wf: "WF3", name: "Daily Sales Report",
    steps: ["Execute the workflow manually", "Open the new document in Google Drive", "Check the manager's inbox for the link", "Activate it: tomorrow it runs by itself"],
    panel: { caption: "Report text (Insert text expression)", fontSize: 9.5, lines: [
      "Sales report for {{ $today.minus({days: 1})",
      "  .toFormat('dd MMM yyyy') }}",
      "",
      "{{ $('Aggregate').item.json.rows",
      "  .map(r => r.region + ': ' + r.orders +",
      "    ' orders, Rs ' + r.revenue)",
      "  .join('\\n') }}",
      "",
      "# Result in the document",
      "West : 42 orders, Rs 318500",
      "North: 35 orders, Rs 244000",
      "South: 28 orders, Rs 196750",
    ] },
    check: "A dated Google Doc with one line per region, and an email with its link — every day, with no one touching it.",
  });

  await d.troubleshoot({
    items: [
      ["`ECONNREFUSED 127.0.0.1:3306`", "Use host `host.docker.internal`, not `localhost`: n8n and MySQL are separate containers."],
      ["`Access denied for user 'n8n'`", "User and password must match the `docker run` values. Changed them later? Recreate the container and volume."],
      ["`port is already allocated`", "Another MySQL is using 3306. Publish `-p 3307:3306` and use port 3307 in the credential."],
      ["Loading the schema fails", "On first start MySQL needs ~20 seconds to initialise. Wait, then run it again."],
      ["Approval buttons don't open", "The links point to `localhost:5678`, so open them on the machine running n8n."],
      ["Expression shows `undefined`", "Names are case-sensitive (`Email` ≠ `email`). Drag the field in from the input panel."],
    ],
  });
  await d.challenge({
    items: [
      { level: "EASY", head: "Weekly lead-source report", text: "Every Monday, email a count of last week's leads by `source`.", hint: "Execute SQL with `GROUP BY source`, then Aggregate → Gmail." },
      { level: "MEDIUM", head: "Chase pending claims", text: "Every evening, email managers the claims still `Pending` after 2 days.", hint: "`WHERE status = 'Pending' AND created_at < NOW() - INTERVAL 2 DAY`" },
      { level: "STRETCH", head: "Share hot leads", text: "Also append every hot lead to a Google Sheet that the sales team can see.", hint: "Add a second connection from the Hot output of the Switch." },
    ],
  });
  await d.summary({
    built: [
      ["WF1", "Lead Capture & Qualification", "Form → clean → MySQL → Switch → 3 emails"],
      ["WF2", "Expense Approval", "IF → Gmail approval → MySQL update"],
      ["WF3", "Daily Sales Report", "Schedule → SQL → Google Doc → Gmail"],
    ],
    takeaways: [
      "Business rules map directly to IF and Switch",
      "Read any earlier step with `$('Node').item`",
      "Send and Wait keeps a human in the loop",
      "Separate containers talk via `host.docker.internal`",
    ],
    next: "Module 3: Connecting workflows to external APIs",
  });

  await d.save(out);
};
