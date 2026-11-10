// Module 4: AI-Assisted Documentation & Project Management
const { Deck, C } = require("./lib");

module.exports = async function build(out) {
  const d = new Deck(4, "AI-Assisted Documentation & Project Management");

  await d.titleSlide({
    title: "AI-Assisted Documentation & Project Management",
    subtitle: "Generate docs, user stories and status reports with AI, then check them against the facts.",
    flow: [
      ["FaFileAlt", "Documentation", "Docstrings, README, API docs", C.teal],
      ["FaUsers", "Requirements", "Stories + acceptance criteria", C.purple],
      ["FaTasks", "Planning", "Tasks, risks, status", C.navy],
      ["FaCheckDouble", "Verification", "Checked against sources", C.coral],
    ],
    notes: "AI is excellent at first drafts of documents. The theme of this module: a document is only useful if it is true, so every demo ends with a check against the source.",
  });

  await d.goalsAgenda({
    sub: "3 live demos: docs, requirements, reporting",
    goals: [
      ["FaFileAlt", "Generate documentation that stays true to the code"],
      ["FaUsers", "Turn a business brief into stories and criteria"],
      ["FaProjectDiagram", "Break stories into tasks with dependencies"],
      ["FaClipboardCheck", "Write status reports without invented facts"],
    ],
    agenda: [
      "Welcome & objectives",
      "Core concepts",
      "Setup: Module-4-Lab",
      "D1  Docs That Are Tested",
      "D2  Brief → Stories → Tests",
      "D3  Fact-Checked Status Report",
      "Lab, pitfalls & Q&A",
    ],
  });

  await d.tableSlide({
    title: "Documentation AI Can Draft",
    sub: "Each type has a reader; write the prompt for that reader",
    head: ["Document", "Reader", "Give the AI…", "Demo"],
    rows: [
      ["Docstrings", "Developers using a function", "The code + non-obvious rules", "D1"],
      ["README", "New developer, day one", "Code, setup steps, sections wanted", "D1"],
      ["API docs", "Client developers", "Routes, params, sample responses", "Lab"],
      ["Design / technical doc", "Team, reviewers", "Components, data flow, decisions", "Lab"],
      ["Requirements / stories", "Product owner, testers", "Business brief, constraints", "D2"],
      ["Status report", "Manager, stakeholders", "Board, commits, meeting notes", "D3"],
    ],
    colW: [2.1, 2.4, 3.4, 1.1],
    fontSize: 12,
    belowY: 3.85,
    below: ["**Update docs with the code:** \"Here is the old README and the diff. Which sections are now out of date?\""],
  });

  await d.flowBlocks({
    title: "The AI Documentation Workflow",
    sub: "Draft fast, verify carefully, keep it in sync",
    blocks: [
      { icon: "FaFolderOpen", color: C.teal, name: "Collect", what: "Gather sources", k1: "SOURCES", v1: "Code, notes, specs", k2: "WATCH FOR", v2: "Stale inputs" },
      { icon: "FaQuestionCircle", color: C.navy, name: "Explain", what: "AI explains first", k1: "YOU CHECK", v1: "Did it get the rules?", k2: "WATCH FOR", v2: "Misread logic" },
      { icon: "FaPen", color: C.purple, name: "Draft", what: "Generate the doc", k1: "YOU SET", v1: "Sections, audience", k2: "WATCH FOR", v2: "Invented features" },
      { icon: "FaCheckDouble", color: C.coral, name: "Verify", what: "Check vs sources", k1: "YOU RUN", v1: "Doctests, checklists", k2: "WATCH FOR", v2: "Off-by-one facts" },
      { icon: "FaSyncAlt", color: C.navy, name: "Sync", what: "Docs in the same PR", k1: "YOU KEEP", v1: "Docs next to code", k2: "WATCH FOR", v2: "Docs drift" },
    ],
  });

  await d.iconRows({
    title: "From Requirements to Work Items",
    sub: "AI turns vague text into structured, testable artifacts",
    rows: [
      { icon: "FaUser", color: C.purple, head: "User story", text: "As a <role>, I want <goal>, so that <benefit>" },
      { icon: "FaCheckSquare", color: C.teal, head: "Acceptance criteria", text: "Given / When / Then, with concrete numbers, each with an ID" },
      { icon: "FaQuestion", color: C.coral, head: "Open questions", text: "Ambiguities to ask the stakeholder, never answers to invent" },
      { icon: "FaTasks", head: "Tasks", text: "Dev, test, docs and deploy work, with dependencies" },
      { icon: "FaRoute", head: "Phases & order", text: "AI proposes; the team decides priorities and estimates" },
    ],
    panel: { caption: "One story, one criterion", fontSize: 9.5, lines: [
      "US-1 Borrow a book online",
      "As a student, I want to borrow",
      "a book through the portal, so",
      "that I don't queue at the desk.",
      "",
      "AC-3 Given I already hold 3",
      "  books, when I try to borrow",
      "  another, then I am refused",
      "  with a message about the",
      "  limit.",
      "",
      "# -> test_ac3_fourth_book_...",
    ] },
  });

  await d.grid4({
    title: "AI in Project Management: Limits",
    sub: "Useful drafts, but the team owns every decision",
    cells: [
      { icon: "FaCalendarAlt", color: C.coral, head: "Unrealistic estimates", text: "AI doesn't know your team, codebase or holidays. Treat its numbers as a starting point, never a commitment." },
      { icon: "FaLink", color: C.navy, head: "Missing dependencies", text: "Check the order: tests after code, deploy after review, external teams on the critical path." },
      { icon: "FaUserSecret", color: C.purple, head: "Invented facts & owners", text: "Summaries can assign work to people who never agreed. Unknown owner → **TBD**." },
      { icon: "FaLock", color: C.teal, head: "Confidentiality", text: "Client names, contracts and HR details stay out of public AI tools. Keep one authoritative source of decisions." },
    ],
  });

  await d.stepsCode({
    title: "Setup: Module-4-Lab",
    sub: "Even documents get tests in this module",
    steps: [
      "Open `Module-4-Lab`; create the venv; install requirements",
      "`pytest` → the reference docs, stories and report pass",
      "`--target starter` → undocumented code, no stories, an empty report",
      "Inputs for D2 and D3 are in `brief.md` and `inputs/`",
      "Use a chat that accepts file attachments for D3",
    ],
    panel: { caption: "PowerShell, in Module-4-Lab", fontSize: 9.5, lines: [
      "pytest",
      "  22 passed",
      "pytest --target starter",
      "  17 failed, 5 passed",
      "",
      "# what the tests check",
      "# D1 every >>> example runs",
      "# D2 every AC-n has a test",
      "# D3 report facts match",
      "#    board.csv + notes",
    ] },
  });

  // ---------- D1 ----------
  await d.demoOverview({
    demo: "D1", name: "Docs That Are Tested", folder: "Module-4-Lab/demo1_docs",
    flow: [
      ["FaFileCode", "shipping.py", "No docs at all", C.navy],
      ["FaQuestionCircle", "Explain", "Catch misreadings", C.coral],
      ["FaPen", "Docstrings", "Args, Returns, >>>", C.purple],
      ["FaBook", "README", "Usage + limits", C.purple],
      ["FaCheckCircle", "doctest", "7 passed", C.teal],
    ],
    goal: "Document a shipping module with two easy-to-miss rules: weight is rounded **up** to 0.5 kg, and only **Sundays** are skipped. Every `>>>` example in the docstrings and README runs as a test.",
    learn: ["Explain-first to catch misunderstandings", "Google-style docstrings with examples", "A README with the sections people need", "doctest: documentation that can't lie"],
  });
  await d.demoPrompt({
    demo: "D1", name: "Docs That Are Tested",
    panel: { caption: "Prompts 1-3 (PROMPT.md)", fontSize: 9, lines: [
      "Explain what each function in shipping.py does:",
      "purpose, inputs, outputs, errors raised and any",
      "non-obvious rule. List anything you are unsure",
      "about. Do not write documentation yet.",
      "",
      "Add Google-style docstrings to every function",
      "and a module docstring: Args, Returns, Raises",
      "and Examples in doctest format (>>> lines with",
      "the exact output). Do not change any code.",
      "",
      "Write README.md: description, Features,",
      "Requirements, Usage (>>> examples), a rates",
      "table, Limitations, Running the tests.",
      "Use only facts from the code.",
    ] },
    points: [
      ["Explain first", "Did it notice the round-up and the Sunday-only rule? Correct it before it writes docs.", C.coral],
      ["Examples in doctest form", "They show usage and double as tests.", C.purple],
      ["\"Do not change any code\"", "Documentation tasks shouldn't touch behaviour.", C.navy],
      ["Limitations section", "Says what the code does *not* do: holidays, real PIN lookup.", C.teal],
    ],
  });
  await d.demoRun({
    demo: "D1", name: "Docs That Are Tested",
    steps: [
      "On the starter: **7 failed** (no docs at all)",
      "Send the three prompts; paste the results",
      "Run the tests: the doctest examples run",
      "A wrong example fails: fix the **doc**, not the code",
      "Read the README as a newcomer would",
    ],
    panel: { caption: "Caught while building this demo", fontSize: 9.5, lines: [
      "Failed example:",
      "  delivery_date(date(2026, 11, 13),",
      "                \"regional\")",
      "  # Fri -> Wed (Sun skipped)",
      "Expected:",
      "  datetime.date(2026, 11, 18)",
      "Got:",
      "  datetime.date(2026, 11, 17)",
      "",
      "# Fri + 3 working days = Sat, Mon, Tue",
      "> pytest demo1_docs --target starter",
      "7 passed",
    ] },
    check: "A plausible-looking example was off by one day, and doctest caught it straight away. Examples that run are the only kind you can trust.",
  });

  // ---------- D2 ----------
  await d.demoOverview({
    demo: "D2", name: "Brief → Stories → Tests", folder: "Module-4-Lab/demo2_stories",
    flow: [
      ["FaEnvelopeOpenText", "brief.md", "Librarian's note", C.navy],
      ["FaUsers", "Stories + AC", "AC-1 … AC-6", C.purple],
      ["FaTasks", "Backlog", "Tasks, deps, risks", C.purple],
      ["FaVial", "AC → tests", "test_ac3_…", C.coral],
      ["FaCheckCircle", "Gaps fixed", "8 passed", C.teal],
    ],
    goal: "Turn an informal note from the Head Librarian into user stories with numbered acceptance criteria and a backlog. Then turn each criterion into a test and run it against code a developer wrote from a hallway chat.",
    learn: ["Story + Given/When/Then format", "AI's open questions: the most valuable part", "Traceability: every AC has a test", "Requirements gaps found before release"],
  });
  await d.demoPrompt({
    demo: "D2", name: "Brief → Stories → Tests",
    panel: { caption: "Stories prompt", fontSize: 9, lines: [
      "Turn this business brief into user stories.",
      "Format: \"As a <role>, I want <goal>, so that",
      "<benefit>\". Give every story acceptance",
      "criteria in Given / When / Then form, numbered",
      "AC-1, AC-2, ... across all stories, with",
      "concrete numbers. Put anything the brief marks",
      "as \"later\" under Out of scope.",
      "Finally, list the questions you would ask the",
      "librarian - things the brief leaves ambiguous.",
      "Do not invent answers to them.",
      "",
      "# then",
      "Write one pytest test per acceptance criterion;",
      "name each test test_ac<number>_<what it checks>.",
    ] },
    points: [
      ["Delete invented details", "\"Email notifications\", \"max 2 renewals\": not in the brief, so cut them.", C.coral],
      ["Questions > answers", "\"Is the Rs 100 cap per book or per student?\" A real ambiguity.", C.purple],
      ["Out of scope", "\"Reminders, maybe later\" goes in the backlog, not this release."],
      ["Estimates are the team's", "AI's backlog is a draft; `solution/tasks.md` shows the reviewed one.", C.navy],
    ],
  });
  await d.demoRun({
    demo: "D2", name: "Brief → Stories → Tests",
    steps: [
      "Generate the stories; review them; save `stories.md`",
      "Generate the backlog (`tasks.md`)",
      "Generate the AC tests; run `--target starter`",
      "Two criteria fail: the code never had them",
      "Ask the AI to implement AC-3 and AC-5 only",
    ],
    panel: { caption: "Terminal", fontSize: 9.5, lines: [
      "> pytest demo2_stories --target starter",
      "FAILED test_ac3_fourth_book_is_refused",
      "FAILED test_ac5_late_fine_is_capped_at_100",
      "FAILED test_every_criterion_has_a_test",
      "  no stories.md yet",
      "3 failed, 5 passed",
      "",
      "# after stories.md + the AC-3/AC-5 fix",
      "8 passed",
    ] },
    check: "Writing the stories made the requirements explicit, and the tests made the gaps visible, before any student was over-charged.",
  });

  // ---------- D3 ----------
  await d.demoOverview({
    demo: "D3", name: "Fact-Checked Status Report", folder: "Module-4-Lab/demo3_status",
    flow: [
      ["FaTable", "board.csv", "Tasks + status", C.teal],
      ["FaCodeBranch", "commits.txt", "This week", C.teal],
      ["FaStickyNote", "Stand-up notes", "Messy, raw", C.teal],
      ["FaRobot", "status_report.md", "AI draft", C.purple],
      ["FaCheckDouble", "Fact checks", "7 passed", C.coral],
    ],
    goal: "Write Friday's status report from the real inputs: task board, commits and raw stand-up notes. Tests then check every fact: tasks in the right sections, decisions carried over, and **no invented owners**.",
    learn: ["Summaries for a manager who reads only that", "Decisions vs discussion", "Unknown owner → TBD", "Checking prose against data"],
  });
  await d.demoPrompt({
    demo: "D3", name: "Fact-Checked Status Report",
    panel: { caption: "With the 3 inputs + template attached", fontSize: 9, lines: [
      "Fill in status_report.md for the week ending",
      "13 Nov 2026, using ONLY the attached files.",
      "- Completed / In progress / Blockers: one",
      "  bullet per task, ID in bold, owner in",
      "  brackets, note from the board",
      "- Risks: what could slip, with trigger dates",
      "- Decisions: only what notes mark \"decided\"",
      "- Action items: \"- [ ] <action> - **Owner**\".",
      "  No owner in the notes? Write **TBD** -",
      "  never guess one.",
      "- Summary: 2-3 sentences for a manager",
      "Do not add facts that are not in the files.",
    ] },
    points: [
      ["\"ONLY the attached files\"", "Reduces filler like \"the team showed great momentum\".", C.navy],
      ["TBD, never guess", "The notes say \"nobody owns this yet\". AI loves to assign it anyway.", C.coral],
      ["Decided vs discussed", "\"Demo moves to 24 Nov\" is a decision; \"to confirm\" is not.", C.purple],
      ["Checkable format", "Bold IDs and owners make the report testable.", C.teal],
    ],
  });
  await d.demoRun({
    demo: "D3", name: "Fact-Checked Status Report",
    steps: [
      "On the starter, the empty template fails all 7 checks",
      "Attach the inputs; send the prompt",
      "Paste the draft into `starter/status_report.md`",
      "Run the checks; paste failures back to the AI",
      "Final human read for tone and emphasis",
    ],
    panel: { caption: "Typical AI slips each check catches", fontSize: 9, lines: [
      "test_every_task_is_in_the_right_section",
      "  # T4 listed as Done (\"cap merged\")",
      "  # but board says In progress",
      "",
      "test_action_item_owners_are_real_people",
      "  # 'Priya' is not on the team",
      "",
      "test_unowned_question_is_not_given_an_",
      "invented_owner",
      "  # 'two copies' given to Asha",
      "",
      "test_decisions_are_carried_over",
      "  # demo date left as 19 Nov",
    ] },
    check: "The tests check facts. Whether the report says the right things in the right tone is still the project lead's job.",
  });

  await d.troubleshoot({
    items: [
      ["Docs describe what the code \"should\" do", "Ask it to explain first; say \"use only facts from the code\"."],
      ["Doc examples are slightly wrong", "Write examples as doctests so `pytest` runs them."],
      ["Stories include invented features", "Delete anything not in the brief; ask for *questions* instead."],
      ["Estimates look precise but are guesses", "Label them \"rough\"; the team re-estimates."],
      ["Report assigns work to random people", "Require an owner from the sources or **TBD**; test it."],
      ["Docs go stale after code changes", "Docs in the same PR as the code; ask the AI which sections the diff affects."],
    ],
  });
  await d.challenge({
    items: [
      { level: "LAB 1", head: "Requirements", text: "Write a 5-line business brief for your own project idea. Generate stories, criteria and questions, then answer the questions yourself.", hint: "Number the criteria AC-1… so they can become tests." },
      { level: "LAB 2", head: "Tasks & docs", text: "Break your stories into a backlog with dependencies, then generate a README for the D2 `loans.py` module.", hint: "Reuse D1's README sections and doctest trick." },
      { level: "LAB 3", head: "Status & review", text: "Write 5 lines of fake progress notes. Generate a status report, then list every claim it makes that isn't in your notes.", hint: "Every bullet should trace back to one note." },
    ],
  });
  await d.summary({
    built: [
      ["D1", "Docs That Are Tested", "Docstrings + README; every >>> example runs"],
      ["D2", "Brief → Stories → Tests", "AC-n criteria → test_acn_ tests → 2 gaps"],
      ["D3", "Fact-Checked Report", "Board + commits + notes → checked report"],
    ],
    takeaways: [
      "AI drafts fast; documents must be true",
      "Make docs checkable: doctest, IDs, bold owners",
      "AI's questions beat AI's assumptions",
      "People own estimates, priorities, decisions",
    ],
    next: "Module 5: AI-Assisted Code Review & Security Enhancement",
  });

  await d.save(out);
};
