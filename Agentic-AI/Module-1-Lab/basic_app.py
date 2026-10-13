from agents import Agent, Runner
from dotenv import load_dotenv

load_dotenv()

agent = Agent(name="Basic Agent", model="gpt-4o-mini")

result = Runner.run_sync(agent, "Explain agentic AI in simple terms.")
print(result.final_output)
