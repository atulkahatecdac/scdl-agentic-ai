from agents import Agent, Runner, function_tool
from dotenv import load_dotenv

load_dotenv()

question = "What is 4,821 multiplied by 673?"

print("Without tools (LLM can only generate text):")
no_tools_agent = Agent(name="No-Tools Agent", model="gpt-4o-mini")
result = Runner.run_sync(no_tools_agent, question)
print(" ", result.final_output)


@function_tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the exact numeric result."""
    return str(eval(expression, {"__builtins__": {}}))


print("\nWith tools (LLM can act, not just generate):")
tool_agent = Agent(
    name="Calculator Agent",
    model="gpt-4o-mini",
    tools=[calculator],
)
result = Runner.run_sync(tool_agent, question)

for item in result.new_items:
    if item.type == "tool_call_item":
        print(f"  [tool call] calculator{item.raw_item.arguments}")

print(" ", result.final_output)
