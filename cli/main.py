from typing import Annotated

import typer

from cli.core.settings import settings

app = typer.Typer(help=f"cli {settings.VERSION}")


@app.command()
def hello(name: Annotated[str, typer.Argument()] = "World") -> None:
    typer.echo(f"Hello, {name}!")


@app.command()
def goodbye(name: Annotated[str, typer.Argument()] = "World") -> None:
    typer.echo(f"Goodbye, {name}!")


if __name__ == "__main__":
    app()
