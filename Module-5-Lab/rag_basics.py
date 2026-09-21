import os

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

load_dotenv()

DOCUMENTS_DIR = os.path.join(os.path.dirname(__file__), "documents")

# 1. Load the source documents.
documents = []
for filename in sorted(os.listdir(DOCUMENTS_DIR)):
    path = os.path.join(DOCUMENTS_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        documents.append(Document(page_content=f.read(), metadata={"source": path}))

# 2. Split into chunks small enough for focused embeddings.
splitter = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50)
chunks = splitter.split_documents(documents)
print(f"Loaded {len(documents)} document(s), split into {len(chunks)} chunks.")

# 3. Embed each chunk and store it in a local, in-memory ChromaDB collection.
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings, collection_name="rag-basics-demo")

model = ChatOpenAI(model="gpt-4o-mini")


def answer(question):
    # 4. Retrieve the most relevant chunks for the question.
    print(f"\nQuestion: {question}")
    relevant_chunks = vectorstore.similarity_search(question, k=3)
    context = "\n\n".join(chunk.page_content for chunk in relevant_chunks)

    # 5. Ground the LLM's answer in the retrieved context only.
    response = model.invoke(
        "Answer the question using ONLY the context below. "
        "If the context doesn't contain the answer, say you don't know.\n\n"
        f"Context:\n{context}\n\nQuestion: {question}"
    )
    print(f"Answer: {response.content}")


if __name__ == "__main__":
    answer("How many days of annual leave do employees get?")
    answer("How long does standard shipping take?")
    answer("What's the CEO's name?")
