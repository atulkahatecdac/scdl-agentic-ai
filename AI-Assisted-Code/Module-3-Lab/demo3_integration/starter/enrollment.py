"""Course enrollment: a repository (SQLite) and a service on top of it.

Demo 3: generate integration tests that run the service against a real
(in-memory) database, then use coverage to find what they miss - see PROMPT.md.
"""
import sqlite3

SCHEMA = """
CREATE TABLE IF NOT EXISTS courses (code TEXT PRIMARY KEY, title TEXT NOT NULL, capacity INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS enrollments (
    student_id TEXT NOT NULL,
    course_code TEXT NOT NULL REFERENCES courses(code),
    PRIMARY KEY (student_id, course_code)
);
"""


class EnrollmentError(Exception):
    pass


class EnrollmentRepository:
    def __init__(self, conn: sqlite3.Connection):
        self.conn = conn
        conn.executescript(SCHEMA)

    def add_course(self, code, title, capacity):
        self.conn.execute("INSERT INTO courses VALUES (?, ?, ?)", (code, title, capacity))

    def get_course(self, code):
        row = self.conn.execute("SELECT code, title, capacity FROM courses WHERE code = ?", (code,)).fetchone()
        return None if row is None else {"code": row[0], "title": row[1], "capacity": row[2]}

    def count_enrolled(self, code):
        return self.conn.execute("SELECT COUNT(*) FROM enrollments WHERE course_code = ?", (code,)).fetchone()[0]

    def is_enrolled(self, student_id, code):
        return self.conn.execute(
            "SELECT 1 FROM enrollments WHERE student_id = ? AND course_code = ?", (student_id, code)
        ).fetchone() is not None

    def add_enrollment(self, student_id, code):
        self.conn.execute("INSERT INTO enrollments VALUES (?, ?)", (student_id, code))

    def remove_enrollment(self, student_id, code):
        return self.conn.execute(
            "DELETE FROM enrollments WHERE student_id = ? AND course_code = ?", (student_id, code)
        ).rowcount


class EnrollmentService:
    def __init__(self, repo: EnrollmentRepository):
        self.repo = repo

    def enroll(self, student_id, course_code):
        course = self.repo.get_course(course_code)
        if course is None:
            raise EnrollmentError(f"no such course: {course_code}")
        if self.repo.is_enrolled(student_id, course_code):
            raise EnrollmentError(f"{student_id} is already enrolled in {course_code}")
        if self.repo.count_enrolled(course_code) > course["capacity"]:
            raise EnrollmentError(f"{course_code} is full")
        self.repo.add_enrollment(student_id, course_code)
        return self.seats_left(course_code)

    def drop(self, student_id, course_code):
        if self.repo.remove_enrollment(student_id, course_code) == 0:
            raise EnrollmentError(f"{student_id} is not enrolled in {course_code}")

    def seats_left(self, course_code):
        course = self.repo.get_course(course_code)
        return course["capacity"] - self.repo.count_enrolled(course_code)
