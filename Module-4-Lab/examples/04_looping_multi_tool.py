from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

KNOWLEDGE_BASE = {
    "widget price": "A widget costs $25 per unit.",
    "gadget price": "A gadget costs $40 per unit.",
}


@tool
def search_knowledge_base(query: str) -> str:
    """Look up pricing information in the internal knowledge base."""
    for key, value in KNOWLEDGE_BASE.items():
        if key in query.lower():
            return value
    return f"No information found for '{query}'."


@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the numeric result."""
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except Exception as e:
        return f"Error: could not evaluate '{expression}' ({e})"


tools = [search_knowledge_base, calculator]
model = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)


def call_model(state: MessagesState) -> dict:
    response = model.invoke(state["messages"])
    return {"messages": [response]}


def tool_required(state: MessagesState) -> str:
    last_message = state["messages"][-1]
    return "tools" if getattr(last_message, "tool_calls", None) else END


graph = StateGraph(MessagesState)
graph.add_node("agent", call_model)
graph.add_node("tools", ToolNode(tools))
graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", tool_required, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")

app = graph.compile()


def ask(question):
    """Uses app.stream() instead of app.invoke() so each loop iteration -- LLM
    reasoning, tool call, tool result -- is visible as it happens."""
    print(f"\nUser: {question}")
    for event in app.stream({"messages": [HumanMessage(content=question)]}):
        for node_name, update in event.items():
            last = update["messages"][-1]
            if getattr(last, "tool_calls", None):
                for call in last.tool_calls:
                    print(f"  [{node_name}] tool call -> {call['name']}({call['args']})")
            elif getattr(last, "type", "") == "tool":
                print(f"  [{node_name}] tool result -> {last.content}")
            else:
                print(f"  [{node_name}] final answer -> {last.content}")


if __name__ == "__main__":
    ask("Find the price of a widget and a gadget, then tell me the total cost of buying 3 widgets and 2 gadgets.")
