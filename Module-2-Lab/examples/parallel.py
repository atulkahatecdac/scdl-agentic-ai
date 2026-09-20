import time
from concurrent.futures import ThreadPoolExecutor


def llm_call(task):
    """Stub standing in for a slow LLM call."""
    time.sleep(1)
    return f"{task}: done"


tasks = ["financial_analysis", "news_sentiment", "competitor_landscape"]

start = time.time()
with ThreadPoolExecutor() as pool:
    results = list(pool.map(llm_call, tasks))
elapsed = time.time() - start

print("Results:", results)
print(f"Elapsed: {elapsed:.1f}s (vs ~{len(tasks)}s if run sequentially)")
