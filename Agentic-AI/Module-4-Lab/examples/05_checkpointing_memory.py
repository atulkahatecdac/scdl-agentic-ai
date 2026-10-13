from langgraph.graph import StateGraph, START, END, MessagesState
from langgraph.checkpoint.memory import MemorySaver
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini")


def call_model(state: MessagesState) -> dict:
    response = model.invoke(state["messages"])
    return {"messages": [response]}


graph = StateGraph(MessagesState)
graph.add_node("agent", call_model)
graph.add_edge(START, "agent")
graph.add_edge("agent", END)

# A checkpointer saves state after every node, keyed by thread_id. That's what
# lets the graph "remember" earlier turns instead of starting fresh on every invoke().
checkpointer = MemorySaver()
app = graph.compile(checkpointer=checkpointer)

thread_1 = {"configurable": {"thread_id": "demo-conversation-1"}}


def ask(question, config):
    print(f"\nUser: {question}")
    result = app.invoke({"messages": [HumanMessage(content=question)]}, config=config)
    print(f"Agent: {result['messages'][-1].content}")


if __name__ == "__main__":
    ask("My name is Atul and my favourite colour is teal.", thread_1)
    ask("What's my name and favourite colour?", thread_1)  # correct only because state persisted

    thread_2 = {"configurable": {"thread_id": "demo-conversation-2"}}
    print("\n-- switching to a new thread_id --")
    ask("What's my name?", thread_2)  # different thread -> no memory of Atul
