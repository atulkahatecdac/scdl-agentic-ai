from langgraph.graph import StateGraph, START, END, MessagesState
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini")


def call_model(state: MessagesState) -> dict:
    """The only node in this graph: passes the message history to the LLM
    and returns its reply as a state update."""
    response = model.invoke(state["messages"])
    return {"messages": [response]}


# The smallest possible LangGraph: one state schema (MessagesState), one node,
# and direct edges connecting START -> agent -> END.
graph = StateGraph(MessagesState)
graph.add_node("agent", call_model)
graph.add_edge(START, "agent")
graph.add_edge("agent", END)

app = graph.compile()


def ask(question):
    print(f"\nUser: {question}")
    result = app.invoke({"messages": [HumanMessage(content=question)]})
    print(f"Agent: {result['messages'][-1].content}")


if __name__ == "__main__":
    ask("What is LangGraph, in one sentence?")
    ask("How is a graph different from a chain?")
