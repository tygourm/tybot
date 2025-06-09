# tybot

Yet another chatbot.

## Prerequisites

This project uses [pnpm](https://pnpm.io) as a Node package
manager and [uv](https://docs.astral.sh/uv) as a Python package
and project manager. [Docker](https://www.docker.com) is used to
deploy the bot and the CLI in production.

## Development

### Dependencies

Install Node dependencies.

```bash
pnpm install
```

Install Python dependencies.

```bash
uv sync --all-groups --all-packages --frozen
```

Activate the Python virtual environment before continuing.

```bash
source .venv/bin/activate
```

### Frontend

Build the frontend.

```bash
pnpm run build
```

Embed the frontend built assets in the bot.

```bash
pnpm run embed
```

### Bot

```bash
# cd bot
uv run main.py
```

The bot is available at
[http://127.0.0.1:8000](http://127.0.0.1:8000).

### CLI

```bash
# cd cli
uv run main.py
```

You can run the `cli` command, and install completion.

```bash
cli --install-completion
source ~/.bashrc
```

Now, tab completion is available `cli [TAB][TAB] ✨`.

## Deployment

### Bot

Build the bot image.

```bash
docker build -f Dockerfile.bot -t tybot-bot .
```

Run the bot container.

```bash
docker run --rm -p 8000:8000 tybot-bot
```

The bot is available at
[http://localhost:8000](http://localhost:8000).

### CLI

Build the CLI image.

```bash
docker build -f Dockerfile.cli -t tybot-cli .
```

Run the CLI container.

```bash
docker run --rm -it tybot-cli /bin/bash
```

Inside of the container, you can run the `cli` command, and
install completion.

```bash
cli --install-completion
source ~/.bashrc
```

Now, tab completion is available `cli [TAB][TAB] ✨`.

### All services

All services can be deployed with `docker compose`.

```bash
docker compose up
```

You must download models from the Ollama container before you can
use the chat feature.

```bash
ollama pull gemma3:4b # llms
ollama pull nomic-embed-text:v1.5 # embeddings
```

## Miscellaneous

### Docs

This project uses
[Material for MkDocs](https://squidfunk.github.io/mkdocs-material)
as a documentation framework.

```bash
# Serve docs
mkdocs serve
```

```bash
# Build docs
mkdocs build
```

### Linting

Run Prettier and Ruff lint for the whole codebase.

```bash
pnpm run lint
```

### Formatting

Run Prettier and Ruff format for the whole codebase.

```bash
pnpm run format
```
