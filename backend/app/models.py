from sqlalchemy import Column, Integer, String, Float
from .database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, nullable=False)
    description = Column(String, nullable=False, index=True)
    amount = Column(Float, nullable=False)
    category = Column(String, nullable=True)
    predicted_category = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)