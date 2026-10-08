from fastapi import FastAPI
from backend.schemas import ExpenseCreate

app = FastAPI()

@app.get("/")
def home():
    return {"message":"Smart Personal Finance Manager API is running"}

@app.post("/expenses")
def add_expense(expense:ExpenseCreate):
    return{
        "message":"Expense received successfully",
        "expense":expense
    }