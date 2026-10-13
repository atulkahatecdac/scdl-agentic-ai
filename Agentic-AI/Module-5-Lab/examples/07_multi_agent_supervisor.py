from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini")


def research_agent(topic: str) -> str:
    """Specialized agent: gathers and organizes information on a topic."""
    response = model.invoke(f"List 3 concise, factual bullet points about: {topic}")
    return str(response.content)


def analysis_agent(research_notes: str) -> str:
    """Specialized agent: analyzes findings and draws a conclusion."""
    response = model.invoke(f"Analyze these research notes and give one key takeaway:\n\n{research_notes}")
    return str(response.content)


def writing_agent(topic: str, analysis: str) -> str:
    """Specialized agent: turns the analysis into a short, polished paragraph."""
    response = model.invoke(
        f"Write a short, polished paragraph about '{topic}' based on this analysis:\n\n{analysis}"
    )
    return str(response.content)


def supervisor(topic: str) -> str:
    """Supervisor: the entry point for every request. Delegates to each specialist
    in turn and combines their outputs into the final response."""
    print(f"\nSupervisor received request: {topic}")

    notes = research_agent(topic)
    print(f"\n[Research Agent]\n{notes}")

    analysis = analysis_agent(notes)
    print(f"\n[Analysis Agent]\n{analysis}")

    final_output = writing_agent(topic, analysis)
    print(f"\n[Writing Agent]\n{final_output}")

    return final_output


if __name__ == "__main__":
    supervisor("the benefits of remote work for small teams")
