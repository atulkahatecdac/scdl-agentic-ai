import os

from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

PERSIST_DIR = os.path.join(os.path.dirname(__file__), "..", "chroma_db")
COLLECTION_NAME = "module5-lab"

# Reconnects to the ChromaDB collection built by 02_build_vector_store.py --
# run that script first if this prints no results.
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma(
    collection_name=COLLECTION_NAME,
    embedding_function=embeddings,
    persist_directory=PERSIST_DIR,
)


def test_retrieval(query):
    print(f"\nQuery: {query}")
    results = vectorstore.similarity_search_with_score(query, k=3)
    if not results:
        print("  No results -- did you run 02_build_vector_store.py first?")
    for doc, score in results:
        source = os.path.basename(doc.metadata.get("source", "?"))
        print(f"  score={score:.4f}  source={source}")
        print(f"    {doc.page_content[:150].strip()}...")


if __name__ == "__main__":
    test_retrieval("How many days of sick leave are employees entitled to?")
    test_retrieval("What is the price of the Gadget Pro?")
    test_retrieval("Tell me about the company's founding history.")
