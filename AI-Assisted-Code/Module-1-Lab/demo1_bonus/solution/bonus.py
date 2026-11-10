"""Annual bonus calculator for the HR portal.

Reference answer for Demo 1: what the strong prompt produces after review.
"""

BONUS_RATES = {
    "outstanding": 0.20,
    "exceeds": 0.10,
    "meets": 0.05,
    "below": 0.0,
}
MAX_BONUS = 200_000.0


def calculate_bonus(salary: float, rating: str) -> float:
    """Return the annual bonus for an employee.

    Args:
        salary: Annual salary in rupees. Must be a positive int or float.
        rating: Performance rating, one of "outstanding", "exceeds",
            "meets" or "below". Case and surrounding spaces are ignored.

    Returns:
        The bonus in rupees, rounded to 2 decimals and capped at 200,000.

    Raises:
        TypeError: If salary is not a number (bool is rejected too).
        ValueError: If salary is not positive or the rating is unknown.

    >>> calculate_bonus(600000, "exceeds")
    60000.0
    """
    if isinstance(salary, bool) or not isinstance(salary, (int, float)):
        raise TypeError("salary must be a number")
    if salary <= 0:
        raise ValueError("salary must be positive")
    if not isinstance(rating, str):
        raise TypeError("rating must be a string")

    key = rating.strip().lower()
    if key not in BONUS_RATES:
        valid = ", ".join(BONUS_RATES)
        raise ValueError(f"unknown rating {rating!r}; expected one of: {valid}")

    bonus = salary * BONUS_RATES[key]
    return round(min(bonus, MAX_BONUS), 2)


if __name__ == "__main__":
    for r in ("outstanding", "exceeds", "meets", "below"):
        print(f"{r:<12} {calculate_bonus(750000, r):>10,.2f}")
