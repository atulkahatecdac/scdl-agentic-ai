// Module 1: AI-Assisted Code Generation & Prompt Engineering
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(1, "AI-Assisted Code Generation & Prompt Engineering");

  await d.titleSlide({
    title: "AI-Assisted Code Generation & Prompt Engineering",
    subtitle: "Write prompts that produce correct, reviewable code: functions, classes and whole components.",
    flow: [
      ["FaCommentDots", "Describe", "Task, context, constraints", C.coral],
      ["FaRobot", "Generate", "The AI writes a draft", C.purple],
      ["FaSearch", "Review", "You read every line", C.navy],
      ["FaVial", "Test", "Tests decide if it's right", C.teal],
    ],
    notes: "The course in one picture: the AI drafts, the developer stays in charge. Today is about the first step: describing the task so well that the draft is close to right.",
  });

  await d.goalsAgenda({
    sub: "3 live demos, each with code you can rerun",
    goals: [
      ["FaPencilAlt", "Write structured prompts that produce accurate code"],
      ["FaCubes", "Generate functions, classes and components"],
      ["FaFolderOpen", "Give the AI the right project context"],
      ["FaCheckDouble", "Review and test everything the AI generates"],
    ],
    agenda: [
      "Welcome & objectives",
      "Core concepts",
      "Setup: assistant + lab folder",
      "D1  Weak vs Strong Prompt",
      "D2  Generate a Class",
      "D3  Component with Context",
      "Lab, pitfalls & Q&A",
    ],
  });

  await d.cards3({
    title: "AI Coding Assistants",
    sub: "They generate, explain, refactor and document code from plain English",
    cards: [
      { icon: "FaCode", color: C.purple, head: "What they write", body: ["Functions, classes, API endpoints, DB queries", "Tests, docstrings, README sections", "Explanations of code you didn't write"] },
      { icon: "FaPlug", color: C.navy, head: "Where they live", body: ["**In the IDE:** GitHub Copilot, Windsurf: autocomplete + chat with your files", "**In the browser:** ChatGPT, Claude: paste code in, copy code out"] },
      { icon: "FaUserCheck", color: C.teal, head: "Who's in charge", body: ["**You are.** AI output is a draft, not a decision.", "It writes code that *looks* right. Only review and tests show that it *is* right."] },
    ],
    below: [
      "**Rule for this course:** never commit code you cannot explain line by line.",
      "Every demo ends with the same proof: `pytest` passing against the requirement.",
    ],
  });

  await d.flowBlocks({
    title: "The AI Coding Loop",
    sub: "Repeat until the tests pass and you understand every line",
    blocks: [
      { icon: "FaCommentDots", color: C.coral, name: "Describe", what: "Write the prompt", k1: "YOU GIVE", v1: "Task, context, rules", k2: "WATCH FOR", v2: "Vague goals, missing rules" },
      { icon: "FaRobot", color: C.purple, name: "Generate", what: "AI drafts code", k1: "YOU GET", v1: "A plausible draft", k2: "WATCH FOR", v2: "Invented APIs, old libraries" },
      { icon: "FaSearch", color: C.navy, name: "Review", what: "Read every line", k1: "YOU CHECK", v1: "Logic, names, errors", k2: "WATCH FOR", v2: "Silent assumptions" },
      { icon: "FaVial", color: C.teal, name: "Test", what: "Run the tests", k1: "YOU PROVE", v1: "Normal + edge cases", k2: "WATCH FOR", v2: "Tests that copy the code" },
      { icon: "FaRedo", color: C.coral, name: "Refine", what: "Fix and repeat", k1: "YOU SEND", v1: "Failure + expectation", k2: "WATCH FOR", v2: "Fixes that break more" },
    ],
    notes: "Each of today's demos goes round this loop at least once. D1 shows what happens when the Describe step is weak.",
  });

  await d.iconRows({
    title: "Anatomy of a Good Coding Prompt",
    sub: "Five parts: the more you specify, the less the AI has to guess",
    rows: [
      { icon: "FaBullseye", color: C.coral, head: "Task", text: "What to build: one function, class or component" },
      { icon: "FaFolderOpen", head: "Context", text: "Language, version, where it is used, existing code" },
      { icon: "FaExchangeAlt", color: C.teal, head: "Inputs / outputs", text: "Names, types, return value, error cases" },
      { icon: "FaRuler", color: C.purple, head: "Constraints", text: "Rules, libraries allowed, style, what must not change" },
      { icon: "FaClipboardList", head: "Examples", text: "Two or three input → output pairs" },
    ],
    panel: { caption: "Example: one prompt, five parts", fontSize: 9, lines: [
      "# Task",
      "Write is_strong_password(pw) in Python.",
      "# Context",
      "Signup form of a Flask app, Python 3.12.",
      "# Inputs / outputs",
      "pw: str -> bool",
      "# Constraints",
      ">= 10 chars, 1 digit, 1 upper, 1 symbol.",
      "No external libraries. Add a docstring.",
      "# Examples",
      "'Pune@2026x' -> True",
      "'password'   -> False",
    ] },
  });

  await d.tableSlide({
    title: "Prompt Patterns for Everyday Coding",
    sub: "The same five parts, applied to different jobs",
    head: ["Pattern", "Start the prompt with…", "Demo"],
    rows: [
      ["Function spec", "\"Implement f(a, b) that… Inputs… Rules… Examples…\"", "D1"],
      ["Class spec", "\"Generate class X. Responsibility… Attributes… Methods…\"", "D2"],
      ["Component + context", "\"Using ONLY the attached code, implement…\"", "D3"],
      ["Explain first", "\"Explain what this does and list anything ambiguous\"", "D2"],
      ["Small steps", "\"Generate only the repository layer; we'll do the API next\"", "Lab"],
      ["Refine with evidence", "\"This test fails: <output>. Is the test or the code wrong?\"", "D1"],
    ],
    colW: [2.1, 5.7, 1.2],
    fontSize: 12,
    belowY: 3.95,
    below: ["**Break large tasks into small prompts:** each piece is easier to review, test and fix."],
  });

  await d.grid4({
    title: "Using AI-Generated Code Responsibly",
    sub: "Four habits that keep you out of trouble",
    cells: [
      { icon: "FaExclamationTriangle", color: C.coral, head: "Expect plausible mistakes", text: "Models learned from code full of outdated patterns. Watch for invented functions, deprecated APIs and missed edge cases." },
      { icon: "FaPuzzlePiece", color: C.navy, head: "Small, reviewable pieces", text: "Generate one function or class at a time. Review it, test it, then wire it in." },
      { icon: "FaUserShield", color: C.purple, head: "Protect what you paste", text: "No passwords, API keys, customer data or confidential code in prompts. Use your organisation's approved tools." },
      { icon: "FaBalanceScale", color: C.teal, head: "Check dependencies & licences", text: "If the AI adds a package, check it exists, is maintained and its licence allows your use." },
    ],
  });

  await d.stepsCode({
    title: "Setup: Assistant + Lab Folder",
    sub: "Once per machine; every demo then runs offline",
    steps: [
      "Install **Python 3.10+** (tick *Add to PATH*) and **VS Code**",
      "Add an AI assistant: **Copilot Chat** or **Windsurf**, or use ChatGPT / Claude in a browser",
      "Open the `Module-1-Lab` folder in VS Code",
      "Create a venv and install pytest (commands at right)",
      "`pytest` → the reference solutions all pass",
      "`--target starter` → the starters fail: that's our \"before\"",
    ],
    panel: { caption: "PowerShell, in Module-1-Lab", fontSize: 9.5, lines: [
      "python -m venv .venv",
      ".\\.venv\\Scripts\\Activate.ps1",
      "pip install -r requirements.txt",
      "",
      "pytest",
      "  40 passed",
      "",
      "pytest --target starter",
      "  30 failed, 10 errors",
      "",
      "# each demo folder:",
      "#   PROMPT.md   starter/   solution/",
      "#   test_*.py",
    ] },
    notes: "starter/ is what you give the AI, solution/ is a reviewed reference answer, and the tests encode the requirement. If the live AI answer goes off track, open the solution file.",
  });

  // ---------- D1 ----------
  await d.demoOverview({
    demo: "D1", name: "Weak vs Strong Prompt", folder: "Module-1-Lab/demo1_bonus",
    flow: [
      ["FaFileCode", "bonus.py", "Empty function", C.navy],
      ["FaCommentSlash", "Weak prompt", "One line", C.coral],
      ["FaTimesCircle", "pytest", "Most tests fail", C.coral],
      ["FaCommentDots", "Strong prompt", "Five parts", C.purple],
      ["FaCheckCircle", "pytest", "13 passed", C.teal],
    ],
    goal: "Generate `calculate_bonus(salary, rating)` for an HR portal twice: first from \"Write a bonus function\", then from a five-part prompt. The same 13 tests judge both answers.",
    learn: ["What the AI guesses when you don't say", "Turning requirements into a prompt", "Tests written from the spec, not the code", "Refining with a failing test"],
  });
  await d.demoPrompt({
    demo: "D1", name: "Weak vs Strong Prompt",
    panel: { caption: "Strong prompt (PROMPT.md, step 2)", fontSize: 9, lines: [
      "Task: Implement calculate_bonus(salary, rating).",
      "Context: HR portal, Python 3.12, no libraries.",
      "Inputs:",
      "- salary: int or float, rupees, must be > 0",
      "- rating: outstanding | exceeds | meets | below",
      "  (ignore case and surrounding spaces)",
      "Output: bonus as float, rounded to 2 decimals.",
      "Rules:",
      "- 20% / 10% / 5% / 0%; capped at 200,000",
      "- TypeError if salary is not a number (or bool)",
      "- ValueError if salary <= 0 or rating unknown;",
      "  the message lists the valid ratings",
      "Examples:",
      "- (600000, 'exceeds')      -> 60000.0",
      "- (5000000, 'outstanding') -> 200000.0",
      "Type hints, a docstring, rates in a dict.",
    ] },
    points: [
      ["Weak prompt first", "\"Write a bonus function in Python.\" Ask the class to list everything the AI had to guess.", C.coral],
      ["Rules remove guesses", "Percentages, cap, rounding and errors are business decisions. Only you know them."],
      ["Examples pin it down", "Two concrete pairs fix the format and the cap.", C.purple],
      ["Style is a constraint", "\"Rates in a dict\" makes the code easy to change later.", C.navy],
    ],
    notes: "Run the weak prompt live and paste its answer into starter/bonus.py. Typically it uses different rating names, no cap and no validation, so most tests fail. The code isn't wrong; the prompt was missing the requirements.",
  });
  await d.demoRun({
    demo: "D1", name: "Weak vs Strong Prompt",
    steps: [
      "Paste the weak prompt's answer into `starter/bonus.py`",
      "`pytest demo1_bonus --target starter`: most tests fail",
      "Undo; send the strong prompt",
      "Read every line before accepting it",
      "Run the tests again: **13 passed**",
    ],
    panel: { caption: "Terminal", fontSize: 9.5, lines: [
      "# weak prompt",
      "> pytest demo1_bonus --target starter",
      "FAILED test_bonus_for_each_rating[...]",
      "FAILED test_bonus_is_capped",
      "FAILED test_unknown_rating_lists_valid_...",
      "  ...",
      "",
      "# strong prompt",
      "> pytest demo1_bonus --target starter",
      "13 passed in 0.07s",
      "",
      "> python demo1_bonus/solution/bonus.py",
      "outstanding   150,000.00",
      "exceeds        75,000.00",
    ] },
    check: "The weak and strong answers come from the same AI. Only the prompt differs, and only one of them meets the requirement.",
  });

  // ---------- D2 ----------
  await d.demoOverview({
    demo: "D2", name: "Generate a Class", folder: "Module-1-Lab/demo2_product",
    flow: [
      ["FaDraftingCompass", "Design", "Job, data, methods", C.navy],
      ["FaCommentDots", "Class prompt", "Spec + validation", C.purple],
      ["FaRobot", "Product class", "Generated", C.purple],
      ["FaQuestionCircle", "Explain", "Choices + gaps", C.coral],
      ["FaCheckCircle", "pytest", "16 passed", C.teal],
    ],
    goal: "Design a `Product` class for a shop inventory on the whiteboard (one job, four attributes, four methods), turn that design into a prompt, then ask the AI to **explain its choices** before running the tests.",
    learn: ["Single-responsibility classes", "Specifying validation precisely", "Asking the AI to name ambiguities", "Tests that check what you asked for"],
  });
  await d.demoPrompt({
    demo: "D2", name: "Generate a Class",
    panel: { caption: "Class prompt", fontSize: 9, lines: [
      "Generate a Python 3.12 class Product for a shop",
      "inventory.",
      "Responsibility: one product's price and stock,",
      "always valid. Not orders, customers or storage.",
      "Attributes: product_id, name (non-empty str),",
      "  price (>= 0, float), quantity (int >= 0, def 0)",
      "Methods:",
      "  update_price(new_price)",
      "  add_stock(qty)     qty positive int",
      "  remove_stock(qty)  ValueError if qty > quantity,",
      "                     quantity unchanged",
      "  total_value()      price*quantity, 2 decimals",
      "  __repr__  Product('P-100', 'Gel pen', ...)",
      "TypeError for wrong types (reject bool),",
      "ValueError for wrong values. Validation in",
      "private helpers. Docstrings. No libraries.",
    ] },
    points: [
      ["Responsibility first", "Saying what the class must *not* do stops it from growing into a god class.", C.navy],
      ["Validation, precisely", "Which errors, for which inputs, and what state remains after a failed call."],
      ["Then: explain it", "\"Explain your design choices. Is anything in my spec ambiguous?\"", C.coral],
      ["Typical answer", "\"Should quantity=0 be allowed in the constructor but not in add_stock?\" A real question.", C.purple],
    ],
    tip: "Asking the AI to **explain** before you accept code catches misunderstandings while they are still cheap.",
  });
  await d.demoRun({
    demo: "D2", name: "Generate a Class",
    steps: [
      "Paste the generated class into `starter/product.py`",
      "Ask for the explanation; agree the ambiguities",
      "`pytest demo2_product --target starter`",
      "Any failure: test or code? Check the **spec**",
      "Compare with `solution/product.py`",
    ],
    panel: { caption: "Tests written from the spec", fontSize: 9.5, lines: [
      "def test_cannot_remove_more_than_in_stock(pen):",
      "    with pytest.raises(ValueError):",
      "        pen.remove_stock(41)",
      "    assert pen.quantity == 40  # unchanged",
      "",
      "@pytest.mark.parametrize('bad', ['10', None,",
      "                                 True])",
      "def test_non_numeric_price_is_rejected(bad):",
      "    with pytest.raises(TypeError):",
      "        Product('P-3', 'Stapler', bad)",
      "",
      "> pytest demo2_product --target starter",
      "16 passed in 0.07s",
    ] },
    check: "The tests were written from the class prompt before the AI wrote any code, so they check what we asked for, not what the AI happened to produce.",
  });

  // ---------- D3 ----------
  await d.demoOverview({
    demo: "D3", name: "Component with Context", folder: "Module-1-Lab/demo3_orders",
    flow: [
      ["FaDatabase", "inventory_repo.py", "Existing code", C.teal],
      ["FaCommentSlash", "No context", "Invents its own", C.coral],
      ["FaPaperclip", "Attach files", "#file / @file", C.navy],
      ["FaRobot", "OrderService", "Reuses repo", C.purple],
      ["FaCheckCircle", "pytest", "11 passed", C.teal],
    ],
    goal: "Build `OrderService.place_order()` on top of an **existing** repository, exception class and `money()` helper. Without context the AI invents its own; with the files attached it reuses ours.",
    learn: ["Why context beats clever wording", "Attaching files in Copilot / Windsurf", "\"Use ONLY the existing code\"", "Reviewing generated code against the codebase"],
  });
  await d.demoPrompt({
    demo: "D3", name: "Component with Context",
    panel: { caption: "With inventory_repo.py + order_service.py attached", fontSize: 9, lines: [
      "Implement OrderService.place_order(items).",
      "Use ONLY the existing code in inventory_repo.py",
      "- do not change that file.",
      "",
      "- items: list of (sku, qty); repeated SKUs combined",
      "- bad qty, empty order, unknown SKU -> ValueError",
      "- not enough stock -> the existing OutOfStockError",
      "- all-or-nothing: validate every line first",
      "- reduce stock with repo.update_stock",
      "- money: Decimal via money()",
      "- GST is 18% of the subtotal",
      "",
      "Return {lines, subtotal, gst, total}.",
      "Docstring. No new dependencies.",
    ] },
    points: [
      ["Without context", "It invents `Product`, uses `float` for money and raises a generic `Exception`. It looks fine but doesn't fit.", C.coral],
      ["Name the existing pieces", "`OutOfStockError`, `money()`, `update_stock`: say *use these*."],
      ["Say what must not change", "\"Do not change inventory_repo.py\" protects existing code.", C.navy],
      ["Business rule: all-or-nothing", "Without this line, a failed order can still reduce stock.", C.purple],
    ],
    tip: "Give only the code that matters: the files it must use, not the whole repository. Too much context is noise.",
  });
  await d.demoRun({
    demo: "D3", name: "Component with Context",
    steps: [
      "Fresh chat, no files: show the invented design",
      "Attach both files; send the prompt",
      "Review: real repo methods? `money()` everywhere?",
      "`pytest demo3_orders --target starter`",
      "Discuss: `test_order_is_all_or_nothing`",
    ],
    panel: { caption: "Result for 2 notebooks + 3 pens", fontSize: 9.5, lines: [
      ">>> svc.place_order([('NB-A5', 2),",
      "...                  ('PEN-BL', 3)])",
      "{'lines': [...],",
      " 'subtotal': Decimal('127.50'),",
      " 'gst':      Decimal('22.95'),",
      " 'total':    Decimal('150.45')}",
      "",
      ">>> svc.place_order([('PEN-BL', 99)])",
      "OutOfStockError: PEN-BL: requested 99,",
      "                 only 3 in stock",
      "",
      "> pytest demo3_orders --target starter",
      "11 passed in 0.08s",
    ] },
    check: "The component fits the project: it uses the existing repository, exception and money convention, and never changes stock for a failed order.",
  });

  await d.troubleshoot({
    items: [
      ["The AI ignores part of the prompt", "Put rules in a numbered list, one rule per line. Long paragraphs get skimmed."],
      ["It invents functions or packages", "Attach the real code and say \"use ONLY the existing code\". Check that imports exist."],
      ["Code works, but tests fail", "Paste the failure and ask: \"Is the test or the code wrong, given my rules?\""],
      ["Different answer every time", "Normal for chat models. Fix the requirement in the prompt and let tests decide."],
      ["Answer is huge and hard to review", "Ask for one function or class at a time; \"show only the changed function\"."],
      ["Copilot doesn't see my file", "Open it in an editor tab, or attach it with `#file` (Copilot) / `@file` (Windsurf)."],
    ],
  });
  await d.challenge({
    items: [
      { level: "LAB 1", head: "Generate a function", text: "Pick a small business rule (GST invoice total, EMI, grade calculator). Write a five-part prompt, generate it, test normal and edge cases.", hint: "Write 5 tests from your prompt **before** you look at the AI's code." },
      { level: "LAB 2", head: "Generate a class", text: "Design a class (BankAccount, LibraryBook…) on paper, prompt for it, ask the AI to explain its choices, then add validation tests.", hint: "Copy the shape of `demo2_product/PROMPT.md`." },
      { level: "LAB 3", head: "Component + review", text: "Add `cancel_order()` to D3's OrderService that restores stock. Then ask the AI to review your code for bugs and complexity.", hint: "Attach `inventory_repo.py` again; the tests in D3 must still pass." },
    ],
  });
  await d.summary({
    built: [
      ["D1", "Weak vs Strong Prompt", "Same AI, two prompts: 13 tests decide"],
      ["D2", "Generate a Class", "Design first, then prompt, explain, test"],
      ["D3", "Component with Context", "Attach existing code; the AI reuses it"],
    ],
    takeaways: [
      "Task, context, I/O, constraints, examples",
      "Context beats clever wording",
      "Small pieces, each reviewed and tested",
      "Never commit code you can't explain",
    ],
    next: "Module 2: AI-Assisted Debugging, Refactoring & Optimization",
  });

  await d.save(out);
};
