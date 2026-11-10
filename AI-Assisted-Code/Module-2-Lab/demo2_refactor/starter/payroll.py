"""Monthly payroll report.

Demo 2: process_payroll works, but it does four jobs in one function and
repeats the tax calculation. Refactor it with your AI assistant without
changing its output - see PROMPT.md.
"""
import csv


def process_payroll(path):
    f = open(path, newline="")
    r = csv.DictReader(f)
    out = []
    t = 0
    skipped = []
    for x in r:
        if x["monthly_amount"] == "" or x["type"] not in ("fulltime", "contractor"):
            skipped.append(x["emp_id"])
            continue
        a = float(x["monthly_amount"])
        if x["type"] == "fulltime":
            # 10% tax on the first 50,000, 20% on the rest; 1,800 PF
            if a > 50000:
                tx = 50000 * 0.10 + (a - 50000) * 0.20
            else:
                tx = a * 0.10
            n = a - tx - 1800
            out.append(f"{x['emp_id']}  {x['name']:<16} FT  gross {a:>10,.2f}  tax {tx:>9,.2f}  net {n:>10,.2f}")
            t = t + n
        if x["type"] == "contractor":
            # same slabs, no PF
            if a > 50000:
                tx = 50000 * 0.10 + (a - 50000) * 0.20
            else:
                tx = a * 0.10
            n = a - tx
            out.append(f"{x['emp_id']}  {x['name']:<16} CT  gross {a:>10,.2f}  tax {tx:>9,.2f}  net {n:>10,.2f}")
            t = t + n
    f.close()
    out.append(f"TOTAL NET {t:,.2f}")
    if skipped:
        out.append("SKIPPED " + ", ".join(skipped))
    return "\n".join(out)


if __name__ == "__main__":
    from pathlib import Path

    print(process_payroll(Path(__file__).parent.parent / "employees.csv"))
