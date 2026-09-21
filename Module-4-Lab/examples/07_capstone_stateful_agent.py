from langgraph.graph import StateGraph, END, MessagesState
from langgraph.prebuilt import ToolNode
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

# Capstone: combines everything from examples 01-06 -- state, nodes, conditional
# edges, tool-calling loops, checkpointing concepts, and debugging -- into the
# "stateful LangGraph agent" lab described in Module 4 (state -> agent node ->
# tool node -> conditional routing -> compile/invoke).

KNOWLEDGE_BASE = {
    "refund policy": "Refunds are issued within 5-7 business days to the original payment method.",
    "shipping": "Standard shipping takes 3-5 business days; express takes 1-2 business days.",
}


@tool
def search_policy(query: str) -> str:
    """Look up company policy information relevant to a customer query."""
    for key, value in KNOWLEDGE_BASE.items():
        if key in query.lower():
            return value
    return f"No policy information found for '{query}'."


@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the numeric result."""
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except Exception as e:
        return f"Error: could not evaluate '{expression}' ({e})"


@tool
def unreliable_inventory_lookup(sku: str) -> str:
    """Look up live inventory for a SKU. Deliberately fails, to demonstrate tool error handling."""
    raise RuntimeError(f"inventory service timed out while looking up SKU '{sku}'")


tools = [search_policy, calculator, unreliable_inventory_lookup]
model = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)

# handle_tool_errors turns an exception raised inside a tool into a ToolMessage the
# LLM can reason over, instead of crashing the graph -- see Module 4's Error Handling.
tool_node = ToolNode(tools, handle_tool_errors=True)


# Step 1: state -- MessagesState is enough; this agent only needs the message history.

# Step 2: the agent node -- reasons over messages, may produce a tool call.
def agent_node(state: MessagesState) -> dict:
    response = model.invoke(state["messages"])
    return {"messages": [response]}


# Step 3: the tool node is the prebuilt ToolNode created above.

# Step 4: conditional routing between the agent and the tool node.
def tool_required(state: MessagesState) -> str:
    last_message = state["messages"][-1]
    return "tools" if getattr(last_message, "tool_calls", None) else END


graph = StateGraph(MessagesState)
graph.add_node("agent", agent_node)
graph.add_node("tools", tool_node)
graph.set_entry_point("agent")
graph.add_conditional_edges("agent", tool_required, {"tools": "tools", END: END})
graph.add_edge("tools", "agent")

# Step 5: compile and invoke.
app = graph.compile()

print("Graph structure:")
app.get_graph().print_ascii()


def run_scenario(label, question):
    print(f"\n=== {label} ===")
    print(f"User: {question}")
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
    run_scenario("No tool required", "What's the capital of France?")
    run_scenario("Single tool call", "What is 15% of 2,400?")
    run_scenario("Multiple tool calls", "What's the refund policy, and what is 3 refunds of $49.99 in total?")
    run_scenario("Tool failure", "Check live inventory for SKU WID-100.")
    run_scenario(
        "Multi-step reasoning",
        "If shipping takes up to 5 business days and I order 4 units at $25 each, "
        "what's the total cost and how many days might delivery take?",
    )
