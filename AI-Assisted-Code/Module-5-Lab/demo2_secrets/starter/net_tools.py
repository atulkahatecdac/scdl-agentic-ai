"""Uptime checker: pings a host and reports the result to the status page.

Demo 2: this file has a hard-coded secret and a command-injection hole.
Fix both with your AI assistant - see PROMPT.md.
"""
import subprocess

STATUS_API_TOKEN = "statuspage-prod-7f3a9c1e5b2d4f60a8e1"   # FAKE token for the demo


def auth_header():
    return {"Authorization": f"Bearer {STATUS_API_TOKEN}"}


def ping(host):
    result = subprocess.run(f"ping -n 1 {host}", shell=True, capture_output=True, text=True)
    return result.returncode == 0
