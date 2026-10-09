from sqlalchemy import Column, Integer, Float, String, Date
from backend.database import Base

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(String(255), nullable=False)
    date = Column(Date, nullable=False)
    paymentMethod = Column(String(50), nullable=False)