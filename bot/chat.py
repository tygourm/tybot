import os
import shutil
import uuid
from pathlib import Path

import chainlit as cl
from openai import AsyncOpenAI

from bot.core.settings import settings

if os.environ.get("CHAINLIT_AUTH_SECRET"):

    @cl.password_auth_callback
    async def password_auth_callback(username: str) -> cl.User | None:
        return cl.User(identifier=str(uuid.uuid4()), display_name=username)


@cl.on_message
async def on_message() -> None:
    client = AsyncOpenAI(
        api_key=settings.OLLAMA_API_KEY,
        base_url=settings.OLLAMA_BASE_URL,
    )

    response = cl.Message("")
    messages = [
        {
            "role": "system",
            "content": "Tu es tybot, un assistant serviable développé par tygourm, un ingénieur Brestois.",  # noqa:E501 line-too-long
        },
        *cl.chat_context.to_openai(),
    ]

    async with cl.Step() as step:
        step.input = messages
        stream = await client.chat.completions.create(
            messages=messages,
            model=settings.OLLAMA_MODEL,
            stream=True,
        )
        async for chunk in stream:
            if token := chunk.choices[0].delta.content:
                await response.stream_token(token)
        await response.update()


@cl.on_chat_resume
async def on_chat_resume() -> None:
    pass  # Enable chat resume


@cl.on_chat_end
async def on_chat_end() -> None:
    if (files := Path(f".files/{cl.user_session.get('id')}")).exists():
        shutil.rmtree(files)
