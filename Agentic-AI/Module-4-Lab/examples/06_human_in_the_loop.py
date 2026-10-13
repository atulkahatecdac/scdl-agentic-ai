from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.prebuilt import ToolNode
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()


@tool
def send_refund(order_id: str, amount: float) -> str:
    """Issue a refund for an order. This is a sensitive, irreversible action."""
    return f"Refund of ${amount} issued for order {order_id}."


tools = [send_refund]
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

checkpointer = MemorySaver()
# interrupt_before pauses the graph right before the "tools" node runs, so a human
# can review the proposed refund before it actually executes.
app = graph.compile(checkpointer=checkpointer, interrupt_before=["tools"])

config = {"configurable": {"thread_id": "refund-request-1"}}

if __name__ == "__main__":
    request = "Refund order #4471 for $89.99, the customer was double-charged."
    print(f"User: {request}")
    app.invoke({"messages": [HumanMessage(content=request)]}, config=config)

    pending_state = app.get_state(config)
    proposed_call = pending_state.values["messages"][-1].tool_calls[0]
    print(f"\n[Paused for approval] Agent wants to call: {proposed_call['name']}({proposed_call['args']})")

    approval = input("Approve this refund? (y/n): ").strip().lower()
    if approval == "y":
        result = app.invoke(None, config=config)  # resume execution from the checkpoint
        print(f"Agent: {result['messages'][-1].content}")
    else:
        print("Refund rejected. Nothing was executed.")
