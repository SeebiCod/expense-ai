from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from ..database import get_db
from ..models import Transaction

router = APIRouter()

@router.get("/transactions")
def list_transactions(
    limit: int = Query(500, ge=1, le=5000),
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

@router.delete("/transactions")
def delete_all(db: Session = Depends(get_db)):
    # SQLAlchemy's .delete() runs a single DELETE FROM transactions SQL statement
    # and returns how many rows were removed.
    n = db.query(Transaction).delete()
    db.commit()
    return {"deleted": n}