from dataclasses import dataclass


@dataclass
class ThreadEntity:
    id: str
    runs: list[str]


@dataclass
class RunEntity:
    id: str
