from agents import Agent, Runner
from dotenv import load_dotenv

load_dotenv()

task = "Summarize: 'Sales rose 12% in Q3, driven by strong demand in the EU region.'"


def level_1_llm():
    """Level 1: a bare LLM call, no application logic around it."""
    agent = Agent(name="Bare LLM", model="gpt-4o-mini")
    return Runner.run_sync(agent, task).final_output


def level_2_llm_application():
    """Level 2: an application crafts the prompt + context around the LLM."""
    agent = Agent(
        name="Business Analyst",
        model="gpt-4o-mini",
        instructions="You are a business analyst. Respond in one sentence.",
    )
    return Runner.run_sync(agent, task).final_output


def level_3_workflow():
    """Level 3: multiple predefined steps, fixed in advance (mocked here)."""
    extracted = "Sales rose 12% in Q3, EU demand strong."
    summarized = f"Summary: {extracted}"
    return summarized


def level_4_agent():
    """Level 4: dynamic decisions + tools + state (mocked decision logic)."""
    needs_translation = True  # a real agent would decide this dynamically
    result = level_3_workflow()
    if needs_translation:
        result += " (would call a translate tool here)"
    return result


def level_5_multi_agent():
    """Level 5: multiple collaborating agents (mocked hand-off)."""
    analysis = level_4_agent()
    review = f"Reviewed & approved: {analysis}"
    return review


if __name__ == "__main__":
    print("Level 1 - LLM:", level_1_llm())
    print("Level 2 - LLM Application:", level_2_llm_application())
    print("Level 3 - AI Workflow:", level_3_workflow())
    print("Level 4 - AI Agent:", level_4_agent())
    print("Level 5 - Multi-Agent System:", level_5_multi_agent())
