from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from fastapi import status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import Transaction

router = APIRouter()

@router.get("/transactions")
def list_transactions(
    limit: int = 500,
    db: Session = Depends(get_db),
):

    rows = (
        db.query(Transaction)
        .order_by(desc(Transaction.id))
        .limit(limit)
        .all()
    )

    return [
        {
            "id": r.id,
            "date": r.date,
            "description": r.description,
            "amount": r.amount,
        }
        for r in rows
    ]