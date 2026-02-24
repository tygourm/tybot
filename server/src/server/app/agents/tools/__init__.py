from .geo import generate_random_coordinates
from .math import add, sub

geo_toolkit = [generate_random_coordinates]
math_toolkit = [add, sub]

__all__ = ["geo_toolkit", "math_toolkit"]
