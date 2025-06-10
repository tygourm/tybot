import os
import shutil
import uuid
from pathlib import Path

import chainlit as cl
from openai import AsyncOpenAI

from src.bot.core.config import chat_settings, starters
from src.bot.core.settings import settings

if os.environ.get("CHAINLIT_AUTH_SECRET"):

    @cl.password_auth_callback
    async def password_auth_callback(username: str) -> cl.User | None:
        return cl.User(identifier=str(uuid.uuid4()), display_name=username)


@cl.on_message
async def on_message() -> None:
    user_settings = cl.user_session.get("chat_settings")
    client = AsyncOpenAI(
        api_key=settings.OLLAMA_API_KEY,
        base_url=settings.OLLAMA_BASE_URL,
    )

    response = cl.Message("")
    messages = [
        {"role": "system", "content": user_settings["prompt"]},
        *cl.chat_context.to_openai(),
    ]

    async with cl.Step() as step:
        step.input = messages

        if user_settings["stream"]:
            stream = await client.chat.completions.create(
                messages=messages,
                model=settings.OLLAMA_LLMS,
                stream=True,
                temperature=user_settings["temperature"],
            )
            async for chunk in stream:
                if token := chunk.choices[0].delta.content:
                    await response.stream_token(token)
            await response.update()

        else:
            chat_completion = await client.chat.completions.create(
                messages=messages,
                model=settings.OLLAMA_LLMS,
                temperature=user_settings["temperature"],
            )
            response.content = chat_completion.choices[0].message.content
            await response.send()


@cl.on_chat_start
async def on_chat_start() -> None:
    await send_chat_settings()


@cl.on_chat_resume
async def on_chat_resume() -> None:
    await send_chat_settings()


@cl.set_starters
async def set_starters() -> list[cl.Starter]:
    return [cl.Starter(**starter) for starter in starters]


@cl.on_chat_end
async def on_chat_end() -> None:
    if (files := Path(f".files/{cl.user_session.get('id')}")).exists():
        shutil.rmtree(files)


async def send_chat_settings() -> None:
    await cl.ChatSettings(
        [
            cl.input_widget.Switch(**chat_settings["stream"]),
            cl.input_widget.TextInput(**chat_settings["prompt"]),
            cl.input_widget.Slider(**chat_settings["temperature"]),
        ],
    ).send()
