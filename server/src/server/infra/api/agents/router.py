from collections.abc import AsyncGenerator

from ag_ui.core import RunAgentInput
from ag_ui.encoder import EventEncoder
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from server.core.injector import injector

router = APIRouter()


@router.post("/run")
def run_agent(body: RunAgentInput) -> StreamingResponse:
    threads_service = injector.threads_service()
    agents_service = injector.agents_service()
    runs_service = injector.runs_service()
    encoder = EventEncoder()

    async def event_stream() -> AsyncGenerator[str, None]:
        async for event in agents_service.run(body):
            yield encoder.encode(event)  # ty: ignore[invalid-argument-type]

    threads_service.create(body.thread_id)
    runs_service.create(body.thread_id, body.run_id)
    return StreamingResponse(event_stream(), media_type=encoder.get_content_type())
