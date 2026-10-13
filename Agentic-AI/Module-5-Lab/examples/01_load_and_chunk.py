import os

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

DOCUMENTS_DIR = os.path.join(os.path.dirname(__file__), "..", "documents")


def load_documents():
    documents = []
    for filename in sorted(os.listdir(DOCUMENTS_DIR)):
        path = os.path.join(DOCUMENTS_DIR, filename)
        with open(path, "r", encoding="utf-8") as f:
            documents.append(Document(page_content=f.read(), metadata={"source": path}))
    return documents


if __name__ == "__main__":
    documents = load_documents()
    print(f"Loaded {len(documents)} document(s).")

    # Chunks that are too small lose context; too large hurts retrieval precision.
    # Start with a simple recursive splitter and a modest chunk size.
    splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)
    chunks = splitter.split_documents(documents)
    print(f"Split into {len(chunks)} chunks.\n")

    for i, chunk in enumerate(chunks[:5]):
        source = os.path.basename(chunk.metadata.get("source", "?"))
        print(f"--- chunk {i} (from {source}, {len(chunk.page_content)} chars) ---")
        print(chunk.page_content)
        print()
