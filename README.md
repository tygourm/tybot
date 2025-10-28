[![CI](https://github.com/tygourm/tybot/actions/workflows/ci.yaml/badge.svg)](https://github.com/tygourm/tybot/actions/workflows/ci.yaml)

# tybot

Yet another chatbot.

## Setup

Install the dependencies.

```bash
make init
```

## Development

Run the application in development mode.

```bash
make start
```

## Production

Build the application.

```bash
make build
```

Run the application in production mode.

```bash
make serve
```

## Deployment

Build the Docker images.

```bash
make docker_build
```

Run the application in deployment mode.

```bash
make docker_serve
```

## Miscellaneous

### Cleanup

Clean the workspace.

```bash
make clean
```

Clean the Docker resources.

```bash
make docker_clean
```

### Linting / Formatting

Lint the codebase.

```bash
make check
```

Format the codebase.

```bash
make write
```
