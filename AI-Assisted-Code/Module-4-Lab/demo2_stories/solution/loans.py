"""Library loans.

Reference answer for Demo 2: updated so that every acceptance criterion in
stories.md is met (AC-3 loan limit and AC-5 fine cap were missing).
"""
from datetime import timedelta


class LoanError(Exception):
    pass


class Library:
    LOAN_DAYS = 14
    FEE_PER_DAY = 5
    FEE_CAP = 100   # AC-5: maximum fine per book
    MAX_LOANS = 3   # AC-3: books one student may hold at a time

    def __init__(self, copies):
        self.copies = dict(copies)  # isbn -> copies on the shelf
        self.loans = {}             # (student, isbn) -> due date
        self.fees = {}              # student -> unpaid fees

    def loans_of(self, student):
        return sum(1 for (s, _isbn) in self.loans if s == student)

    def borrow(self, student, isbn, today):
        if self.fees.get(student, 0) > 0:
            raise LoanError("please pay outstanding fees first")
        if self.loans_of(student) >= self.MAX_LOANS:
            raise LoanError(f"limit of {self.MAX_LOANS} books reached")
        if self.copies.get(isbn, 0) == 0:
            raise LoanError(f"{isbn} is not available")
        self.copies[isbn] -= 1
        due = today + timedelta(days=self.LOAN_DAYS)
        self.loans[(student, isbn)] = due
        return due

    def return_book(self, student, isbn, today):
        due = self.loans.pop((student, isbn))
        self.copies[isbn] += 1
        days_late = max(0, (today - due).days)
        fee = min(days_late * self.FEE_PER_DAY, self.FEE_CAP)
        self.fees[student] = self.fees.get(student, 0) + fee
        return fee

    def pay(self, student, amount):
        self.fees[student] = max(0, self.fees.get(student, 0) - amount)
