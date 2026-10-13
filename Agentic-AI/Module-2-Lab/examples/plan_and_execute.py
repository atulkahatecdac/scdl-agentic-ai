import json

from agents import Agent, Runner
from dotenv import load_dotenv

load_dotenv()


def execute_task(task):
    """Mocked executor - a real system would call tools per task here."""
    return f"done: {task}"


goal = "Prepare a plan for losing 10 kg weight in 1 year. Age: 40, Weight: 85 kg, Height: 5 feet 6 inches, No major health related problems."

planner = Agent(
    name="Planner",
    model="gpt-4o-mini",
    instructions=(
        "Break the user's goal into 3-5 short, ordered tasks. "
        'Reply with ONLY a JSON list of strings, e.g. ["task 1", "task 2"].'
    ),
)
result = Runner.run_sync(planner, goal)
plan = json.loads(result.final_output)

print("Plan:")
for task in plan:
    print(" -", task)

print("\nExecuting:")
for task in plan:
    print(" ", execute_task(task))
