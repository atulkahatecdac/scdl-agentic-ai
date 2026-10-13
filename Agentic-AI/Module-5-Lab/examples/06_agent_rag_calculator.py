import os

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.messages import BaseMessage, HumanMessage, ToolMessage
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

# Lab: a document-aware agent that combines a ChromaDB-backed retriever tool with
# a calculator tool, and lets the LLM decide which one(s) a question needs.

DOCUMENTS_DIR = os.path.join(os.path.dirname(__file__), "..", "documents")

documents = []
for filename in sorted(os.listdir(DOCUMENTS_DIR)):
    path = os.path.join(DOCUMENTS_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        documents.append(Document(page_content=f.read(), metadata={"source": path}))

chunks = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50).split_documents(documents)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings, collection_name="lab-agent-demo")


@tool
def retrieve_policy(query: str) -> str:
    """Search the company's policy and product documents for information relevant to the query."""
    results = vectorstore.similarity_search(query, k=2)
    if not results:
        return "No relevant information found in the documents."
    return "\n\n".join(doc.page_content for doc in results)


@tool
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the numeric result."""
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except Exception as e:
        return f"Error: could not evaluate '{expression}' ({e})"


tools = [retrieve_policy, calculator]
tools_by_name = {t.name: t for t in tools}
model = ChatOpenAI(model="gpt-4o-mini").bind_tools(tools)


def ask(question):
    print(f"\nUser: {question}")
    messages: list[BaseMessage] = [HumanMessage(content=question)]

    ai_message = model.invoke(messages)
    messages.append(ai_message)

    for tool_call in ai_message.tool_calls:
        selected_tool = tools_by_name[tool_call["name"]]
        result = selected_tool.invoke(tool_call["args"])
        print(f"  [tool] {tool_call['name']}({tool_call['args']}) -> {str(result)[:100]}")
        messages.append(ToolMessage(content=result, tool_call_id=tool_call["id"]))

    if ai_message.tool_calls:
        ai_message = model.invoke(messages)

    print(f"Agent: {ai_message.content}")


if __name__ == "__main__":
    ask("What's our refund policy?")  # retrieval only
    ask("What is 15% of 2,400?")  # calculator only
    ask("If I buy 3 Gadget Pro units, what's the total cost, and how long will shipping take?")  # both
    ask("What's the weather like today?")  # not answerable from the documents
