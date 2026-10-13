from agents import Agent, Runner, function_tool
from dotenv import load_dotenv

load_dotenv()


@function_tool
def check_inventory() -> str:
    """Check inventory for Widget-A."""
    return "Inventory: 3 units of Widget-A left."


@function_tool
def check_price() -> str:
    """Check the price of Widget-A."""
    return "Widget-A price: $25 per unit."


agent = Agent(
    name="Inventory Agent",
    model="gpt-4o-mini",
    instructions="Use tools to answer questions about Widget-A.",
    tools=[check_inventory, check_price],
)

goal = "Find out if Widget-A is in stock and how much it costs."
result = Runner.run_sync(agent, goal)

print("Agent's steps (Act & Observe):")
for item in result.new_items:
    if item.type == "tool_call_item":
        print(f"  Act: {item.raw_item.name}()")
    elif item.type == "tool_call_output_item":
        print(f"  Observe: {item.output}")

print(f"\nFinal answer: {result.final_output}")
