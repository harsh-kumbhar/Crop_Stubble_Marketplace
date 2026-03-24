from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from database import engine, Base
from routes import farmer, buyer, listings, ai_price

# Create all tables in database
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Crop Stubble Marketplace API",
    description="From Field to Factory — Pune Agri Hackathon 2026",
    version="1.0.0"
)
os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Allow React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register all routes
app.include_router(farmer.router, prefix="/farmer", tags=["Farmer"])
app.include_router(buyer.router, prefix="/buyer", tags=["Buyer"])
app.include_router(listings.router, prefix="/listings", tags=["Listings"])
app.include_router(ai_price.router, prefix="/ai", tags=["AI Price"])

@app.get("/")
def root():
    return {
        "message": "Crop Stubble Marketplace API is running",
        "docs": "http://localhost:8000/docs"
    }