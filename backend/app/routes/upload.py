# We use APIRouter (not the whole FastAPI app) so we can group related
# endpoints in their own file. main.py will "include" this router later.
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException

# Session is the type of an active DB connection. It's what get_db() yields.
from sqlalchemy.orm import Session

# pandas parses the CSV. io.BytesIO lets us feed raw bytes to pandas as if
# they were a file on disk.
import io
import pandas as pd

# These are OUR imports — the DB session factory and the Transaction table.
# The two dots mean "go up one level" (from routes/ to app/) then find them.
from ..database import get_db
from ..models import Transaction

# One router instance per file. main.py imports THIS object.
router = APIRouter()

# Columns the uploaded CSV must contain. Anything else is optional.
REQUIRED_COLUMNS = {"date", "description", "amount"}


# The decorator registers this function as the handler for POST /upload.
# `async` means: this function can pause while waiting for I/O (like reading
# an uploaded file) without blocking other requests. FastAPI handles the rest.
@router.post("/upload")
async def upload_csv(
    # UploadFile is FastAPI's wrapper around an uploaded file.
    # File(...) means "this parameter is required, no default value".
    file: UploadFile = File(...),
    # This is dependency injection: FastAPI calls get_db() and gives us the
    # session. When our function returns, get_db()'s `finally` closes it.
    db: Session = Depends(get_db),
):
    # Cheap sanity check: don't try to parse a .jpg as a CSV.
    if not file.filename.lower().endswith(".csv"):
        # HTTPException short-circuits and returns an error response.
        # 400 = "Bad Request" (the caller sent us junk).
        raise HTTPException(status_code=400, detail="Only .csv files are allowed")

    # UploadFile is async — reading it must be awaited. `await` pauses this
    # function until the read is done, without blocking the whole server.
    contents = await file.read()

    # pandas.read_csv wants a file-like object. BytesIO wraps our raw bytes
    # so pandas can call .read() on it just like a real file.
    try:
        df = pd.read_csv(io.BytesIO(contents))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {e}")

    # Normalize the column names so users can send "Date" or "DATE".
    df.columns = [c.strip().lower() for c in df.columns]

    # Set arithmetic: what's required but not present?
    missing = REQUIRED_COLUMNS - set(df.columns)
    if missing:
        raise HTTPException(
            status_code=400,
            detail=f"CSV missing required columns: {sorted(missing)}",
        )

    # Build ORM objects — one per row. Nothing hits the DB yet.
    created = []
    for _, row in df.iterrows():
        tx = Transaction(
            date=str(row["date"]),
            description=str(row["description"]),
            amount=float(row["amount"]),
        )
        # Stage this object for insert. Still no SQL yet.
        db.add(tx)
        created.append(tx)

    # Now write everything to SQLite in one transaction.
    db.commit()

    # After commit, each row has an id assigned by the DB. refresh() re-reads
    # the row so `tx.id` is populated before we return it.
    for tx in created:
        db.refresh(tx)

    # Return a plain dict of primitive types — FastAPI turns it into JSON.
    return [
        {
            "id": tx.id,
            "date": tx.date,
            "description": tx.description,
            "amount": tx.amount,
        }
        for tx in created
    ]