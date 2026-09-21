import os

from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

DOCUMENTS_DIR = os.path.join(os.path.dirname(__file__), "..", "documents")

documents = []
for filename in sorted(os.listdir(DOCUMENTS_DIR)):
    path = os.path.join(DOCUMENTS_DIR, filename)
    with open(path, "r", encoding="utf-8") as f:
        documents.append(Document(page_content=f.read(), metadata={"source": path}))

chunks = RecursiveCharacterTextSplitter(chunk_size=400, chunk_overlap=50).split_documents(documents)
embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = Chroma.from_documents(chunks, embeddings, collection_name="rag-qa-demo")

# Effective RAG prompts: tell the LLM the retrieved context IS the source of truth,
# ask it to answer only from that context, and tell it not to invent an answer
# when the context is insufficient.
prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "Answer the user's question using only the information in the context below. "
            "If the context does not contain enough information to answer, say so plainly "
            "instead of guessing.\n\nContext:\n{context}",
        ),
        ("human", "{question}"),
    ]
)
model = ChatOpenAI(model="gpt-4o-mini")
chain = prompt | model


def rag_answer(question):
    print(f"\nQuestion: {question}")
    relevant_chunks = vectorstore.similarity_search(question, k=3)
    context = "\n\n".join(chunk.page_content for chunk in relevant_chunks)

    response = chain.invoke({"context": context, "question": question})
    print(f"Answer: {response.content}")


if __name__ == "__main__":
    rag_answer("What's the restocking fee on opened electronics?")
    rag_answer("How much does the Enterprise Support Plan cost per year?")
    rag_answer("What's the company's stock ticker symbol?")  # not in the documents
