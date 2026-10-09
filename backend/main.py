from fastapi import FastAPI, Depends
from backend.schemas import ExpenseCreate, ExpenseResponse

from backend.database import engine, Base, get_db
from backend import models
from sqlalchemy.orm import Session

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
def home():
    return {"message":"Smart Personal Finance Manager API is running"}

@app.post("/expenses", response_model=ExpenseResponse)
def add_expense(expense:ExpenseCreate, db: Session = Depends(get_db)):

    db_expense = models.Expense(
        amount = expense.amount,
        category = expense.category,
        description = expense.description,
        date = expense.date,
        paymentMethod = expense.paymentMethod
    )

    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)

    return db_expense


@app.get("/expenses", response_model=list[ExpenseResponse])
def get_expenses(db: Session = Depends(get_db)):
    expenses = db.query(models.Expense).order_by(models.Expense.id.desc()).all()

    return expenses