"""Checks for Demo 3: is the AI-written status report faithful to its sources?

The report is prose, but the facts in it can be checked against board.csv and
the stand-up notes: every task in the right section, no invented owners,
decisions carried over.
"""
import csv
import re
from pathlib import Path

import pytest

INPUTS = Path(__file__).parent / "inputs"
SECTIONS = ["Summary", "Completed", "In progress", "Blockers", "Risks",
            "Decisions", "Action items", "Open questions"]


@pytest.fixture
def report(target_dir):
    text = (target_dir / "status_report.md").read_text(encoding="utf-8")
    parts = re.split(r"^## +(.+?)\s*$", text, flags=re.M)
    return {parts[i]: parts[i + 1] for i in range(1, len(parts) - 1, 2)}


@pytest.fixture(scope="module")
def board():
    with open(INPUTS / "board.csv", newline="", encoding="utf-8") as f:
        return list(csv.DictReader(f))


def test_all_sections_are_filled_in(report):
    for name in SECTIONS:
        assert name in report, f"missing section: {name}"
        body = report[name].strip()
        assert body and "_TODO_" not in body, f"section not filled in: {name}"


@pytest.mark.parametrize("status, section", [
    ("Done", "Completed"), ("In progress", "In progress"), ("Blocked", "Blockers"),
])
def test_every_task_is_in_the_right_section(report, board, status, section):
    expected = {row["task_id"] for row in board if row["status"] == status}
    found = set(re.findall(r"\bT\d+\b", report[section]))
    assert expected <= found, f"{section} is missing {sorted(expected - found)}"
    others = {row["task_id"] for row in board if row["status"] != status}
    assert not (found & others), f"{section} wrongly lists {sorted(found & others)}"


def test_action_item_owners_are_real_people_or_tbd(report, board):
    people = {row["owner"] for row in board} | {"TBD"}
    owners = re.findall(r"\*\*([A-Za-z]+)\*\*\s*$", report["Action items"], flags=re.M)
    assert owners, "action items need an owner in **bold** at the end of the line"
    invented = set(owners) - people
    assert not invented, f"owners not on the team: {invented}"


def test_unowned_question_is_not_given_an_invented_owner(report):
    line = next(l for l in report["Action items"].splitlines() if "copies" in l)
    assert "**TBD**" in line, "the notes say nobody owns this yet"


def test_decisions_are_carried_over(report):
    assert "24 Nov" in report["Decisions"]
    assert "Rohan" in report["Decisions"]
