from collections.abc import AsyncGenerator

from ag_ui.core import RunAgentInput
from ag_ui.encoder import EventEncoder
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from server.core import create_agent_service
from server.core.logger import get_logger

router = APIRouter()
logger = get_logger(__name__)


@router.post("/run")
async def run_agent(input_data: RunAgentInput) -> StreamingResponse:
    logger.info("/run %s", input_data)

    encoder = EventEncoder()
    agent_service = create_agent_service()

    async def event_generator() -> AsyncGenerator[str]:
        async for e in agent_service.run(input_data):
            logger.debug(e)
            yield encoder.encode(e)  # ty: ignore[invalid-argument-type]

    return StreamingResponse(event_generator(), media_type=encoder.get_content_type())
