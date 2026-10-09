from pydantic import BaseModel
from datetime import date

class ExpenseCreate(BaseModel):
    amount:float
    category:str
    description:str
    date:date
    paymentMethod:str

class ExpenseResponse(BaseModel):
    id:int
    amount:float
    category:str
    description:str
    date:date
    paymentMethod:str

    model_config = {"from_attributes": True}