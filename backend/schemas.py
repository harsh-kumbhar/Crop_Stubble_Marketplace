from pydantic import BaseModel
from typing import Optional

# ─── FARMER SCHEMAS ───────────────────────────────────────────

class FarmerCreate(BaseModel):
    name: str
    phone: str
    aadhaar: str
    village: str
    state: str
    crop_type: str

class FarmerResponse(BaseModel):
    id: int
    name: str
    phone: str
    village: str
    state: str
    crop_type: str

    class Config:
        from_attributes = True


# ─── BUYER SCHEMAS ────────────────────────────────────────────

class BuyerCreate(BaseModel):
    contact_name: str
    phone: str
    company_name: str
    gst_number: str
    industry_type: str

class BuyerResponse(BaseModel):
    id: int
    contact_name: str
    phone: str
    company_name: str
    gst_number: str
    industry_type: str
    verified: bool

    class Config:
        from_attributes = True


# ─── LISTING SCHEMAS ──────────────────────────────────────────

class ListingCreate(BaseModel):
    farmer_id: int
    crop_type: str
    quantity: float
    lat: float
    lng: float
    photo_url: Optional[str] = None
    ai_price_min: Optional[float] = None
    ai_price_max: Optional[float] = None

class ListingResponse(BaseModel):
    id: int
    farmer_id: int
    crop_type: str
    quantity: float
    lat: float
    lng: float
    photo_url: Optional[str]
    ai_price_min: Optional[float]
    ai_price_max: Optional[float]
    satellite_verified: bool
    status: str

    class Config:
        from_attributes = True


# ─── AI PRICE SCHEMAS ─────────────────────────────────────────

class PriceRequest(BaseModel):
    crop_type: str
    quantity: float
    state: str
    season: str

class PriceResponse(BaseModel):
    crop_type: str
    quantity: float
    price_min: float
    price_max: float
    suggested_price: float