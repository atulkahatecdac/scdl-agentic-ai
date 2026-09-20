from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, Field
from dotenv import load_dotenv

load_dotenv()


class CalculatorInput(BaseModel):
    expression: str = Field(description="A math expression to evaluate, e.g. '12 * 4'")


@tool(args_schema=CalculatorInput)
def calculator(expression: str) -> str:
    """Evaluate a mathematical expression and return the numeric result."""
    try:
        return str(eval(expression, {"__builtins__": {}}))
    except Exception as e:
        return f"Error: could not evaluate '{expression}' ({e})"


model = ChatOpenAI(model="gpt-4o-mini").bind_tools([calculator])

if __name__ == "__main__":
    # This question needs the tool, so we expect the model to request a tool call.
    response = model.invoke("What is 128 divided by 4?")
    print("Question: What is 128 divided by 4?")
    print("Tool calls requested:", response.tool_calls)

    # This question doesn't need the tool, so we expect no tool call.
    response = model.invoke("What color is the sky?")
    print("\nQuestion: What color is the sky?")
    print("Tool calls requested:", response.tool_calls)
    print("Direct answer:", response.content)
