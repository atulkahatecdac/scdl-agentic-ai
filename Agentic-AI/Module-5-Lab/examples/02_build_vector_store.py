import os

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

DOCUMENTS_DIR = os.path.join(os.path.dirname(__file__), "..", "documents")
PERSIST_DIR = os.path.join(os.path.dirname(__file__), "..", "chroma_db")
COLLECTION_NAME = "module5-lab"


def build_vector_store():
    documents = []
    for filename in sorted(os.listdir(DOCUMENTS_DIR)):
        path = os.path.join(DOCUMENTS_DIR, filename)
        with open(path, "r", encoding="utf-8") as f:
            documents.append(Document(page_content=f.read(), metadata={"source": path}))

    splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    # persist_directory writes the collection to disk so later scripts (and later
    # runs of this one) can reconnect to it without re-embedding every chunk.
    vectorstore = Chroma.from_documents(
        chunks,
        embeddings,
        collection_name=COLLECTION_NAME,
        persist_directory=PERSIST_DIR,
    )
    return vectorstore, len(chunks)


if __name__ == "__main__":
    vectorstore, chunk_count = build_vector_store()
    print(f"Stored {chunk_count} chunks in ChromaDB at '{PERSIST_DIR}' (collection: {COLLECTION_NAME}).")
