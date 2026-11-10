"""AI-generated integration tests for enrollment.py (Demo 3), after review.

Service + repository + a real SQLite database, created in memory for each
test, so tests never share data.

Round 1 (the "happy" tests) was the first AI answer. Coverage showed what it
missed; round 2 was generated from the coverage report.
"""
import sqlite3

import pytest

from enrollment import EnrollmentError, EnrollmentRepository, EnrollmentService


@pytest.fixture
def service():
    conn = sqlite3.connect(":memory:")
    repo = EnrollmentRepository(conn)
    repo.add_course("PY101", "Python Basics", 2)
    repo.add_course("AI201", "Applied AI", 30)
    yield EnrollmentService(repo)
    conn.close()


# --- round 1: happy path --------------------------------------------------------
def test_happy_enroll_returns_seats_left(service):
    assert service.enroll("S1", "PY101") == 1


def test_happy_enrollment_is_stored_in_the_database(service):
    service.enroll("S1", "AI201")
    assert service.repo.is_enrolled("S1", "AI201")
    assert service.seats_left("AI201") == 29


def test_happy_drop_frees_the_seat(service):
    service.enroll("S1", "PY101")
    service.drop("S1", "PY101")
    assert service.seats_left("PY101") == 2


# --- round 2: from the coverage report ------------------------------------------
def test_unknown_course_is_rejected(service):
    with pytest.raises(EnrollmentError, match="no such course"):
        service.enroll("S1", "XX999")


def test_cannot_enroll_twice(service):
    service.enroll("S1", "PY101")
    with pytest.raises(EnrollmentError, match="already enrolled"):
        service.enroll("S1", "PY101")


def test_full_course_rejects_the_next_student(service):
    service.enroll("S1", "PY101")
    service.enroll("S2", "PY101")  # capacity 2: now full
    with pytest.raises(EnrollmentError, match="full"):
        service.enroll("S3", "PY101")
    assert service.repo.count_enrolled("PY101") == 2


def test_drop_when_not_enrolled_is_rejected(service):
    with pytest.raises(EnrollmentError, match="not enrolled"):
        service.drop("S9", "PY101")


def test_seats_left_for_unknown_course_is_a_clear_error(service):
    with pytest.raises(EnrollmentError):
        service.seats_left("XX999")
