import chainlit as cl


@cl.on_chat_start
async def on_chat_start() -> None:
    await cl.Message(content="Hello, World!").send()
