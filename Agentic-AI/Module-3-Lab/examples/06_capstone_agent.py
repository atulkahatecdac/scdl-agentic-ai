from datetime import datetime, timedelta

from langchain_core.messages import ToolMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()

# Capstone: combines prompt templates (01), LCEL (02), structured output (03),
# and tool calling (04/05) into a single customer support agent.

KNOWLEDGE_BASE = {
    "refund policy": "Refunds are issued within 5-7 business days to the original payment method.",
    "shipping": "Standard shipping takes 3-5 business days; express takes 1-2 business days.",
    "warranty": "All products carry a 1-year manufacturer warranty.",
}


@tool
def search_knowledge_base(query: str) -> str:
    """Look up company policy information relevant to a customer query."""
    for key, value in KNOWLEDGE_BASE.items():
        if key in query.lower():
            return value
    return f"No policy information found for '{query}'."


@tool
def days_until(business_days: int) -> str:
    """Estimate the calendar date that is a number of business days from today."""
    calendar_days = int(business_days * 7 / 5)
    target = datetime.now() + timedelta(days=calendar_days)
    return target.strftime("%A, %B %d")


tools = [search_knowledge_base, days_until]
tools_by_name = {t.name: t for t in tools}

# Step 1: prompt template + tool-calling model that resolves the request.
agent_prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are a customer support agent. Use tools to find accurate policy "
            "details and give a clear, complete answer to the customer.",
        ),
        ("human", "{request}"),
    ]
)
agent_model = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)


def resolve_request(request: str) -> str:
    """Runs the tool-calling loop and returns the agent's free-text answer."""
    messages = agent_prompt.invoke({"request": request}).to_messages()

    ai_message = agent_model.invoke(messages)
    messages.append(ai_message)

    for tool_call in ai_message.tool_calls:
        selected_tool = tools_by_name[tool_call["name"]]
        result = selected_tool.invoke(tool_call["args"])
        print(f"  [tool] {tool_call['name']}({tool_call['args']}) -> {result}")
        messages.append(ToolMessage(content=result, tool_call_id=tool_call["id"]))

    if ai_message.tool_calls:
        ai_message = agent_model.invoke(messages)

    return ai_message.content


# Step 2: distill the free-text answer into a structured ticket via an LCEL chain.
class SupportTicket(BaseModel):
    """Structured record of how a support request was resolved."""

    category: str = Field(description="One of: billing, shipping, warranty, other")
    resolved: bool = Field(description="Whether the answer fully resolves the customer's request")
    summary: str = Field(description="One-sentence summary of the resolution")


summary_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "Summarize how the support request was resolved, based on the agent's answer."),
        ("human", "Customer request: {request}\n\nAgent's answer: {answer}"),
    ]
)
summary_model = ChatOpenAI(model="gpt-4o-mini").with_structured_output(SupportTicket)
summary_chain = summary_prompt | summary_model


def handle_ticket(request: str) -> None:
    print(f"\nCustomer: {request}")

    answer = resolve_request(request)
    print(f"Agent: {answer}")

    ticket = summary_chain.invoke({"request": request, "answer": answer})
    print(f"Ticket -> category={ticket.category}, resolved={ticket.resolved}, summary={ticket.summary}")


if __name__ == "__main__":
    handle_ticket("How long will a refund take if I paid by credit card?")
    handle_ticket("If I choose express shipping today, when will it arrive?")
    handle_ticket("Do you sell gift wrapping?")
