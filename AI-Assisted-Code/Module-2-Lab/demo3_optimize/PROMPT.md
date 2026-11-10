# Demo 3 - Optimize: measure, change, measure again

`starter/customers.py` gives correct results, but a month of real orders makes
it slow. Rule #1: **measure before you optimize**.

## Step 1 - measure

```powershell
python demo3_optimize/benchmark.py
```

```text
10,000 orders, 3,000 customers
starter   repeat_customers    2.6s   orders_with_names    1.3s
```

(Your numbers will differ. What matters is the ratio.) To see where the time goes:

```powershell
python -m cProfile -s tottime demo3_optimize/benchmark.py | Select-Object -First 15
```

`list.count` and the inner `for c in customers` loop dominate.

## Step 2 - lock the results

```powershell
pytest demo3_optimize --target starter    # 5 passed
```

These tests check results only, never speed. They must still pass afterwards.

## Step 3 - ask the AI for an analysis first, then the change

```text
These two functions are correct but slow for 10,000 orders and 3,000
customers (profile output below). For each function:
1. state its time complexity and the line that causes it
2. propose a faster version with the SAME results, including:
   - repeat_customers keeps first-appearance order
   - orders_with_names uses the FIRST matching customer record
     and returns "Unknown" when there is no match
Prefer the simplest readable fix (standard library only).

<paste customers.py and the profile output>
```

Expected answer: `repeat_customers` is O(n²) because `list.count` runs inside
the loop, so use `collections.Counter`. `orders_with_names` is O(n x m), so
build a dict index first.

Watch for the subtle trap: a naive `{c["id"]: c["name"] for c in customers}`
keeps the **last** duplicate record, not the first. One test catches exactly that.

## Step 4 - verify and measure again

```powershell
pytest demo3_optimize --target starter
python demo3_optimize/benchmark.py both
```

```text
starter   ... 3.9s total
solution  ... 0.007s total
results identical: True
speed-up: 500x
```

`solution/customers.py` is a reviewed reference answer.
