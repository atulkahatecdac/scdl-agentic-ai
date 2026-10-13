from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


class CustomerRequest(BaseModel):
    """Structured summary of a customer support message."""

    category: str = Field(description="One of: billing, technical, account, other")
    priority: str = Field(description="One of: low, medium, high")
    summary: str = Field(description="One-sentence summary of the request")


prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "Extract structured details from the customer's message."),
        ("human", "{message}"),
    ]
)
model = ChatOpenAI(model="gpt-4o-mini").with_structured_output(CustomerRequest)

chain = prompt | model

if __name__ == "__main__":
    messages = [
        "My card was charged twice for the same order, please refund the extra amount urgently!",
        "The app crashes every time I open the reports tab.",
        "Can you tell me how to change my email address on file?",
    ]

    for message in messages:
        result = chain.invoke({"message": message})
        print(f"\nMessage: {message}")
        print(f"  Category: {result.category}")
        print(f"  Priority: {result.priority}")
        print(f"  Summary:  {result.summary}")
