from agents import Agent, Runner, function_tool
from dotenv import load_dotenv

load_dotenv()


@function_tool
def add(a: float, b: float) -> float:
    """Add two numbers together."""
    return a + b


agent = Agent(
    name="Lab Agent",
    instructions="You are a helpful assistant. Use tools when needed to answer accurately.",
    tools=[add],
    model="gpt-4o-mini",
)

question = "What is 482 plus 917? And also tell me a funny joke about Mathematicians."
result = Runner.run_sync(agent, question)
print(result.final_output)
