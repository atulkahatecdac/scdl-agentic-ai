"""Acceptance tests for Demo 2: one test per acceptance criterion in stories.md.

The test name starts with the criterion ID (test_ac3_...), and
test_every_criterion_has_a_test checks that nothing was forgotten.
"""
import re
from datetime import date, timedelta

import pytest

from loans import Library, LoanError

TODAY = date(2026, 11, 2)


@pytest.fixture
def lib():
    return Library({"PY-1": 2, "AI-2": 1, "DB-3": 5, "UX-4": 5})


def test_ac1_borrow_sets_due_date_and_reduces_copies(lib):
    assert lib.borrow("asha", "PY-1", TODAY) == TODAY + timedelta(days=14)
    assert lib.copies["PY-1"] == 1


def test_ac2_no_copies_left_is_refused(lib):
    lib.borrow("asha", "AI-2", TODAY)
    with pytest.raises(LoanError, match="not available"):
        lib.borrow("rohan", "AI-2", TODAY)


def test_ac3_fourth_book_is_refused(lib):
    for isbn in ("PY-1", "AI-2", "DB-3"):
        lib.borrow("asha", isbn, TODAY)
    with pytest.raises(LoanError, match="limit"):
        lib.borrow("asha", "UX-4", TODAY)


def test_ac4_return_on_due_date_is_free(lib):
    due = lib.borrow("asha", "PY-1", TODAY)
    assert lib.return_book("asha", "PY-1", due) == 0


def test_ac5_late_fine_is_per_day(lib):
    due = lib.borrow("asha", "PY-1", TODAY)
    assert lib.return_book("asha", "PY-1", due + timedelta(days=3)) == 15


def test_ac5_late_fine_is_capped_at_100(lib):
    due = lib.borrow("asha", "PY-1", TODAY)
    assert lib.return_book("asha", "PY-1", due + timedelta(days=60)) == 100


def test_ac6_unpaid_fine_blocks_borrowing_until_paid(lib):
    due = lib.borrow("asha", "PY-1", TODAY)
    lib.return_book("asha", "PY-1", due + timedelta(days=2))  # Rs 10
    with pytest.raises(LoanError, match="fees"):
        lib.borrow("asha", "DB-3", due)
    lib.pay("asha", 10)
    assert lib.borrow("asha", "DB-3", due)


def test_every_criterion_has_a_test(target_dir):
    """Traceability: each AC-n in stories.md must have a test_acn_ test here."""
    stories = target_dir / "stories.md"
    assert stories.exists(), "no stories.md yet - generate it from brief.md"
    criteria = set(re.findall(r"\*\*AC-(\d+)\*\*", stories.read_text(encoding="utf-8")))
    tested = set(re.findall(r"def test_ac(\d+)_", open(__file__, encoding="utf-8").read()))
    assert criteria, "stories.md has no **AC-n** criteria"
    assert criteria <= tested, f"criteria without a test: {sorted(criteria - tested)}"
