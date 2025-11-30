from collections.abc import AsyncGenerator

from ag_ui.core import RunAgentInput
from ag_ui.encoder import EventEncoder
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from server.core.injector import injector

router = APIRouter()


@router.post("/run")
def run_agent(body: RunAgentInput) -> StreamingResponse:
    encoder = EventEncoder()
    run_agent = injector.run_chat_agent()
    create_thread = injector.create_thread()

    async def event_stream() -> AsyncGenerator[str, None]:
        async for event in run_agent(body):
            yield encoder.encode(event)  # ty: ignore[invalid-argument-type]

    create_thread(body.thread_id)
    return StreamingResponse(event_stream(), media_type=encoder.get_content_type())
