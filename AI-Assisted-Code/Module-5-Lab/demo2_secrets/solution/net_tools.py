"""Uptime checker: pings a host and reports the result to the status page.

Reference answer for Demo 2:
- the token comes from the environment (set it in .env / the server, never in git)
- the host is validated, and ping runs WITHOUT a shell, with an argument list
"""
import ipaddress
import os
import platform
import re
import subprocess

HOSTNAME = re.compile(r"^(?=.{1,253}$)([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$")


def auth_header():
    token = os.environ.get("STATUS_API_TOKEN")
    if not token:
        raise RuntimeError("STATUS_API_TOKEN is not set")  # never print the value
    return {"Authorization": f"Bearer {token}"}


def validate_host(host):
    """Return host if it is an IP address or a valid DNS name; else ValueError."""
    if not isinstance(host, str):
        raise ValueError("host must be a string")
    try:
        ipaddress.ip_address(host)
        return host
    except ValueError:
        pass
    if HOSTNAME.match(host):
        return host
    raise ValueError(f"invalid host: {host!r}")


def ping(host):
    host = validate_host(host)
    count_flag = "-n" if platform.system() == "Windows" else "-c"
    result = subprocess.run(["ping", count_flag, "1", host], shell=False, capture_output=True, text=True)
    return result.returncode == 0
