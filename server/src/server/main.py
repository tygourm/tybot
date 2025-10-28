from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.staticfiles import StaticFiles
from server.core.settings import settings
from starlette.responses import HTMLResponse, RedirectResponse
from uvicorn import run

app = FastAPI(
    debug=settings.debug,
    title=settings.title,
    version=settings.version,
    docs_url=None,
    redoc_url=None,
)
app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/")
def root() -> RedirectResponse:
    return RedirectResponse(url="/docs")


@app.get("/docs")
def swagger_ui_html() -> HTMLResponse:
    return get_swagger_ui_html(
        title=app.title,
        swagger_js_url="/static/swagger.js",
        swagger_css_url="/static/swagger.css",
        swagger_favicon_url="/static/favicon.svg",
        openapi_url=app.openapi_url or "/openapi.json",
    )


def main() -> None:
    run(
        "server.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.reload,
        workers=settings.workers,
    )


if __name__ == "__main__":
    main()
