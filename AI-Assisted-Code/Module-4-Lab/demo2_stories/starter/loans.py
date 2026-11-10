"""Library loans - the first version a developer wrote from a hallway chat.

Demo 2: turn brief.md into user stories and acceptance criteria, then check
this code against them - see PROMPT.md.
"""
from datetime import timedelta


class LoanError(Exception):
    pass


class Library:
    LOAN_DAYS = 14
    FEE_PER_DAY = 5

    def __init__(self, copies):
        self.copies = dict(copies)  # isbn -> copies on the shelf
        self.loans = {}             # (student, isbn) -> due date
        self.fees = {}              # student -> unpaid fees

    def borrow(self, student, isbn, today):
        if self.fees.get(student, 0) > 0:
            raise LoanError("please pay outstanding fees first")
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
        fee = days_late * self.FEE_PER_DAY
        self.fees[student] = self.fees.get(student, 0) + fee
        return fee

    def pay(self, student, amount):
        self.fees[student] = max(0, self.fees.get(student, 0) - amount)
