from agents import Agent, Runner, function_tool
from dotenv import load_dotenv

load_dotenv()


@function_tool
def get_weather(city: str) -> str:
    """Get the current weather for a city."""
    return f"{city}: 22C, partly cloudy"


agent = Agent(
    name="Weather Agent",
    model="gpt-4o-mini",
    tools=[get_weather],
)

question = "Should I bring an umbrella in Paris today?"
result = Runner.run_sync(agent, question)

print("Thought -> Action -> Observation:")
for item in result.new_items:
    if item.type == "tool_call_item":
        print(f"  Action: {item.raw_item.name}{item.raw_item.arguments}")
    elif item.type == "tool_call_output_item":
        print(f"  Observation: {item.output}")

print(f"\nThought -> Answer: {result.final_output}")
