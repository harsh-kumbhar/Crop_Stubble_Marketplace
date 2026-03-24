from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
import models, schemas
import shutil
import os
import uuid

router = APIRouter()

# Create a new listing
@router.post("/create", response_model=schemas.ListingResponse)
def create_listing(listing: schemas.ListingCreate, db: Session = Depends(get_db)):
    # Check if farmer exists
    farmer = db.query(models.Farmer).filter(
        models.Farmer.id == listing.farmer_id
    ).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")

    new_listing = models.Listing(**listing.dict())
    db.add(new_listing)
    db.commit()
    db.refresh(new_listing)
    return new_listing


# Get all active listings
@router.get("/", response_model=list[schemas.ListingResponse])
def get_all_listings(db: Session = Depends(get_db)):
    return db.query(models.Listing).filter(
        models.Listing.status == "active"
    ).all()


# Get listing by ID
@router.get("/{listing_id}", response_model=schemas.ListingResponse)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(
        models.Listing.id == listing_id
    ).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing


# Filter listings by crop type
@router.get("/filter/crop", response_model=list[schemas.ListingResponse])
def filter_by_crop(crop_type: str, db: Session = Depends(get_db)):
    return db.query(models.Listing).filter(
        models.Listing.crop_type == crop_type,
        models.Listing.status == "active"
    ).all()


# Filter listings by state
@router.get("/filter/state", response_model=list[schemas.ListingResponse])
def filter_by_state(state: str, db: Session = Depends(get_db)):
    farmers = db.query(models.Farmer).filter(
        models.Farmer.state == state
    ).all()
    farmer_ids = [f.id for f in farmers]
    return db.query(models.Listing).filter(
        models.Listing.farmer_id.in_(farmer_ids),
        models.Listing.status == "active"
    ).all()


# Mark listing as sold
@router.patch("/{listing_id}/sold", response_model=schemas.ListingResponse)
def mark_sold(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(
        models.Listing.id == listing_id
    ).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    listing.status = "sold"
    db.commit()
    db.refresh(listing)
    return listing


# Mark listing as satellite verified
@router.patch("/{listing_id}/verify-satellite", response_model=schemas.ListingResponse)
def verify_satellite(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(models.Listing).filter(
        models.Listing.id == listing_id
    ).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found")
    listing.satellite_verified = True
    db.commit()
    db.refresh(listing)
    return listing

# Upload field photo
@router.post("/upload-photo")
async def upload_photo(file: UploadFile = File(...)):
    # Validate file type
    allowed_types = ["image/jpeg", "image/png", "image/jpg", "image/webp"]
    if file.content_type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Only JPG, PNG and WEBP images are allowed"
        )

    # Validate file size (max 5MB)
    contents = await file.read()
    if len(contents) > 5 * 1024 * 1024:
        raise HTTPException(
            status_code=400,
            detail="Image size must be less than 5MB"
        )

    # Generate unique filename
    ext = file.filename.split(".")[-1]
    filename = f"{uuid.uuid4()}.{ext}"
    filepath = f"static/uploads/{filename}"

    # Save file
    with open(filepath, "wb") as f:
        f.write(contents)

    # Return accessible URL
    return {
        "photo_url": f"http://localhost:8000/static/uploads/{filename}",
        "filename": filename
    }
