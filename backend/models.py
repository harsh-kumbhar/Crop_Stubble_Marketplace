from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Farmer(Base):
    __tablename__ = "farmers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    aadhaar = Column(String, unique=True, nullable=False)
    village = Column(String, nullable=False)
    state = Column(String, nullable=False)
    crop_type = Column(String, nullable=False)
    created_at = Column(DateTime, server_default=func.now())


class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(Integer, primary_key=True, index=True)
    contact_name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    company_name = Column(String, nullable=False)
    gst_number = Column(String, unique=True, nullable=False)
    industry_type = Column(String, nullable=False)
    verified = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())


class Listing(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    farmer_id = Column(Integer, ForeignKey("farmers.id"), nullable=False)
    crop_type = Column(String, nullable=False)
    quantity = Column(Float, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    photo_url = Column(String, nullable=True)
    ai_price_min = Column(Float, nullable=True)
    ai_price_max = Column(Float, nullable=True)
    satellite_verified = Column(Boolean, default=False)
    status = Column(String, default="active")
    created_at = Column(DateTime, server_default=func.now())