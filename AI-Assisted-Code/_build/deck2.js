// Module 2: AI-Assisted Debugging, Refactoring & Code Optimization
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(2, "AI-Assisted Debugging, Refactoring & Code Optimization");

  await d.titleSlide({
    title: "AI-Assisted Debugging, Refactoring & Optimization",
    subtitle: "Find root causes, restructure code safely and make it faster, with tests guarding every change.",
    flow: [
      ["FaBug", "Debug", "Root cause, minimal fix", C.coral],
      ["FaTools", "Refactor", "Better structure, same behaviour", C.purple],
      ["FaTachometerAlt", "Optimize", "Measure, then speed up", C.navy],
      ["FaShieldAlt", "Validate", "Tests before and after", C.teal],
    ],
    notes: "Three ways of changing existing code. The common thread: AI proposes, tests decide whether the change is safe.",
  });

  await d.goalsAgenda({
    sub: "3 live demos on small, realistic Python code",
    goals: [
      ["FaBug", "Give the AI the context it needs to find root causes"],
      ["FaLock", "Lock behaviour with tests before refactoring"],
      ["FaStopwatch", "Measure before and after optimizing"],
      ["FaCodeBranch", "Make AI changes small, reviewed and reversible"],
    ],
    agenda: [
      "Welcome & objectives",
      "Core concepts",
      "Setup: Module-2-Lab",
      "D1  Debug Two Bugs",
      "D2  Refactor Safely",
      "D3  Measure & Optimize",
      "Lab, pitfalls & Q&A",
    ],
  });

  await d.flowBlocks({
    title: "The AI-Assisted Debugging Workflow",
    sub: "AI suggests causes; you verify the fix",
    blocks: [
      { icon: "FaRedo", color: C.coral, name: "Reproduce", what: "Make it fail", k1: "YOU GET", v1: "Full traceback or wrong output", k2: "WATCH FOR", v2: "\"Sometimes\" bugs" },
      { icon: "FaPaste", color: C.navy, name: "Share", what: "Code + error", k1: "YOU GIVE", v1: "Traceback, code, input", k2: "WATCH FOR", v2: "Pasting only the last line" },
      { icon: "FaSearch", color: C.purple, name: "Diagnose", what: "Ask for causes", k1: "YOU ASK", v1: "Root cause + smallest fix", k2: "WATCH FOR", v2: "Fixing the symptom" },
      { icon: "FaWrench", color: C.navy, name: "Fix", what: "Apply one change", k1: "YOU CHECK", v1: "You can explain why", k2: "WATCH FOR", v2: "Unrelated \"clean-ups\"" },
      { icon: "FaVial", color: C.teal, name: "Test", what: "Prove it", k1: "YOU ADD", v1: "A test for this bug", k2: "WATCH FOR", v2: "Fix breaks other cases" },
    ],
  });

  await d.cards3({
    title: "Three Kinds of Bugs",
    sub: "The less the computer tells you, the more context the AI needs",
    cards: [
      { icon: "FaTimesCircle", color: C.coral, head: "Syntax", body: ["The code won't even start.", "The interpreter points at the line.", "AI fixes these instantly, and so does your IDE."] },
      { icon: "FaExclamationTriangle", color: C.navy, head: "Runtime", body: ["Starts, then crashes with a traceback.", "**Give the AI the whole traceback**, not just the last line.", "D1: `TypeError` from CSV strings."] },
      { icon: "FaQuestionCircle", color: C.purple, head: "Logic", body: ["Runs fine, wrong answer, no error.", "Give the **rule**, the **input** and the **expected vs actual** result.", "D1: `>` where the rule says \"or more\"."] },
    ],
    below: [
      "**Prompt shape:** \"Here is the error, the code and the input. Expected X, got Y. What is the root cause? Suggest the smallest fix.\"",
    ],
  });

  await d.iconRows({
    title: "Refactoring: Same Behaviour, Better Code",
    sub: "Tidying a room: nothing disappears, everything is easier to find",
    rows: [
      { icon: "FaTag", color: C.coral, head: "Rename for clarity", text: "`a`, `tx`, `t` → `gross`, `tax`, `total_net`" },
      { icon: "FaCut", head: "Extract functions", text: "One function, one job: read, validate, calculate, format" },
      { icon: "FaClone", color: C.teal, head: "Remove duplication", text: "Copy-pasted logic means copy-pasted bugs" },
      { icon: "FaHashtag", color: C.purple, head: "Name magic numbers", text: "`50000` → `SLAB_LIMIT`" },
      { icon: "FaLock", color: C.navy, head: "Lock behaviour first", text: "Characterization tests before any change" },
    ],
    panel: { caption: "The key line in every refactor prompt", fontSize: 9.5, lines: [
      "Refactor process_payroll.",
      "",
      "Must NOT change:",
      "- name and signature",
      "- the returned text,",
      "  character for character",
      "- which rows are skipped",
      "",
      "Show the result as a diff",
      "and explain each change.",
    ] },
  });

  await d.grid4({
    title: "Optimization: Measure First",
    sub: "Never guess where the time goes",
    cells: [
      { icon: "FaStopwatch", color: C.teal, head: "Measure", text: ["`time.perf_counter()` for a quick number,", "`python -m cProfile -s tottime` to see *where*."] },
      { icon: "FaSyncAlt", color: C.coral, head: "Typical culprits", text: ["Search inside a loop (`list.count`, `in list`)", "Repeated DB / API calls; wrong data structure"] },
      { icon: "FaRobot", color: C.purple, head: "Where AI helps", text: ["Name the complexity (O(n²)) and the line", "Propose a dict / set / Counter version"] },
      { icon: "FaBalanceScale", color: C.navy, head: "Readable by default", text: ["Optimize only what you measured as slow.", "Keep the simplest fix that is fast enough."] },
    ],
    notes: "D3 shows a real 500x speed-up from two small data-structure changes, but only after measuring and locking the results with tests.",
  });

  await d.tableSlide({
    title: "Safe AI Changes",
    sub: "Common problems with AI fixes, and the habit that prevents each one",
    head: ["Problem", "What it looks like", "Habit"],
    rows: [
      ["Symptom, not cause", "`try/except: pass` around the crash", "Ask for the **root cause** first"],
      ["Silent side effects", "\"While I was there I also renamed…\"", "\"Change only X\"; review the diff"],
      ["Behaviour change", "Refactor alters output or edge cases", "Characterization tests first"],
      ["Slower or less clear", "Clever one-liners nobody can read", "Measure; prefer readable"],
      ["No way back", "Many edits mixed together", "Commit before each AI change"],
    ],
    colW: [2.0, 3.9, 3.1],
    fontSize: 12,
    belowY: 3.45,
    below: ["**Git is your undo button:** `git commit` before asking the AI, `git diff` after, `git checkout -- file` if it went wrong."],
  });

  await d.stepsCode({
    title: "Setup: Module-2-Lab",
    sub: "Same pattern as Module 1: starter, solution, PROMPT.md, tests",
    steps: [
      "Open `Module-2-Lab` in VS Code",
      "Create the venv and install requirements",
      "`pytest` → the solutions pass",
      "`git status` is clean, so you can undo any AI change",
      "Keep `PROMPT.md` open next to the AI chat",
    ],
    panel: { caption: "PowerShell, in Module-2-Lab", fontSize: 9.5, lines: [
      "python -m venv .venv",
      ".\\.venv\\Scripts\\Activate.ps1",
      "pip install -r requirements.txt",
      "",
      "pytest",
      "  17 passed",
      "",
      "# D1  demo1_debug     sales_report.py",
      "# D2  demo2_refactor  payroll.py",
      "# D3  demo3_optimize  customers.py",
      "#                     + benchmark.py",
    ] },
  });

  // ---------- D1 ----------
  await d.demoOverview({
    demo: "D1", name: "Debug Two Bugs", folder: "Module-2-Lab/demo1_debug",
    flow: [
      ["FaPlay", "Run report", "sales.csv", C.navy],
      ["FaBug", "TypeError", "Crash", C.coral],
      ["FaWrench", "Minimal fix", "int() / float()", C.purple],
      ["FaQuestionCircle", "Wrong total", "No error", C.coral],
      ["FaCheckCircle", "pytest", "5 passed", C.teal],
    ],
    goal: "A revenue-by-region report crashes. After the fix it runs, but North is **500 rupees too high**. Debug both: the runtime error from the traceback, and the logic error from the business rule.",
    learn: ["Giving the AI the full traceback", "Asking for the smallest fix", "Debugging without a traceback", "A regression test for each bug"],
  });
  await d.demoPrompt({
    demo: "D1", name: "Debug Two Bugs",
    panel: { caption: "Prompt 1 (crash) and prompt 2 (wrong number)", fontSize: 9, lines: [
      "Running sales_report.py fails with this",
      "traceback: <full traceback>",
      "Here is order_value. sales.csv has columns",
      "order_id,region,product,quantity,unit_price.",
      "Expected: the order value as a number.",
      "What is the root cause? Suggest the smallest",
      "fix - do not change anything else.",
      "",
      "# --- after the first fix ---",
      "The rule is: \"an order worth 10,000 or more",
      "gets a 5% bulk discount\". Order 1008 is",
      "8 x 1250.00 = 10,000 and got NO discount.",
      "Trace order_value step by step with that",
      "input and find where it differs from the rule.",
    ] },
    points: [
      ["Root cause 1", "`csv.DictReader` returns strings, and `\"40\" * \"45.00\"` fails. Convert with `int()` and `float()`.", C.coral],
      ["\"Smallest fix\"", "Stops the AI rewriting the whole file while it's there."],
      ["Root cause 2", "`>` should be `>=`. One character, and no traceback to find it.", C.purple],
      ["Rule + input + expected", "That's what replaces the traceback for a logic bug.", C.navy],
    ],
  });
  await d.demoRun({
    demo: "D1", name: "Debug Two Bugs",
    steps: [
      "`python demo1_debug/starter/sales_report.py`",
      "Send prompt 1; apply only the conversion",
      "Report runs, but `pytest` still has a failure",
      "Send prompt 2; change `>` to `>=`",
      "`pytest demo1_debug --target starter`",
    ],
    panel: { caption: "Before → after", fontSize: 9.5, lines: [
      "  value = row[\"quantity\"] * row[\"unit_price\"]",
      "TypeError: can't multiply sequence by",
      "           non-int of type 'str'",
      "",
      "# after fix 1: runs, but",
      "North     11,987.50   # expected 11,487.50",
      "",
      "# after fix 2:",
      "North     11,487.50",
      "South     14,000.00",
      "West       7,800.00",
      "",
      "5 passed",
    ] },
    check: "Each bug now has a test (`test_order_exactly_at_threshold_gets_discount`), so if it comes back, the test suite catches it.",
  });

  // ---------- D2 ----------
  await d.demoOverview({
    demo: "D2", name: "Refactor Safely", folder: "Module-2-Lab/demo2_refactor",
    flow: [
      ["FaFileCode", "payroll.py", "One long function", C.navy],
      ["FaLock", "Golden master", "3 passed, 4 skipped", C.teal],
      ["FaTools", "Refactor prompt", "Must NOT change…", C.purple],
      ["FaCodeBranch", "Review diff", "One change at a time", C.navy],
      ["FaCheckCircle", "pytest", "7 passed", C.teal],
    ],
    goal: "`process_payroll()` reads, validates, calculates tax (copy-pasted twice) and formats, all in one function. Lock today's output with a **golden master**, then let the AI split it up without changing a single character of output.",
    learn: ["Characterization (golden master) tests", "Telling the AI what must not change", "Extracting functions and constants", "Tests that are skipped until helpers exist"],
  });
  await d.demoPrompt({
    demo: "D2", name: "Refactor Safely",
    panel: { caption: "Refactor prompt", fontSize: 9, lines: [
      "Refactor process_payroll in payroll.py.",
      "",
      "Must NOT change: the function name and",
      "signature, the returned text (character for",
      "character), and which rows are skipped.",
      "",
      "Do:",
      "- split it into small functions: read_employees,",
      "  is_payable, calculate_tax(gross),",
      "  net_pay(gross, emp_type), format_line",
      "- tax slab logic in exactly one place",
      "- named constants for 50000, 0.10, 0.20, 1800",
      "- descriptive names; a with-block for the file",
      "",
      "Show the result as a diff and explain each",
      "change in one line.",
    ] },
    points: [
      ["Lock behaviour first", "`expected_report.txt` is today's exact output, and a test compares against it.", C.teal],
      ["The \"must NOT change\" list", "Without it, the AI \"improves\" the report format too.", C.coral],
      ["Name the target shape", "Listing the functions you want keeps the diff predictable."],
      ["Ask for a diff", "Review what changed rather than rereading the whole file.", C.navy],
    ],
    tip: "You can ask the AI to write the characterization tests too: \"capture the CURRENT behaviour, don't judge it\".",
  });
  await d.demoRun({
    demo: "D2", name: "Refactor Safely",
    steps: [
      "Run the tests on the starter: **3 passed, 4 skipped**",
      "`git commit`, then send the refactor prompt",
      "Review the diff, one change at a time",
      "Run the same tests again: **7 passed**",
      "If the golden master fails, reject the change",
    ],
    panel: { caption: "Same output, now from small functions", fontSize: 9, lines: [
      "def calculate_tax(gross):",
      "    if gross > SLAB_LIMIT:",
      "        return (SLAB_LIMIT * LOWER_RATE",
      "            + (gross - SLAB_LIMIT) * UPPER_RATE)",
      "    return gross * LOWER_RATE",
      "",
      "def net_pay(gross, emp_type):",
      "    return (gross - calculate_tax(gross)",
      "            - PF_DEDUCTION[emp_type])",
      "",
      "E01  Asha Kulkarni  FT  ...  net  71,200.00",
      "TOTAL NET 259,400.00",
      "SKIPPED E04, E06",
    ] },
    check: "The golden master passed before and after the refactor, so the behaviour is unchanged. The 4 skipped tests run once the new helpers exist.",
  });

  // ---------- D3 ----------
  await d.demoOverview({
    demo: "D3", name: "Measure & Optimize", folder: "Module-2-Lab/demo3_optimize",
    flow: [
      ["FaStopwatch", "benchmark.py", "3.9 s", C.coral],
      ["FaSearch", "cProfile", "Find the hot spot", C.navy],
      ["FaRobot", "Ask for O(…)", "Then a fix", C.purple],
      ["FaVial", "pytest", "Same results", C.teal],
      ["FaTachometerAlt", "benchmark.py", "0.007 s", C.teal],
    ],
    goal: "Two customer-analytics functions are correct but take about 4 seconds for 10,000 orders. Measure, find the hot spot, ask the AI for the complexity and a fix, then prove the results are identical and measure again.",
    learn: ["Timing and profiling before changing code", "O(n²) hiding in `list.count`", "Dicts, sets and `Counter`", "A subtle trap: first vs last duplicate"],
  });
  await d.demoPrompt({
    demo: "D3", name: "Measure & Optimize",
    panel: { caption: "Analysis first, then the change", fontSize: 9, lines: [
      "These two functions are correct but slow for",
      "10,000 orders and 3,000 customers (profile",
      "output below). For each function:",
      "1. state its time complexity and the line",
      "   that causes it",
      "2. propose a faster version with the SAME",
      "   results, including:",
      "   - repeat_customers keeps first-seen order",
      "   - orders_with_names uses the FIRST",
      "     matching customer record; 'Unknown'",
      "     when there is no match",
      "Prefer the simplest readable fix (standard",
      "library only).",
      "",
      "<customers.py + cProfile output>",
    ] },
    points: [
      ["Give it the profile", "Real measurements stop the AI from \"optimizing\" the wrong function.", C.teal],
      ["Complexity first", "`list.count` inside the loop is O(n²). A linear search per order is O(n × m).", C.purple],
      ["Spell out \"same results\"", "Order and duplicates are where optimizations silently change behaviour.", C.coral],
      ["The trap", "`{c[\"id\"]: c[\"name\"] for c in …}` keeps the **last** duplicate. One test catches it.", C.navy],
    ],
  });
  await d.demoRun({
    demo: "D3", name: "Measure & Optimize",
    steps: [
      "`python demo3_optimize/benchmark.py`",
      "`python -m cProfile -s tottime …`",
      "`pytest demo3_optimize --target starter`: 5 pass",
      "Send the prompt; apply the change",
      "Tests again, then `benchmark.py both`",
    ],
    panel: { caption: "benchmark.py both", fontSize: 9.5, lines: [
      "10,000 orders, 3,000 customers",
      "starter   repeat_customers   2.561s",
      "          orders_with_names  1.311s",
      "solution  repeat_customers   0.004s",
      "          orders_with_names  0.003s",
      "results identical: True",
      "speed-up: 500x",
      "",
      "# the fix",
      "counts = Counter(o['customer_id']",
      "                 for o in orders)",
      "names.setdefault(c['id'], c['name'])",
    ] },
    check: "The speed-up is measured, not guessed, and the 5 tests show the results did not change. Timing is kept out of the tests so they never become flaky.",
  });

  await d.troubleshoot({
    items: [
      ["The AI wraps the crash in try/except", "Ask \"what is the root cause?\" and reject fixes that only hide the error."],
      ["The fix changes ten other lines", "\"Smallest fix, change nothing else\". Review with `git diff`."],
      ["Refactor changed the output", "The golden master test fails. Reject it and ask for a smaller step."],
      ["\"Optimized\" code isn't faster", "Measure again. Optimize the hot spot from the profile, not a guess."],
      ["Timing numbers jump around", "Use the same seeded data, run twice, compare ratios not absolutes."],
      ["Can't get back to the original", "Commit before every AI change; `git checkout -- file` undoes it."],
    ],
  });
  await d.challenge({
    items: [
      { level: "LAB 1", head: "Debug", text: "Add a third bug to `sales_report.py` (e.g. a missing region). Have a partner debug it with the AI using only the traceback or the rule.", hint: "Give the AI expected vs actual, never the answer." },
      { level: "LAB 2", head: "Refactor", text: "Add an `intern` pay rule (no tax under 20,000) to the **refactored** payroll. Compare how hard that would be in the starter.", hint: "Update `expected_report.txt` only after you agree the new output is correct." },
      { level: "LAB 3", head: "Optimize", text: "Add `top_customers(orders, n)` the slow way, measure it, then optimize it with the AI and show the speed-up.", hint: "`collections.Counter.most_common`." },
    ],
  });
  await d.summary({
    built: [
      ["D1", "Debug Two Bugs", "Traceback → TypeError; rule → off-by-one"],
      ["D2", "Refactor Safely", "Golden master, then small functions"],
      ["D3", "Measure & Optimize", "Profile → O(n) fix → 500x faster"],
    ],
    takeaways: [
      "Full context in, precise fix out",
      "Root cause, smallest change",
      "Lock behaviour before refactoring",
      "Measure before and after optimizing",
    ],
    next: "Module 3: Automated Testing with Generative AI",
  });

  await d.save(out);
};
