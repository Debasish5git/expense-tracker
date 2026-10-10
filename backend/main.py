from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import ExpenseCreate, ExpenseResponse

from backend.database import engine, Base, get_db
from backend import models
from sqlalchemy.orm import Session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500", "http://localhost:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

@app.delete("/expenses/{expense_id}")
def delete_expense(expense_id: int, db: Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()

    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")

    db.delete(expense)
    db.commit()

    return {
        "message": "Expense deleted successfully",
        "id":expense_id
    }

@app.put("/expenses/{expense_id}", response_model=ExpenseResponse)
def update_expense(expense_id:int, expense_data:ExpenseCreate, db:Session = Depends(get_db)):
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()

    if expense is None:
        raise HTTPException(status_code=404, detail="Expense not found")

    expense.amount = expense_data.amount
    expense.category = expense_data.category
    expense.description = expense_data.description
    expense.date = expense_data.date
    expense.paymentMethod = expense_data.paymentMethod

    db.commit()
    db.refresh(expense)

    return expense