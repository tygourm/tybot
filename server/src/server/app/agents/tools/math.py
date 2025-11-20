from langchain_core.tools import tool


@tool
async def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b


@tool
async def sub(a: int, b: int) -> int:
    """Subtract two numbers."""
    return a - b
