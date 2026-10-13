from langchain_core.messages import AIMessage, HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

# PromptTemplate: a single text string with placeholders, for simple single-turn prompts.
text_prompt = PromptTemplate.from_template("Write a one-sentence tagline for a {product}.")
print("PromptTemplate output:")
print(text_prompt.format(product="reusable water bottle"))

# ChatPromptTemplate: a sequence of role-based messages, for multi-turn chat models.
chat_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a friendly {role}."),
        ("human", "{question}"),
    ]
)
messages = chat_prompt.invoke({"role": "travel guide", "question": "Best time to visit Kerala?"})

print("\nChatPromptTemplate messages:")
for message in messages.to_messages():
    print(f"  {message.type}: {message.content}")

# The 4 core message types used across LangChain chat models.
print("\nCore message types:")
print(" ", SystemMessage(content="You are concise."))
print(" ", HumanMessage(content="Summarize LangChain in one line."))
print(" ", AIMessage(content="LangChain composes prompts, models, and tools."))

model = ChatOpenAI(model="gpt-4o-mini")
response = model.invoke(messages)
print(f"\nModel response: {response.content}")
