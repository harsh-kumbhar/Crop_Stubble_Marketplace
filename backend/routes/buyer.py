from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

# Get all buyers — MUST be before /{buyer_id}
@router.get("/all", response_model=list[schemas.BuyerResponse])
def get_all_buyers(db: Session = Depends(get_db)):
    return db.query(models.Buyer).all()

# Register a new buyer
@router.post("/register", response_model=schemas.BuyerResponse)
def register_buyer(buyer: schemas.BuyerCreate, db: Session = Depends(get_db)):
    existing_phone = db.query(models.Buyer).filter(
        models.Buyer.phone == buyer.phone
    ).first()
    if existing_phone:
        raise HTTPException(status_code=400, detail="Phone number already registered")
    existing_gst = db.query(models.Buyer).filter(
        models.Buyer.gst_number == buyer.gst_number
    ).first()
    if existing_gst:
        raise HTTPException(status_code=400, detail="GST number already registered")
    new_buyer = models.Buyer(**buyer.dict())
    db.add(new_buyer)
    db.commit()
    db.refresh(new_buyer)
    return new_buyer

# Get buyer by ID
@router.get("/{buyer_id}", response_model=schemas.BuyerResponse)
def get_buyer(buyer_id: int, db: Session = Depends(get_db)):
    buyer = db.query(models.Buyer).filter(
        models.Buyer.id == buyer_id
    ).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    return buyer

# Verify a buyer
@router.patch("/{buyer_id}/verify", response_model=schemas.BuyerResponse)
def verify_buyer(buyer_id: int, db: Session = Depends(get_db)):
    buyer = db.query(models.Buyer).filter(
        models.Buyer.id == buyer_id
    ).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    buyer.verified = True
    db.commit()
    db.refresh(buyer)
    return buyer