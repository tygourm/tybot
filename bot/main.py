from pathlib import Path

from chainlit.utils import mount_chainlit
from fastapi import FastAPI
from fastapi.openapi.docs import get_swagger_ui_html
from starlette.responses import FileResponse, HTMLResponse, Response

from src.bot.core.settings import settings

app = FastAPI(
    debug=settings.DEV,
    title=settings.TITLE,
    version=settings.VERSION,
    docs_url=None,
    redoc_url=None,
)


@app.get("/api-docs", include_in_schema=False)
async def docs() -> HTMLResponse:
    return get_swagger_ui_html(
        openapi_url=app.openapi_url,
        title=f"{settings.TITLE} API Docs",
        swagger_js_url="/public/docs/swagger-ui.js",
        swagger_css_url="/public/docs/swagger-ui.css",
        swagger_favicon_url="/public/build/favicon.svg",
    )


@app.get("/app-docs/{path:path}", include_in_schema=False)
async def site(path: str) -> Response:
    site_path = Path.cwd() / "public" / "site" / (path or "index.html")
    if site_path.is_file():
        return FileResponse(site_path, status_code=200)
    return Response(status_code=404)


mount_chainlit(app, "chat.py", "")


def main() -> None:
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEV,
    )


if __name__ == "__main__":
    main()
