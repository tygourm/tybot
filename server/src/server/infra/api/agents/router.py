from collections.abc import AsyncGenerator

from ag_ui.core import RunAgentInput
from ag_ui.encoder import EventEncoder
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from server.core.injector import create_agent_service

router = APIRouter()


@router.post("/run")
def run_agent(input_data: RunAgentInput) -> StreamingResponse:
    encoder = EventEncoder()
    agent_service = create_agent_service()

    async def event_generator() -> AsyncGenerator[str]:
        async for e in agent_service.run(input_data):
            yield encoder.encode(e)  # ty: ignore[invalid-argument-type]

    return StreamingResponse(event_generator(), media_type=encoder.get_content_type())
