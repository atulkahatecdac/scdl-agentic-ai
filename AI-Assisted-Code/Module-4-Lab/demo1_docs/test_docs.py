"""Checks for Demo 1: documentation that is complete AND true.

- every public function has a docstring with Args, Returns and examples
- every example in the docstrings and README actually runs (doctest)
- the README has the sections a new developer needs
"""
import doctest
import inspect

import pytest

import shipping

PUBLIC = [f for name, f in inspect.getmembers(shipping, inspect.isfunction)
          if not name.startswith("_") and f.__module__ == shipping.__name__]


def test_module_has_a_docstring():
    assert shipping.__doc__ and shipping.__doc__.strip()


@pytest.mark.parametrize("func", PUBLIC, ids=lambda f: f.__name__)
def test_function_docstring_is_complete(func):
    doc = inspect.getdoc(func) or ""
    for part in ("Args:", "Returns:", ">>>"):
        assert part in doc, f"{func.__name__}: docstring has no {part!r}"


def test_docstring_examples_are_true():
    result = doctest.testmod(shipping)
    assert result.attempted >= len(PUBLIC)
    assert result.failed == 0


def test_readme_has_the_key_sections(target_dir):
    readme = target_dir / "README.md"
    assert readme.exists(), "no README.md yet"
    text = readme.read_text(encoding="utf-8")
    for section in ("## Usage", "## Requirements", "## Limitations"):
        assert section in text


def test_readme_examples_are_true(target_dir):
    readme = target_dir / "README.md"
    assert readme.exists(), "no README.md yet"
    result = doctest.testfile(str(readme), module_relative=False, encoding="utf-8")
    assert result.attempted > 0 and result.failed == 0
