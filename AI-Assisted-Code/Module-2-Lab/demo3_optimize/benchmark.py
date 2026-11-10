"""Measure before (and after) you optimize.

    python demo3_optimize/benchmark.py                # time the starter
    python demo3_optimize/benchmark.py solution       # time the solution
    python demo3_optimize/benchmark.py both           # compare, and check results match

Uses a fixed random seed, so every run uses the same data.
"""
import importlib.util
import random
import sys
import time
from pathlib import Path

HERE = Path(__file__).parent
N_ORDERS, N_CUSTOMERS = 10_000, 3_000


def load(version):
    spec = importlib.util.spec_from_file_location(f"customers_{version}", HERE / version / "customers.py")
    assert spec and spec.loader, f"cannot load {version}/customers.py"
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def make_data():
    rnd = random.Random(42)
    customers = [{"id": f"C{i:05d}", "name": f"Customer {i}"} for i in range(N_CUSTOMERS)]
    orders = [{"order_id": f"O{i:06d}", "customer_id": f"C{rnd.randrange(N_CUSTOMERS + 200):05d}"}
              for i in range(N_ORDERS)]
    return orders, customers


def timed(fn, *args):
    start = time.perf_counter()
    result = fn(*args)
    return result, time.perf_counter() - start


def run(version, orders, customers):
    m = load(version)
    r1, t1 = timed(m.repeat_customers, orders)
    r2, t2 = timed(m.orders_with_names, orders, customers)
    print(f"{version:<9} repeat_customers {t1:8.3f}s   orders_with_names {t2:8.3f}s")
    return (r1, r2), t1 + t2


if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "starter"
    orders, customers = make_data()
    print(f"{N_ORDERS:,} orders, {N_CUSTOMERS:,} customers")
    if which == "both":
        before, t_before = run("starter", orders, customers)
        after, t_after = run("solution", orders, customers)
        print("results identical:", before == after)
        print(f"speed-up: {t_before / t_after:,.0f}x")
    else:
        run(which, orders, customers)
