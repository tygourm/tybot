# tybot

Yet another chatbot.

!!! note "Design principles"

    - **DRY** Don't Repeat Yourself
    - **KISS** Keep It Simple, Stupid
    - **YAGNI** You Ain't Gonna Need It
    - **SOLID** Single responsibility, Open/closed, Liskov
    substitution, Interface segregation, Dependency inversion

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

!!! tip "Python & VS Code"

    - If dependencies are not recognized in VS Code, you can run
    the command `Ctrl+Shift+P > Python: Select Interpreter` and
    select `.venv/bin/python`.
    - After updating the dependencies, you can run the command
    `Ctrl+Shift+P > Developer: Reload Window` to refresh the
    development environment.

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

!!! info "Docker CLI"

    - With `docker build`, `-f` is the name of the Dockerfile, and
    `-t` is the name (and optionally, tag) of the image. The `.`
    at the end is the path or URL to the build context (that is
    to say, the current directory).
    - With `docker run`, `--rm` automatically removes the
    container and its associated anonymous volumes when it exits,
    `-e` sets environment variables, `-p` publishes a container's
    port(s) to the host and `-it` starts an interactive shell in
    the container.

### Bot

Build the bot image.

```bash
docker build -f Dockerfile.bot -t tybot-bot .
```

Run the bot container.

```bash
docker run --rm -e HOST=0.0.0.0 -p 8000:8000 tybot-bot
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
