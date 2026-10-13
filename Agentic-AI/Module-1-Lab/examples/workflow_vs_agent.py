def llm_call(step, text):
    """Stub standing in for an LLM call, so this runs instantly and free."""
    return f"[{step}] {text}"


def run_workflow(document):
    """Workflow: the developer fixes the path in advance - same steps, every time."""
    text = llm_call("extract_text", document)
    text = llm_call("summarize", text)
    text = llm_call("generate_report", text)
    return text


def run_agent(document):
    """Agent: decides its next step based on what it currently observes."""
    state = document
    steps_taken = []

    while True:
        if "extract_text" not in steps_taken and "raw" in state:
            action = "extract_text"
        elif "summarize" not in steps_taken and len(state) > 40:
            action = "summarize"
        elif "generate_report" not in steps_taken:
            action = "generate_report"
        else:
            return state

        state = llm_call(action, state)
        steps_taken.append(action)
        print(f"  agent chose: {action} (state so far: {len(state)} chars)")


if __name__ == "__main__":
    long_raw_doc = "raw Q3 sales figures across all regions " * 3
    short_summary = "Q3 summary: sales up 12%"

    print("Workflow always runs all 3 steps, regardless of input:")
    print(" ", run_workflow(short_summary))

    print("\nAgent adapts its path to the input:")
    print("Input is long & raw ->")
    run_agent(long_raw_doc)
    print("Input is already a short summary ->")
    run_agent(short_summary)
