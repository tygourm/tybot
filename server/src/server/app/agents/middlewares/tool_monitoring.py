from collections.abc import Awaitable, Callable

from langchain.agents.middleware import AgentMiddleware
from langchain.messages import ToolMessage
from langchain.tools.tool_node import ToolCallRequest
from langgraph.types import Command

from server.core.logger import get_logger

logger = get_logger(__name__)


class ToolMonitoringMiddleware(AgentMiddleware):
    async def awrap_tool_call(
        self,
        request: ToolCallRequest,
        handler: Callable[[ToolCallRequest], Awaitable[ToolMessage | Command]],
    ) -> ToolMessage | Command:
        logger.info(
            "Running tool %s(%s)",
            request.tool_call["name"],
            request.tool_call["args"],
        )
        try:
            result = await handler(request)
        except Exception as e:
            logger.exception("Error during tool call")
            return ToolMessage(
                tool_call_id=request.tool_call["id"],
                status="error",
                content=f"Error: {e}",
            )
        else:
            logger.info(
                "Tool %s(%s) returned %s",
                request.tool_call["name"],
                request.tool_call["args"],
                result,
            )
            return result
