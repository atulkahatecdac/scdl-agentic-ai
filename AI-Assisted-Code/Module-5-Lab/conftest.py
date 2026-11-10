"""Shared pytest setup for the demos in this lab.

Every demo folder has two versions of the code:

    starter/   what you give the AI assistant at the start of the demo
    solution/  a reviewed reference answer (the "after" state)

The tests in each demo folder import whichever version you pick with --target:

    pytest demo1_bonus                    # tests solution/ (the default)
    pytest demo1_bonus --target starter   # tests starter/ (fails until the AI has done its job)
"""
import sys
from pathlib import Path

import pytest

LAB = Path(__file__).parent


def pytest_addoption(parser):
    parser.addoption(
        "--target",
        choices=("starter", "solution"),
        default="solution",
        help="which version of each demo to test (default: solution)",
    )


def pytest_configure(config):
    target = config.getoption("--target")
    for demo in sorted(LAB.glob("demo*/")):
        sys.path.insert(0, str(demo / target))


def pytest_report_header(config):
    return f"demo target: {config.getoption('--target')}"


@pytest.fixture
def target_dir(request):
    """Folder of the version under test, for example demo3_status/solution."""
    return request.path.parent / request.config.getoption("--target")
