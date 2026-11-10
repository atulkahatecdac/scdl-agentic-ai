"""Checks for Demo 1. These encode the requirements from the strong prompt."""
import pytest

from bonus import calculate_bonus


@pytest.mark.parametrize(
    "rating, expected",
    [("outstanding", 120000.0), ("exceeds", 60000.0), ("meets", 30000.0), ("below", 0.0)],
)
def test_bonus_for_each_rating(rating, expected):
    assert calculate_bonus(600000, rating) == expected


def test_rating_ignores_case_and_spaces():
    assert calculate_bonus(600000, "  Exceeds ") == 60000.0


def test_bonus_is_capped():
    assert calculate_bonus(5_000_000, "outstanding") == 200000.0


def test_result_is_rounded_to_two_decimals():
    assert calculate_bonus(333333.33, "meets") == 16666.67


@pytest.mark.parametrize("salary", [0, -1000])
def test_non_positive_salary_is_rejected(salary):
    with pytest.raises(ValueError):
        calculate_bonus(salary, "meets")


@pytest.mark.parametrize("salary", ["600000", None, True])
def test_non_numeric_salary_is_rejected(salary):
    with pytest.raises(TypeError):
        calculate_bonus(salary, "meets")


def test_unknown_rating_lists_valid_options():
    with pytest.raises(ValueError, match="outstanding, exceeds, meets, below"):
        calculate_bonus(600000, "superb")
