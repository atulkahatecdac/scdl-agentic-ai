"""Checks for Demo 2.

1. Characterization tests lock in today's behaviour. Write (or generate) them
   BEFORE refactoring. They must pass on the starter AND after the refactor.
2. Helper tests check the new small functions. They are skipped until the
   refactor has created them.
"""
from pathlib import Path

import pytest

import payroll

HERE = Path(__file__).parent


# --- 1. characterization: output must not change ---------------------------
def test_report_matches_the_golden_master():
    expected = (HERE / "expected_report.txt").read_text().strip()
    assert payroll.process_payroll(HERE / "employees.csv") == expected


def test_report_for_a_single_contractor(tmp_path):
    csv_file = tmp_path / "one.csv"
    csv_file.write_text("emp_id,name,type,monthly_amount\nC9,Test Person,contractor,50000\n")
    report = payroll.process_payroll(csv_file)
    assert "tax  5,000.00  net  45,000.00" in report
    assert report.endswith("TOTAL NET 45,000.00")


def test_skipped_rows_are_listed(tmp_path):
    csv_file = tmp_path / "skip.csv"
    csv_file.write_text("emp_id,name,type,monthly_amount\nX1,A,intern,9000\nX2,B,fulltime,\n")
    assert payroll.process_payroll(csv_file).splitlines()[-1] == "SKIPPED X1, X2"


# --- 2. helpers created by the refactor --------------------------------------
needs_refactor = pytest.mark.skipif(
    not hasattr(payroll, "calculate_tax"), reason="not refactored yet: no calculate_tax()"
)


@needs_refactor
@pytest.mark.parametrize("gross, tax", [(42000, 4200), (50000, 5000), (85000, 12000)])
def test_calculate_tax_slabs(gross, tax):
    assert payroll.calculate_tax(gross) == pytest.approx(tax)


@needs_refactor
def test_net_pay_deducts_pf_only_for_fulltime():
    assert payroll.net_pay(85000, "fulltime") == pytest.approx(71200)
    assert payroll.net_pay(85000, "contractor") == pytest.approx(73000)
