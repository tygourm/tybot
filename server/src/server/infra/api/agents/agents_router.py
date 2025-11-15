from ag_ui.core import RunAgentInput
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from server.core.injector import injector

router = APIRouter()


@router.post("/run")
def run_agent(body: RunAgentInput) -> StreamingResponse:
    run_agent = injector.run_react_agent(body.run_id)
    return StreamingResponse(run_agent(body))
