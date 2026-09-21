import json
import os

from langchain_openai import ChatOpenAI
from langchain_core.messages import BaseMessage, HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv()

model = ChatOpenAI(model="gpt-4o-mini")

LONG_TERM_MEMORY_FILE = os.path.join(os.path.dirname(__file__), "user_memory.json")


def load_long_term_memory() -> dict:
    """Long-term memory: survives across separate runs of this script (a file on
    disk here; a database in a real application)."""
    if os.path.exists(LONG_TERM_MEMORY_FILE):
        with open(LONG_TERM_MEMORY_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_long_term_memory(memory: dict) -> None:
    with open(LONG_TERM_MEMORY_FILE, "w", encoding="utf-8") as f:
        json.dump(memory, f, indent=2)


def chat_with_memory():
    long_term_memory = load_long_term_memory()
    known_facts = ", ".join(f"{k}: {v}" for k, v in long_term_memory.items()) or "nothing yet"

    # Short-term memory: the running message list, scoped to THIS session only.
    messages: list[BaseMessage] = [
        SystemMessage(
            content=f"You are a helpful assistant. What you already know about this user: {known_facts}."
        )
    ]

    def say(user_input):
        print(f"\nUser: {user_input}")
        messages.append(HumanMessage(content=user_input))
        response = model.invoke(messages)
        messages.append(response)
        print(f"Agent: {response.content}")

    say("I'm planning a trip to Kerala next month.")
    say("What destination did I just mention?")  # answered from short-term (in-session) memory

    # Something worth remembering beyond this session goes into long-term memory.
    long_term_memory["preferred_destination"] = "Kerala"
    save_long_term_memory(long_term_memory)
    print(f"\n[Saved to long-term memory: {long_term_memory}]")


if __name__ == "__main__":
    chat_with_memory()
    print("\nRun this script again -- the system prompt will now include what was saved above.")
