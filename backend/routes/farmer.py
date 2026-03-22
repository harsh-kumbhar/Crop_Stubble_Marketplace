from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas

router = APIRouter()

# Register a new farmer
@router.post("/register", response_model=schemas.FarmerResponse)
def register_farmer(farmer: schemas.FarmerCreate, db: Session = Depends(get_db)):
    # Check if phone already exists
    existing = db.query(models.Farmer).filter(
        models.Farmer.phone == farmer.phone
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone number already registered")

    # Check if aadhaar already exists
    existing_aadhaar = db.query(models.Farmer).filter(
        models.Farmer.aadhaar == farmer.aadhaar
    ).first()
    if existing_aadhaar:
        raise HTTPException(status_code=400, detail="Aadhaar already registered")

    new_farmer = models.Farmer(**farmer.dict())
    db.add(new_farmer)
    db.commit()
    db.refresh(new_farmer)
    return new_farmer


# Get farmer by ID
@router.get("/{farmer_id}", response_model=schemas.FarmerResponse)
def get_farmer(farmer_id: int, db: Session = Depends(get_db)):
    farmer = db.query(models.Farmer).filter(
        models.Farmer.id == farmer_id
    ).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    return farmer


# Get all farmers
@router.get("/", response_model=list[schemas.FarmerResponse])
def get_all_farmers(db: Session = Depends(get_db)):
    return db.query(models.Farmer).all()