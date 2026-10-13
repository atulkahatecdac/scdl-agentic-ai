from langchain_core.messages import ToolMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

KNOWLEDGE_BASE = {
    "langchain": "LangChain is a framework for building LLM-powered applications.",
    "lcel": "LCEL (LangChain Expression Language) lets you compose steps with the | pipe operator.",
    "widget price": "A widget costs $25 per unit.",
}


@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the numeric result."""
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except Exception as e:
        return f"Error: could not evaluate '{expression}' ({e})"


@tool
def search_knowledge_base(query: str) -> str:
    """Look up information about a topic in the internal knowledge base."""
    for key, value in KNOWLEDGE_BASE.items():
        if key in query.lower():
            return value
    return f"No information found for '{query}'."


tools = [calculator, search_knowledge_base]
tools_by_name = {t.name: t for t in tools}

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant. Use tools when needed to answer accurately."),
        ("human", "{input}"),
    ]
)

model = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)

chain = prompt | model


def run_assistant(user_request):
    print(f"\nUser: {user_request}")
    messages = prompt.invoke({"input": user_request}).to_messages()

    ai_message = model.invoke(messages)
    messages.append(ai_message)

    # If the model asked for a tool, run it and give the model the result.
    for tool_call in ai_message.tool_calls:
        selected_tool = tools_by_name[tool_call["name"]]
        result = selected_tool.invoke(tool_call["args"])
        messages.append(ToolMessage(content=result, tool_call_id=tool_call["id"]))
        print(f"  Tool used: {tool_call['name']}{tool_call['args']} -> {result}")

    if ai_message.tool_calls:
        ai_message = model.invoke(messages)

    print(f"Agent: {ai_message.content}")


if __name__ == "__main__":
    run_assistant("What is 25% of 64,000?")
    run_assistant("Explain LCEL in one line.")
    run_assistant("Find the widget price and calculate the total cost for 5 units.")
    run_assistant("What's the capital of France?")
