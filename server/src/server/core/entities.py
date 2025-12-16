from dataclasses import dataclass


@dataclass
class Thread:
    id: str
    runs: list[str]


@dataclass
class Run:
    id: str
