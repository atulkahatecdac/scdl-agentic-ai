from agents import Agent, Runner
from dotenv import load_dotenv

load_dotenv()

agent = Agent(
    name="Instructor Agent",
    model="gpt-4o-mini",
    instructions=(
        "You are an expert in the Indian Law. Explain legal concepts in simple "
        "language, using practical examples, avoiding jargon, and using "
        "short descriptions. Also include actual section names from Indian Law."
    ),
)

result = Runner.run_sync(agent, "I have written a book. How to ensure its copyright is not violated?")
print(result.final_output)
