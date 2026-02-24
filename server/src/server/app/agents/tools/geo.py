import secrets

from server.core.logger import get_logger

logger = get_logger(__name__)


def generate_random_coordinates(
    n: int,
    min_lat: float | None,
    max_lat: float | None,
    min_lon: float | None,
    max_lon: float | None,
) -> list[dict[str, float]]:
    """Generate n random coordinates.

    Args:
        n: The number of coordinates to generate.
        min_lat: The minimum latitude.
        max_lat: The maximum latitude.
        min_lon: The minimum longitude.
        max_lon: The maximum longitude.

    Returns:
        A list of n random coordinates.

    """
    return [
        {
            "lat": secrets.SystemRandom().uniform(min_lat or -90, max_lat or 90),
            "lon": secrets.SystemRandom().uniform(min_lon or -180, max_lon or 180),
        }
        for _ in range(n)
    ]
