def llm_call(step, text):
    """Stub standing in for an LLM call at each pipeline step."""
    return f"[{step}: {text}]"


def run_pipeline(document):
    text = llm_call("extract", document)
    text = llm_call("analyze", text)
    text = llm_call("summarize", text)
    text = llm_call("report", text)
    return text


if __name__ == "__main__":
    print(run_pipeline("Q3 raw sales data"))
