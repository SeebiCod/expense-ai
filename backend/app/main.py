from fastapi import FastAPI

from .database import Base, engine
from . import models
Base.metadata.create_all(bind=engine)
from .routes import upload, transactions

app = FastAPI()

app.include_router(upload.router)
app.include_router(transactions.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}