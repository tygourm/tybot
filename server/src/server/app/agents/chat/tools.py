from langchain.tools import tool
from langchain_tavily import TavilyCrawl, TavilyExtract, TavilySearch

from server.core.settings import settings

crawl = TavilyCrawl(tavily_api_key=settings.tavily_api_key)
search = TavilySearch(tavily_api_key=settings.tavily_api_key)
extract = TavilyExtract(tavily_api_key=settings.tavily_api_key)


@tool
def add(a: float, b: float) -> float:
    """Add two numbers."""
    return a + b


@tool
def sub(a: float, b: float) -> float:
    """Subtract two numbers."""
    return a - b


@tool
def mul(a: float, b: float) -> float:
    """Multiply two numbers."""
    return a * b


@tool
def div(a: float, b: float) -> float:
    """Divide two numbers."""
    return a / b


chat_toolkit = [crawl, search, extract, add, sub, mul, div]
