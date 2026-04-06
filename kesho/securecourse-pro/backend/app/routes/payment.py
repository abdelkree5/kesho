from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import PaymentSettings

router = APIRouter()

@router.get("/info")
async def get_payment_info(db: Session = Depends(get_db)):
    settings = db.query(PaymentSettings).all()
    payment_info = {}
    for setting in settings:
        payment_info[setting.method] = setting.value
    return payment_info