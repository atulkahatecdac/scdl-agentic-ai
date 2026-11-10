# Module 3 Lab - Automated Testing with Generative AI

Three instructor-led demos for Module 3 of the AI-Assisted Code course. Each
one is small, runs offline, and needs only Python plus an AI coding assistant.
The slides for each demo (Overview / The prompt / Run & verify) follow
`PROMPT.md` in the demo folder step by step.

| Demo | What it shows | `--target starter` | `--target solution` |
|------|---------------|--------------------|---------------------|
| [`demo1_unit`](demo1_unit/PROMPT.md) | Generate unit tests that find a boundary bug | 4 failed, 10 passed | 14 passed |
| [`demo2_mock`](demo2_mock/PROMPT.md) | Mock an external API (no network in tests) | 3 failed, 4 passed | 7 passed |
| [`demo3_integration`](demo3_integration/PROMPT.md) | Integration tests with SQLite + coverage gaps | 2 failed, 6 passed | 8 passed, 100% coverage |

Coverage (`pytest-cov`) is used in Demo 3: `pytest demo3_integration --cov=enrollment --cov-branch --cov-report=term-missing`.

## Setup (once)

1. **Python 3.10 or newer.** On Windows, tick *Add python.exe to PATH* in the installer.
   These demos were tested with Python 3.12.
2. **VS Code** plus the **Python** extension (Microsoft).
3. **An AI coding assistant.** Any of these work:
   - GitHub Copilot Chat (VS Code extension)
   - Windsurf (free VS Code extension)
   - ChatGPT or Claude in the browser
4. **A virtual environment** for this folder:

   ```powershell
   cd Module-3-Lab
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   ```

   If PowerShell blocks `Activate.ps1`, run
   `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once.

## How every demo works

```text
demoN_name/
  PROMPT.md     the exact prompts, in order, and what to point out
  starter/      the code you give the AI (the "before" state)
  solution/     a reviewed reference answer (the "after" state)
  test_*.py     tests that check the requirement, not the AI's code
```

Run the commands from this `Module-3-Lab` folder:

```powershell
pytest demo1_unit --target starter    # the "before" state: fails
# ... work through PROMPT.md with your AI assistant, editing starter/ ...
pytest demo1_unit --target starter    # the "after" state: passes
pytest demo1_unit                     # the reference solution: always passes
pytest                             # every demo, against the solutions
```

The AI's answers will not match `solution/` word for word, and that is fine.
**The tests are the judge.** If the AI goes off track during a live demo, open
the matching file in `solution/`.

## Reset a demo

The starters are in git, so after a live demo you can put one back with:

```powershell
git checkout -- demo1_unit/starter
```
