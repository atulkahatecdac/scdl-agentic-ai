from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()


@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the numeric result."""
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except Exception as e:
        return f"Error: could not evaluate '{expression}' ({e})"


tools = [calculator]
model = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)


def call_model(state: MessagesState) -> dict:
    response = model.invoke(state["messages"])
    return {"messages": [response]}


def tool_required(state: MessagesState) -> str:
    """Conditional edge: route to the tool node if the LLM asked for a tool call,
    otherwise route to END."""
    last_message = state["messages"][-1]
    return "tools" if getattr(last_message, "tool_calls", None) else END


# The standard tool-calling graph: agent <-> tools loop, gated by a conditional edge.
graph = StateGraph(MessagesState)
graph.add_node("agent", call_model)
graph.add_node("tools", ToolNode(tools))

graph.add_edge(START, "agent")
graph.add_conditional_edges("agent", tool_required, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")

app = graph.compile()


def ask(question):
    print(f"\nUser: {question}")
    result = app.invoke({"messages": [HumanMessage(content=question)]})
    for message in result["messages"]:
        if getattr(message, "tool_calls", None):
            for call in message.tool_calls:
                print(f"  [tool call] {call['name']}({call['args']})")
    print(f"Agent: {result['messages'][-1].content}")


if __name__ == "__main__":
    ask("What is 18% of 75,000?")
    ask("What's the capital of France?")
