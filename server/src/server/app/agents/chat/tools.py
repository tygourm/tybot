from langchain.tools import tool
from langchain_tavily import TavilyCrawl, TavilyExtract, TavilySearch

from server.core.settings import settings

crawl = TavilyCrawl(tavily_api_key=settings.tavily_api_key)
search = TavilySearch(tavily_api_key=settings.tavily_api_key)
extract = TavilyExtract(tavily_api_key=settings.tavily_api_key)


@tool(parse_docstring=True)
def add(a: float, b: float) -> float:
    """Add two numbers.

    Args:
        a (float): The first number.
        b (float): The second number.

    Returns:
        float: The sum of the two numbers.
    """
    return a + b


@tool(parse_docstring=True)
def sub(a: float, b: float) -> float:
    """Subtract two numbers.

    Args:
        a (float): The first number.
        b (float): The second number.

    Returns:
        float: The difference between the two numbers.
    """
    return a - b


@tool(parse_docstring=True)
def mul(a: float, b: float) -> float:
    """Multiply two numbers.

    Args:
        a (float): The first number.
        b (float): The second number.

    Returns:
        float: The product of the two numbers.
    """
    return a * b


@tool(parse_docstring=True)
def div(a: float, b: float) -> float:
    """Divide two numbers.

    Args:
        a (float): The first number.
        b (float): The second number.

    Returns:
        float: The quotient of the two numbers.
    """
    return a / b


chat_toolkit = [crawl, search, extract, add, sub, mul, div]
