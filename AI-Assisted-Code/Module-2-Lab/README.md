# Module 2 Lab - AI-Assisted Debugging, Refactoring & Code Optimization

Three instructor-led demos for Module 2 of the AI-Assisted Code course. Each
one is small, runs offline, and needs only Python plus an AI coding assistant.
The slides for each demo (Overview / The prompt / Run & verify) follow
`PROMPT.md` in the demo folder step by step.

| Demo | What it shows | `--target starter` | `--target solution` |
|------|---------------|--------------------|---------------------|
| [`demo1_debug`](demo1_debug/PROMPT.md) | Debug a runtime error (TypeError) and a logic error (boundary) | 5 failed | 5 passed |
| [`demo2_refactor`](demo2_refactor/PROMPT.md) | Refactor safely: characterization tests first | 3 passed, 4 skipped | 7 passed |
| [`demo3_optimize`](demo3_optimize/PROMPT.md) | Measure, optimize (O(n^2) -> O(n)), measure again | 5 passed (slow) | 5 passed (~500x faster) |

`demo3_optimize/benchmark.py` times the code: `python demo3_optimize/benchmark.py both`.

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
   cd Module-2-Lab
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

Run the commands from this `Module-2-Lab` folder:

```powershell
pytest demo1_debug --target starter    # the "before" state: fails
# ... work through PROMPT.md with your AI assistant, editing starter/ ...
pytest demo1_debug --target starter    # the "after" state: passes
pytest demo1_debug                     # the reference solution: always passes
pytest                             # every demo, against the solutions
```

The AI's answers will not match `solution/` word for word, and that is fine.
**The tests are the judge.** If the AI goes off track during a live demo, open
the matching file in `solution/`.

## Reset a demo

The starters are in git, so after a live demo you can put one back with:

```powershell
git checkout -- demo1_debug/starter
```
