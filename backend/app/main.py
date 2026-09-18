from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
Base.metadata.create_all(bind=engine)
from .routes import upload, transactions

app = FastAPI(title="Expense AI", version="0.1.0")

# Browsers block calls from http://localhost:5173 (Vite) to http://localhost:8000
# (this server) unless the server explicitly allows it. CORS = Cross-Origin
# Resource Sharing. Without this middleware, the frontend's fetch() calls fail
# with a scary CORS error in the console.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(transactions.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/health")
async def health():
    return {"status": "ok", "model": None}