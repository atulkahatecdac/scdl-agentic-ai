from langchain_core.output_parsers import StrOutputParser
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a helpful assistant that explains things simply."),
        ("human", "Explain {topic} in exactly two sentences."),
    ]
)
model = ChatOpenAI(model="gpt-4o-mini")
parser = StrOutputParser()

# LCEL: pipe components together into a single runnable chain.
chain = prompt | model | parser

if __name__ == "__main__":
    for topic in ["LCEL", "vector databases", "prompt engineering"]:
        answer = chain.invoke({"topic": topic})
        print(f"\nTopic: {topic}")
        print(f"Answer: {answer}")
