from datetime import datetime

from agents import Agent, Runner, function_tool
from dotenv import load_dotenv

load_dotenv()

KNOWLEDGE_BASE = {
    "langgraph": "LangGraph is a framework for building stateful, multi-step AI agents as graphs.",
    "langchain": "LangChain is a framework for building LLM-powered applications.",
    "widget price": "A widget costs $25 per unit.",
}


@function_tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the numeric result."""
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except Exception as e:
        return f"Error: could not evaluate '{expression}' ({e})"


@function_tool
def search_information(query: str) -> str:
    """Retrieve information from a knowledge source about a topic."""
    for key, value in KNOWLEDGE_BASE.items():
        if key in query.lower():
            return value
    return f"No information found for '{query}'."


@function_tool
def get_current_time() -> str:
    """Return the current date and time."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")


agent = Agent(
    name="Lab Agent",
    instructions="You are a helpful assistant. Use tools when needed to answer accurately.",
    tools=[calculator, search_information, get_current_time],
)


def run_agent(user_request):
    print(f"\nUser: {user_request}")
    result = Runner.run_sync(agent, user_request)
    print(f"Agent: {result.final_output}")


if __name__ == "__main__":
    run_agent("What is 25% of 64,000?")
    run_agent("Explain LangGraph.")
    run_agent("What time is it right now?")
    run_agent("Find the widget price and calculate the total cost for 5 units.")
    run_agent("What's the capital of France?")
