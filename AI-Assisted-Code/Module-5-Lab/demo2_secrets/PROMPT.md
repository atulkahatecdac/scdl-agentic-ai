# Demo 2 - Hard-coded secrets and command injection

`starter/net_tools.py` is a tiny uptime checker with two classic problems:

1. A status-page API token is **hard-coded** in the source. The token is
   fake, but the pattern is real. Once it is committed, it lives in git history forever.
2. `ping()` builds a shell command from `host` with `shell=True`. That is **command injection**.

## Step 1 - show the risk (safely)

Don't run an attack. Ask the AI to explain it:

```text
In net_tools.py, what would ping("127.0.0.1 & whoami") execute on
Windows, and ping("127.0.0.1; cat /etc/passwd") on Linux? Explain why
shell=True with an f-string makes this possible.
```

Then search for secrets the way a scanner would:

```powershell
Select-String -Path demo2_secrets\starter\*.py -Pattern "TOKEN|SECRET|PASSWORD"
```

## Step 2 - ask for the fix, with constraints

```text
Fix two security issues in net_tools.py:

1. Read STATUS_API_TOKEN from an environment variable. If it is missing,
   raise RuntimeError naming the variable - never print the token itself.
2. Make ping() safe:
   - validate host: an IP address (use the ipaddress module) or a valid
     DNS hostname; anything else raises ValueError BEFORE running anything
   - call subprocess.run with an argument LIST and shell=False
   - use -n on Windows and -c elsewhere

Keep the function names. Standard library only.
```

## Step 3 - test without executing anything

```powershell
pytest demo2_secrets --target starter
```

The tests **mock** `subprocess.run`, so even the injection payloads never
run. They check that:

- no `*TOKEN*` / `*SECRET*` name is assigned a string literal (using Python's `ast` module)
- the token is read from the environment, and a missing token fails clearly
- valid hosts are pinged with a list and no shell
- injection payloads are rejected and `subprocess.run` is never called

Before: **12 failed**. After: **12 passed**.

## Step 4 - the part code can't fix

The old token is still in git history. **Rotate it** (revoke it and issue a
new one), then store the new one in `.env` (see `.env.example`) or the
server's secret store.
