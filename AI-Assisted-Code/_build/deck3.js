// Module 3: Automated Testing with Generative AI
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(3, "Automated Testing with Generative AI");

  await d.titleSlide({
    title: "Automated Testing with Generative AI",
    subtitle: "Use AI to find test scenarios, write pytest code, mock dependencies and close coverage gaps.",
    flow: [
      ["FaListUl", "Scenarios", "Normal, boundary, invalid", C.coral],
      ["FaRobot", "Generate", "pytest code from the spec", C.purple],
      ["FaPlay", "Run", "Fast, repeatable, offline", C.navy],
      ["FaBalanceScale", "Judge", "Test wrong, or code wrong?", C.teal],
    ],
    notes: "AI writes tests very fast. The skill this module teaches is judging them: which scenarios matter, and whether a failure means a bad test or a bad program.",
  });

  await d.goalsAgenda({
    sub: "3 live demos; each one finds real bugs",
    goals: [
      ["FaListUl", "Ask for scenarios before test code"],
      ["FaVial", "Generate readable pytest tests from a requirement"],
      ["FaTheaterMasks", "Mock external services so tests run offline"],
      ["FaChartPie", "Use coverage to find what your tests miss"],
    ],
    agenda: [
      "Welcome & objectives",
      "Core concepts",
      "Setup: pytest + pytest-cov",
      "D1  Unit Tests Find a Bug",
      "D2  Mock an External API",
      "D3  Integration + Coverage",
      "Lab, pitfalls & Q&A",
    ],
  });

  await d.flowBlocks({
    title: "Why Automate Tests?",
    sub: "Automated tests compare actual with expected behaviour, every time, in seconds",
    blocks: [
      { icon: "FaBolt", color: C.coral, name: "Fast feedback", what: "Seconds, not hours", k1: "EXAMPLE", v1: "150 lab tests: < 1 s", k2: "PAYS OFF", v2: "On every change" },
      { icon: "FaRedo", color: C.navy, name: "Repeatable", what: "Same checks every run", k1: "EXAMPLE", v1: "No \"I forgot to try 0\"", k2: "PAYS OFF", v2: "On every release" },
      { icon: "FaHistory", color: C.purple, name: "Regressions", what: "Old bugs stay dead", k1: "EXAMPLE", v1: "A test per fixed bug", k2: "PAYS OFF", v2: "On refactors" },
      { icon: "FaBook", color: C.teal, name: "Living spec", what: "Tests document rules", k1: "EXAMPLE", v1: "test_hundred_percent…", k2: "PAYS OFF", v2: "For new teammates" },
    ],
  });

  await d.tableSlide({
    title: "Types of Automated Tests",
    sub: "This module: practical unit and integration tests with pytest",
    head: ["Type", "What it checks", "Speed", "Demo"],
    rows: [
      ["Unit", "One function or class, in isolation", "ms", "D1"],
      ["Unit + mocks", "Code that calls an API, with the API faked", "ms", "D2"],
      ["Integration", "Components together: service + real (in-memory) DB", "ms–s", "D3"],
      ["End-to-end", "A full user journey through the real app", "s–min", "Beyond today"],
    ],
    colW: [1.7, 4.6, 1.1, 1.6],
    fontSize: 12.5,
    belowY: 3.7,
    below: [
      "**Anatomy of every test, Arrange → Act → Assert:** prepare inputs, call the code, check the result.",
      "One behaviour per test, with a name that says what it checks: `test_full_course_rejects_the_next_student`.",
    ],
  });

  await d.iconRows({
    title: "Prompting AI for Tests",
    sub: "Scenarios first, then code, with expectations from the requirement",
    rows: [
      { icon: "FaFileAlt", color: C.coral, head: "Give the requirement", text: "Not just the code: tests copied from the code lock in its bugs" },
      { icon: "FaListUl", head: "Ask for scenarios first", text: "Normal, boundary, invalid. A list is quick to review." },
      { icon: "FaCode", color: C.purple, head: "Name the framework & style", text: "pytest, parametrize, `pytest.raises(match=…)`, clear names" },
      { icon: "FaRuler", color: C.teal, head: "Edge cases explicitly", text: "Empty, zero, max, negative, wrong type, None" },
      { icon: "FaBalanceScale", head: "Judge each failure", text: "Is the test wrong, or the code? The requirement decides." },
    ],
    panel: { caption: "Two-step test prompt", fontSize: 9, lines: [
      "# step 1",
      "List the test scenarios for this",
      "function, grouped as normal, boundary",
      "and invalid input. No code yet.",
      "",
      "# step 2",
      "Write pytest tests for them.",
      "- one behaviour per test",
      "- parametrize similar inputs",
      "- pytest.raises(..., match=...)",
      "- expected values from the",
      "  REQUIREMENT, not from running",
      "  the code",
    ] },
  });

  await d.grid4({
    title: "Reviewing AI-Generated Tests",
    sub: "A test that passes is not automatically a good test",
    cells: [
      { icon: "FaExclamationTriangle", color: C.coral, head: "Wrong assumptions", text: "The AI guesses behaviour the requirement never stated. Check every expected value against the spec." },
      { icon: "FaFeatherAlt", color: C.navy, head: "Weak assertions", text: "`assert result is not None` passes for almost anything. Assert exact values and error messages." },
      { icon: "FaClone", color: C.purple, head: "Duplicates", text: "Ten tests of the same normal case add no safety. Use parametrize, and delete the overlap." },
      { icon: "FaChartPie", color: C.teal, head: "Coverage ≠ correctness", text: "Coverage shows which lines ran, not whether the assertions are right. Use it to find gaps (D3)." },
    ],
  });

  await d.stepsCode({
    title: "Setup: pytest + pytest-cov",
    sub: "Everything runs offline; the API in D2 is mocked",
    steps: [
      "Open `Module-3-Lab` in VS Code",
      "Create the venv; `pip install -r requirements.txt`",
      "`pytest` → the reference tests pass on the solutions",
      "`pytest --target starter` → the same tests find the starters' bugs",
      "Optional: hide a demo's `test_*.py` to generate it live",
    ],
    panel: { caption: "PowerShell, in Module-3-Lab", fontSize: 9.5, lines: [
      "python -m venv .venv",
      ".\\.venv\\Scripts\\Activate.ps1",
      "pip install -r requirements.txt",
      "   # pytest, pytest-cov",
      "",
      "pytest",
      "  29 passed",
      "pytest --target starter",
      "  9 failed, 20 passed",
      "",
      "# 9 failures = bugs the tests find",
    ] },
    notes: "In this module the test files ARE the AI output (after review). The starters are the code under test, each with at least one hidden bug.",
  });

  // ---------- D1 ----------
  await d.demoOverview({
    demo: "D1", name: "Unit Tests Find a Bug", folder: "Module-3-Lab/demo1_unit",
    flow: [
      ["FaFileAlt", "discount.py", "Code + requirement", C.navy],
      ["FaListUl", "Scenarios", "Normal / edge / bad", C.purple],
      ["FaRobot", "pytest code", "14 tests", C.purple],
      ["FaTimesCircle", "Run", "4 failed", C.coral],
      ["FaBalanceScale", "Test or code?", "Requirement decides", C.teal],
    ],
    goal: "`calculate_discount(price, percentage)` has a written requirement and no tests. Generate scenarios, then pytest code, and run it. Four tests fail. For each one, decide whether **the test or the code** is wrong.",
    learn: ["Scenarios before code", "Boundary values: 0 and 100", "parametrize and pytest.raises", "Never \"fix\" a test to match a bug"],
  });
  await d.demoPrompt({
    demo: "D1", name: "Unit Tests Find a Bug",
    panel: { caption: "Requirement (in the docstring) + prompt", fontSize: 9, lines: [
      "# requirement",
      "calculate_discount(price, percentage) returns",
      "the price after discount, rounded to 2 dp.",
      "price >= 0, percentage between 0 and 100",
      "inclusive (100 = free item). Anything else",
      "raises ValueError.",
      "",
      "# prompt (after reviewing the scenario list)",
      "Now write pytest tests for those scenarios.",
      "- one behaviour per test, descriptive names",
      "- parametrize groups of similar inputs",
      "- pytest.raises with match= for errors",
      "- expected values must come from the",
      "  REQUIREMENT, not from running the code",
    ] },
    points: [
      ["Review the scenario list", "Is 100% in it? A string price? Lists are cheap to fix; 200 lines of tests are not.", C.purple],
      ["The key line", "\"From the REQUIREMENT\": otherwise the tests just copy the bug.", C.coral],
      ["Boundaries find bugs", "0 and 100 are where `<` vs `<=` mistakes live."],
      ["Readable names", "`test_hundred_percent_makes_item_free` reads like the spec.", C.navy],
    ],
  });
  await d.demoRun({
    demo: "D1", name: "Unit Tests Find a Bug",
    steps: [
      "`pytest demo1_unit --target starter`",
      "4 failures; ask: \"test or code, given the requirement?\"",
      "100%: requirement says inclusive, so the **code** is wrong",
      "String input: `TypeError` vs \"raises ValueError\": code",
      "Fix the code, not the tests: **14 passed**",
    ],
    panel: { caption: "Terminal", fontSize: 9.5, lines: [
      "> pytest demo1_unit --target starter",
      "FAILED test_hundred_percent_makes_item_free",
      "  ValueError: percentage must be between",
      "              0 and 100",
      "FAILED test_non_numeric_input_raises_value_",
      "       error[1000-10]   (x3)",
      "4 failed, 10 passed",
      "",
      "# the bug",
      "if percentage < 0 or percentage >= 100:",
      "# the fix",
      "if not 0 <= percentage <= 100:",
    ] },
    check: "The tests found a real boundary bug in under a minute. In real projects, ambiguous failures go back to the product owner, not to the AI.",
  });

  // ---------- D2 ----------
  await d.demoOverview({
    demo: "D2", name: "Mock an External API", folder: "Module-3-Lab/demo2_mock",
    flow: [
      ["FaGlobe", "Frankfurter API", "Live exchange rate", C.teal],
      ["FaTheaterMasks", "Mock urlopen", "Fake JSON", C.purple],
      ["FaWifi", "Simulate failure", "URLError, bad JSON", C.coral],
      ["FaTimesCircle", "Run", "3 failed", C.coral],
      ["FaCheckCircle", "Fix code", "7 passed, offline", C.teal],
    ],
    goal: "`exchange.py` converts currency with a live API. Tests that hit the real API are slow, need internet and break when the rate changes. **Mock** `urlopen`, then test the failures you can't easily trigger for real.",
    learn: ["`unittest.mock.patch` in a fixture", "`assert_not_called()`", "Testing error paths with `side_effect`", "A real API quirk: 422 for USD→USD"],
  });
  await d.demoPrompt({
    demo: "D2", name: "Mock an External API",
    panel: { caption: "Mocking prompt", fontSize: 9, lines: [
      "Write pytest tests for exchange.py. Do not call",
      "the network: patch urllib.request.urlopen with",
      "unittest.mock and return a fake JSON body.",
      "",
      "Cover:",
      "- rate read from the response; convert() rounds",
      "- URL has upper-case codes; urlopen gets a timeout",
      "- negative amount -> ValueError WITHOUT a call",
      "- what SHOULD happen when the network fails",
      "- what SHOULD happen when JSON has no \"rates\"",
      "- what SHOULD happen for USD -> USD",
      "",
      "For the last three, tell me what the current",
      "code does and whether that is good for callers.",
    ] },
    points: [
      ["Mocks = control", "A fake response every time: no internet, no cost, no changing rates.", C.purple],
      ["Test the unhappy paths", "No network, odd JSON, HTTP 422: mocks make them one line each.", C.coral],
      ["\"What SHOULD happen\"", "Makes the AI think about behaviour, not just describe the code.", C.navy],
      ["assert_not_called()", "Proves that invalid input never reaches the API.", C.teal],
    ],
  });
  await d.demoRun({
    demo: "D2", name: "Mock an External API",
    steps: [
      "Run it live once: `python …/exchange.py`",
      "Run the tests on the starter: **3 failed**",
      "Ask the AI to raise `RateUnavailableError` and skip same-currency calls",
      "Run again: **7 passed**, in milliseconds",
      "Unplug the network: still green",
    ],
    panel: { caption: "Mock fixture + one failure test", fontSize: 9, lines: [
      "@pytest.fixture",
      "def mock_urlopen():",
      "    with patch.object(exchange.urllib.request,",
      "                      'urlopen') as m:",
      "        m.return_value = fake_response(",
      "            {'rates': {'INR': 83.25}})",
      "        yield m",
      "",
      "def test_network_failure_raises_rate_un…(",
      "        mock_urlopen):",
      "    mock_urlopen.side_effect = URLError('x')",
      "    with pytest.raises(RateUnavailableError):",
      "        get_rate('USD', 'INR')",
    ] },
    check: "Callers now get one clear `RateUnavailableError` instead of raw network exceptions, and the whole suite runs offline in under a second.",
  });

  // ---------- D3 ----------
  await d.demoOverview({
    demo: "D3", name: "Integration + Coverage", folder: "Module-3-Lab/demo3_integration",
    flow: [
      ["FaDatabase", "SQLite :memory:", "Fresh DB per test", C.teal],
      ["FaRobot", "Round 1 tests", "Happy path", C.purple],
      ["FaChartPie", "Coverage", "83%, raises missed", C.coral],
      ["FaRobot", "Round 2 tests", "From the report", C.purple],
      ["FaBug", "2 bugs found", "Then 100%", C.teal],
    ],
    goal: "Test an enrollment service and its SQLite repository **together**. The first AI tests cover only the happy path. The coverage report shows every `raise` was skipped, and the tests written to close the gap find two real bugs.",
    learn: ["Fixtures that build a fresh in-memory DB", "Coverage reports with missing lines", "Turning \"missing lines\" into scenarios", "Why 83% can hide every error rule"],
  });
  await d.demoPrompt({
    demo: "D3", name: "Integration + Coverage",
    panel: { caption: "Prompt 1, then prompt 2 with the coverage report", fontSize: 9, lines: [
      "Write pytest integration tests for",
      "EnrollmentService in enrollment.py. Use a",
      "fixture that creates a fresh sqlite3 \":memory:\"",
      "connection, an EnrollmentRepository, and two",
      "courses: PY101 (capacity 2), AI201 (capacity 30).",
      "Check results via the service AND the database.",
      "",
      "# --- after running coverage ---",
      "Lines 58, 60, 62 and 68 are never executed.",
      "For each one, write a test that reaches it and",
      "say which business rule it checks. Expected",
      "behaviour from the RULE (\"a course with",
      "capacity 2 takes exactly 2 students\").",
    ] },
    points: [
      ["Real DB, no shared state", "`:memory:` is fast and a new database per test means no leftovers.", C.teal],
      ["Coverage as a to-do list", "Missing lines turn directly into missing scenarios.", C.coral],
      ["Rules, not code", "Again the key phrase: expected values come from the business rule.", C.purple],
      ["Branch coverage", "`--cov-branch` also checks that both sides of each `if` ran.", C.navy],
    ],
  });
  await d.demoRun({
    demo: "D3", name: "Integration + Coverage",
    steps: [
      "Round 1: run only the `happy` tests with coverage",
      "Read `Missing`: lines 58, 60, 62, 68, all `raise`",
      "Send prompt 2 with the report",
      "Run all tests on the starter: **2 failed**",
      "Fix both bugs; coverage → 100%",
    ],
    panel: { caption: "Coverage, before and after", fontSize: 9, lines: [
      "# round 1 (happy path only)",
      "Name           Stmts Miss Branch BrPart Cover",
      "enrollment.py     40    4      8      4   83%",
      "Missing: 58, 60, 62, 68",
      "",
      "# round 2 finds:",
      "FAILED test_full_course_rejects_the_next_…",
      "   count > capacity: 3rd student let in",
      "FAILED test_seats_left_for_unknown_course…",
      "   TypeError: 'NoneType' not subscriptable",
      "",
      "# after the fixes",
      "enrollment.py     42    0     10      0  100%",
    ] },
    check: "Coverage showed what was never tested. The new tests showed what was actually wrong. Coverage alone cannot tell you whether an assertion is right.",
  });

  await d.troubleshoot({
    items: [
      ["Tests pass but the code is buggy", "The AI derived expectations from the code. Regenerate \"from the requirement\"."],
      ["A generated test fails", "Don't edit it to pass. Ask: \"test or code wrong, given the requirement?\""],
      ["Tests are slow or flaky", "A real network or shared state. Mock external calls; use a fresh DB per test."],
      ["`patch` has no effect", "Patch where the name is **looked up** (`exchange.urllib.request`), not where it's defined."],
      ["Coverage shows 0% / no data", "Use `--cov=<module name>` and run from the lab folder."],
      ["Too many near-identical tests", "Ask the AI to merge them with `@pytest.mark.parametrize`."],
    ],
  });
  await d.challenge({
    items: [
      { level: "LAB 1", head: "Generate unit tests", text: "Pick a small module of your own (or Module 1's `bonus.py`). Get scenarios, then tests. Run them and judge every failure.", hint: "Keep the scenario list in the test file's docstring." },
      { level: "LAB 2", head: "Test & debug", text: "Put a subtle bug into D3's solution (e.g. drop() always succeeds). Do the tests catch it? If not, add the missing test.", hint: "This is mutation testing, done by hand." },
      { level: "LAB 3", head: "Coverage & review", text: "Ask the AI to review `test_enrollment.py` for weak assertions and duplicates, then check the coverage of the D2 solution.", hint: "`--cov=exchange --cov-branch`" },
    ],
  });
  await d.summary({
    built: [
      ["D1", "Unit Tests Find a Bug", "Scenarios → pytest → boundary bug at 100%"],
      ["D2", "Mock an External API", "Fake urlopen; test the failure paths offline"],
      ["D3", "Integration + Coverage", "In-memory DB; coverage gaps → 2 bugs"],
    ],
    takeaways: [
      "Scenarios first, then test code",
      "Expectations come from the requirement",
      "Mock what you don't control",
      "Coverage finds gaps, not correctness",
    ],
    next: "Module 4: AI-Assisted Documentation & Project Management",
  });

  await d.save(out);
};
