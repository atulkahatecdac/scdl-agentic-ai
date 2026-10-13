from langchain_core.messages import HumanMessage, SystemMessage, ToolMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

FAKE_SEARCH_RESULTS = {
    "langgraph": "LangGraph is a library for building stateful, multi-step agents as graphs.",
    "rag": "RAG (Retrieval-Augmented Generation) combines document retrieval with LLM generation.",
}


@tool
def web_search(query: str) -> str:
    """Search the web for up-to-date information about a topic."""
    for key, value in FAKE_SEARCH_RESULTS.items():
        if key in query.lower():
            return value
    return f"No search results found for '{query}'."


tools_by_name = {web_search.name: web_search}
model = ChatOpenAI(model="gpt-4o-mini").bind_tools([web_search])


def ask(question):
    print(f"\nUser: {question}")
    messages = [
        SystemMessage(content="Answer using the web_search tool when you need current facts."),
        HumanMessage(content=question),
    ]

    # Step 1: model reasons about the request and may decide it needs a tool.
    ai_message = model.invoke(messages)
    messages.append(ai_message)

    if not ai_message.tool_calls:
        print(f"Assistant (no tool needed): {ai_message.content}")
        return

    # Step 2: execute each requested tool call, logging what happens for debugging.
    for tool_call in ai_message.tool_calls:
        print(f"  [log] model requested tool '{tool_call['name']}' with args {tool_call['args']}")
        try:
            selected_tool = tools_by_name[tool_call["name"]]
            result = selected_tool.invoke(tool_call["args"])
        except Exception as e:
            result = f"Tool failed: {e}"
            print(f"  [log] tool error: {e}")

        messages.append(ToolMessage(content=result, tool_call_id=tool_call["id"]))
        print(f"  [log] tool result: {result}")

    # Step 3: model uses the tool result(s) to produce a grounded final answer.
    final_message = model.invoke(messages)
    print(f"Assistant: {final_message.content}")


if __name__ == "__main__":
    ask("What is LangGraph used for?")
    ask("Explain RAG in one sentence.")
    ask("What's 2 + 2?")
