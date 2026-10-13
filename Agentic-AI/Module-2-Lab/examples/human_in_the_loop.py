from agents import Agent, Runner
from dotenv import load_dotenv

load_dotenv()

agent = Agent(name="Ops Agent", model="gpt-4o-mini")

request = "Clean up old customer records from the database."
proposal = Runner.run_sync(
    agent,
    f"Propose ONE specific action to handle this request, in one short sentence: {request}",
).final_output

print(f"Agent proposes: {proposal}")
approval = input("Approve this action? (y/n): ").strip().lower()

if approval == "y":
    print("Executing action... done.")
else:
    print("Action rejected. Nothing was executed.")
