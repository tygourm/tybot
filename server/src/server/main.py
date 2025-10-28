from fastapi import FastAPI
from uvicorn import run

app = FastAPI()


def main() -> None:
    run(app)


if __name__ == "__main__":
    main()
