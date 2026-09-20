from agents import Agent, Runner
from dotenv import load_dotenv

load_dotenv()

coder = Agent(name="Coder", model="gpt-4o-mini")
reviewer = Agent(name="Reviewer", model="gpt-4o-mini")

task = "Write a Python function that returns the nth Fibonacci number."

draft = Runner.run_sync(coder, task).final_output
print("Draft:\n", draft)

critique = Runner.run_sync(
    reviewer, f"Review this code for bugs or inefficiency. Be brief.\n\n{draft}"
).final_output
print("\nCritique:\n", critique)

revised = Runner.run_sync(
    coder, f"Improve the code based on this critique.\n\nCode:\n{draft}\n\nCritique:\n{critique}"
).final_output
print("\nRevised:\n", revised)
