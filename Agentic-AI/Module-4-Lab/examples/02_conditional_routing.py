from typing import TypedDict

from langgraph.graph import StateGraph, START, END
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini")


class RequestState(TypedDict):
    request: str
    category: str
    reply: str


def classify(state: RequestState) -> dict:
    response = model.invoke(
        "Classify this customer request into exactly one word: sales, technical, or support.\n\n"
        f"Request: {state['request']}"
    )
    return {"category": str(response.content).strip().lower()}


def route_by_category(state: RequestState) -> str:
    """Conditional edge: inspects state and returns the name of the next node."""
    category = state["category"]
    if "sales" in category:
        return "sales"
    if "technical" in category:
        return "technical"
    return "support"


def sales_node(state: RequestState) -> dict:
    return {"reply": f"[Sales] Let me get you pricing info for: {state['request']}"}


def technical_node(state: RequestState) -> dict:
    return {"reply": f"[Technical] Let's debug this: {state['request']}"}


def support_node(state: RequestState) -> dict:
    return {"reply": f"[Support] I can help with your account issue: {state['request']}"}


graph = StateGraph(RequestState)
graph.add_node("classify", classify)
graph.add_node("sales", sales_node)
graph.add_node("technical", technical_node)
graph.add_node("support", support_node)

graph.add_edge(START, "classify")
graph.add_conditional_edges(
    "classify",
    route_by_category,
    {"sales": "sales", "technical": "technical", "support": "support"},
)
graph.add_edge("sales", END)
graph.add_edge("technical", END)
graph.add_edge("support", END)

app = graph.compile()


def handle(request):
    result = app.invoke({"request": request, "category": "", "reply": ""})
    print(f"\nRequest: {request}")
    print(f"Routed to: {result['category']} -> {result['reply']}")


if __name__ == "__main__":
    handle("What's the price for the enterprise plan?")
    handle("I'm getting an error when I click submit.")
    handle("I can't log into my account.")
