# Module 1 Lab — Getting Started

This folder contains small, self-contained demos that use the [OpenAI Agents SDK](https://github.com/openai/openai-agents-python) to show the difference between a plain LLM call, an LLM application, a workflow, and an agent that uses tools.

Follow the steps below in order. They assume you are starting from a completely fresh Windows machine with nothing installed.

---

## 1. Install Python

1. Download Python from [python.org/downloads](https://www.python.org/downloads/) (Python 3.10 or newer — these demos were built and tested on **Python 3.12**).
2. Run the installer. On the first screen, **tick the "Add python.exe to PATH" checkbox** — this is the most common thing people forget.
3. Click "Install Now" and let it finish.
4. Verify the install by opening a **new** terminal (PowerShell or Command Prompt) and running:

   ```powershell
   python --version
   ```

   You should see something like `Python 3.12.10`. If you get "python is not recognized", close and reopen the terminal, or re-run the installer and make sure "Add to PATH" was checked.

## 2. Install VS Code

1. Download and install VS Code from [code.visualstudio.com](https://code.visualstudio.com/) (default settings are fine).
2. Open VS Code, go to the **Extensions** icon in the left sidebar (or press `Ctrl+Shift+X`), search for **Python** (published by Microsoft), and click **Install**. This adds syntax highlighting, IntelliSense, and the "Run Python File" button.
3. In VS Code, go to **File → Open Folder...** and select the `Module-1-Lab` folder.

## 3. Set the Python interpreter in VS Code

VS Code needs to know which Python (and later, which virtual environment) to use for this folder.

1. Press `Ctrl+Shift+P` to open the Command Palette.
2. Type **Python: Select Interpreter** and press Enter.
3. Pick the Python 3.10+ install you did in step 1 for now — once you create the `.venv` folder in step 7, come back to this same command and select the interpreter listed as `.venv\Scripts\python.exe` (VS Code usually detects it automatically and offers to switch).
4. You can now open any `.py` file and click the ▶ **Run Python File** button in the top-right corner instead of typing `python file.py` in the terminal. VS Code's built-in terminal (**Terminal → New Terminal**) also works exactly like the PowerShell steps below.

## 4. (Optional) Install the Windsurf extension for VS Code

[Windsurf](https://windsurf.com/) (formerly Codeium) has a free AI coding assistant extension that runs inside VS Code — autocomplete plus a chat panel (Cascade). It's optional — everything in this lab works fine without it — but useful if you want AI help while exploring or modifying the demo code.

1. In VS Code, go to the **Extensions** icon (`Ctrl+Shift+X`).
2. Search for **Windsurf** (publisher: **Windsurf / Codeium**) and click **Install**.
3. Reload VS Code if prompted. A Windsurf icon appears in the left sidebar.
4. Click it and sign in with a free account to start using autocomplete and the Cascade chat panel.

## 5. Get an OpenAI API key

1. Go to [platform.openai.com](https://platform.openai.com/) and sign up or log in.
2. Add a small amount of billing credit under **Settings → Billing** (these demos use `gpt-4o-mini`, which is inexpensive — a few cents will run all of them many times over).
3. Go to **API keys** (or [platform.openai.com/api-keys](https://platform.openai.com/api-keys)) and click **Create new secret key**.
4. Copy the key immediately — OpenAI only shows it once. It looks like `sk-proj-...`.

> ⚠️ Treat this key like a password. Never share it, paste it into a chat, or commit it to a public repository. Anyone with the key can spend your credits.

## 6. Open a terminal in this folder

Open a PowerShell terminal and navigate into the `Module-1-Lab` folder, for example:

```powershell
cd "C:\lectures\Others\SCDL\Aug-2026\Module-1-Lab"
```

## 7. Create and activate a virtual environment

A virtual environment keeps this project's Python packages separate from everything else on your machine.

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
```

Your prompt should now start with `(.venv)`. If PowerShell blocks the activation script with an "execution policy" error, run this once and try activating again:

```powershell
Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
```

> From now on, every time you open a new terminal to work in this folder, re-activate with `.venv\Scripts\Activate.ps1`.

## 8. Install the required packages

With the virtual environment active, install the dependencies listed in `requirements.txt`:

```powershell
pip install -r requirements.txt
```

This installs:
- `openai` — the OpenAI Python client
- `openai-agents` — the Agents SDK (`Agent`, `Runner`, `function_tool`, etc.)
- `python-dotenv` — loads your API key from a `.env` file

## 9. Add your API key

Create a file named `.env` in this folder (same level as `basic_app.py`) containing a single line:

```
OPENAI_API_KEY=sk-proj-your-key-here
```

There is no space around the `=`, and no quotes around the key. Save the file.

> `.env` should never be shared or checked into version control — if you use git, add a `.gitignore` entry for `.env`.

## 10. Run the demos

Each script is a standalone example — run them one at a time with `python <filename>`. Make sure your virtual environment is active first.

| File | What it shows |
|---|---|
| `basic_app.py` | The simplest possible agent — no instructions, just asks it to explain agentic AI. |
| `system_prompt_app.py` | Same idea, but with a custom **system prompt** (`instructions`) that turns the agent into an Indian-law expert — shows how instructions steer tone and content. |
| `tool_agent.py` | An agent with a **tool** (`add`) it can call to do arithmetic, plus answer a general question — shows tool use mixed with normal reasoning. |
| `examples\workflow_vs_agent.py` | No API key needed — a pure-Python illustration of the difference between a fixed **workflow** (always runs every step) and an **agent** (adapts its steps to the input). |
| `examples\levels_of_systems.py` | Walks through 5 increasing levels of sophistication: bare LLM → LLM application → workflow → agent → multi-agent system. |
| `examples\tools_on_off.py` | Runs the *same* multiplication question with and without a calculator tool, so you can see the LLM guess vs. compute the exact answer. |
| `examples\agentic_loop.py` | An inventory-check agent that prints out each **Act** (tool call) and **Observe** (tool result) step before giving its final answer — makes the agent's reasoning loop visible. |

Example run:

```powershell
python basic_app.py
```

```powershell
python examples\agentic_loop.py
```

## Troubleshooting

- **`ModuleNotFoundError: No module named 'agents'`** — your virtual environment isn't active, or `pip install -r requirements.txt` wasn't run inside it. Re-activate and re-install.
- **`AuthenticationError` / `401`** — your `.env` file is missing, misnamed, in the wrong folder, or the key was copied incorrectly. Double-check step 9.
- **`RateLimitError` / `insufficient_quota`** — add billing credit to your OpenAI account (step 5).
- **Nothing happens for a few seconds then text prints** — that's normal, it's waiting on the API response.
