from typing import TypedDict

from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini")


class PipelineState(TypedDict):
    document: str
    key_points: str
    summary: str


def extract_key_points(state: PipelineState) -> dict:
    response = model.invoke(f"List the key points in this text as short bullets:\n\n{state['document']}")
    return {"key_points": response.content}


def summarize(state: PipelineState) -> dict:
    response = model.invoke(f"Write a one-sentence summary from these key points:\n\n{state['key_points']}")
    return {"summary": response.content}


# A custom TypedDict state (not just messages) with two nodes wired together by
# direct edges -- a fixed, always-in-order pipeline, same shape as a chain but
# expressed as a graph.
graph = StateGraph(PipelineState)
graph.add_node("extract", extract_key_points)
graph.add_node("summarize", summarize)
graph.add_edge(START, "extract")
graph.add_edge("extract", "summarize")
graph.add_edge("summarize", END)

app = graph.compile()

if __name__ == "__main__":
    document = (
        "Q3 sales rose 12% year-over-year, driven mainly by the new widget line. "
        "Customer support tickets dropped 8% after the new onboarding guide launched. "
        "The east region underperformed its target by 5%, largely due to a competitor's price cut."
    )
    result = app.invoke({"document": document, "key_points": "", "summary": ""})
    print("Key points:\n", result["key_points"])
    print("\nSummary:\n", result["summary"])
