"""Monthly payroll report.

Reference answer for Demo 2: the same output as the starter, but each job
now lives in its own small function and the tax rule exists once.
"""
import csv

PAYABLE_TYPES = {"fulltime": "FT", "contractor": "CT"}
SLAB_LIMIT = 50000
LOWER_RATE = 0.10
UPPER_RATE = 0.20
PF_DEDUCTION = {"fulltime": 1800, "contractor": 0}


def read_employees(path):
    """Return the CSV rows as a list of dicts."""
    with open(path, newline="") as f:
        return list(csv.DictReader(f))


def is_payable(emp):
    """True if the row has an amount and a type we pay through payroll."""
    return emp["monthly_amount"] != "" and emp["type"] in PAYABLE_TYPES


def calculate_tax(gross):
    """10% on the first 50,000 and 20% on the rest."""
    if gross > SLAB_LIMIT:
        return SLAB_LIMIT * LOWER_RATE + (gross - SLAB_LIMIT) * UPPER_RATE
    return gross * LOWER_RATE


def net_pay(gross, emp_type):
    """Gross minus tax minus the PF deduction for this employee type."""
    return gross - calculate_tax(gross) - PF_DEDUCTION[emp_type]


def format_line(emp, gross, net):
    code = PAYABLE_TYPES[emp["type"]]
    tax = calculate_tax(gross)
    return (f"{emp['emp_id']}  {emp['name']:<16} {code}  gross {gross:>10,.2f}"
            f"  tax {tax:>9,.2f}  net {net:>10,.2f}")


def process_payroll(path):
    """Build the payroll report text for the employees in the CSV at path."""
    lines, total_net, skipped = [], 0, []
    for emp in read_employees(path):
        if not is_payable(emp):
            skipped.append(emp["emp_id"])
            continue
        gross = float(emp["monthly_amount"])
        net = net_pay(gross, emp["type"])
        lines.append(format_line(emp, gross, net))
        total_net += net
    lines.append(f"TOTAL NET {total_net:,.2f}")
    if skipped:
        lines.append("SKIPPED " + ", ".join(skipped))
    return "\n".join(lines)


if __name__ == "__main__":
    from pathlib import Path

    print(process_payroll(Path(__file__).parent.parent / "employees.csv"))
