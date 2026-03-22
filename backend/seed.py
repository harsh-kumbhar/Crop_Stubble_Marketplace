from database import SessionLocal, engine, Base
import models

Base.metadata.create_all(bind=engine)

db = SessionLocal()

def seed():
    print("Seeding database...")

    # ── CLEAR EXISTING DATA ──────────────────────────────────
    db.query(models.Listing).delete()
    db.query(models.Farmer).delete()
    db.query(models.Buyer).delete()
    db.commit()
    print("Cleared existing data")

    # ── FARMERS ──────────────────────────────────────────────
    farmers = [
        models.Farmer(
            name="Rajan Patil",
            phone="9876543210",
            aadhaar="123456789012",
            village="Nashik",
            state="Maharashtra",
            crop_type="paddy"
        ),
        models.Farmer(
            name="Gurpreet Singh",
            phone="9876543211",
            aadhaar="123456789013",
            village="Ludhiana",
            state="Punjab",
            crop_type="wheat"
        ),
        models.Farmer(
            name="Ramesh Yadav",
            phone="9876543212",
            aadhaar="123456789014",
            village="Kanpur",
            state="Uttar Pradesh",
            crop_type="maize"
        ),
        models.Farmer(
            name="Suresh Reddy",
            phone="9876543213",
            aadhaar="123456789015",
            village="Pune",
            state="Maharashtra",
            crop_type="sugarcane"
        ),
        models.Farmer(
            name="Harjinder Kaur",
            phone="9876543214",
            aadhaar="123456789016",
            village="Amritsar",
            state="Punjab",
            crop_type="cotton"
        ),
    ]

    for farmer in farmers:
        db.add(farmer)
    db.commit()

    # Refresh to get IDs
    for farmer in farmers:
        db.refresh(farmer)

    print(f"Added {len(farmers)} farmers")
    print("Farmer Login Numbers:")
    for f in farmers:
        print(f"  {f.name} ({f.state}) — Phone: {f.phone}")

    # ── LISTINGS ─────────────────────────────────────────────
    listings = [
        # Rajan Patil — Maharashtra — Paddy
        models.Listing(
            farmer_id=farmers[0].id,
            crop_type="paddy",
            quantity=15.0,
            lat=19.9975,
            lng=73.7898,
            ai_price_min=1210,
            ai_price_max=1480,
            satellite_verified=True,
            status="active"
        ),
        models.Listing(
            farmer_id=farmers[0].id,
            crop_type="paddy",
            quantity=8.5,
            lat=19.8762,
            lng=73.8567,
            ai_price_min=1180,
            ai_price_max=1440,
            satellite_verified=False,
            status="active"
        ),
        # Gurpreet Singh — Punjab — Wheat
        models.Listing(
            farmer_id=farmers[1].id,
            crop_type="wheat",
            quantity=25.0,
            lat=30.9010,
            lng=75.8573,
            ai_price_min=1380,
            ai_price_max=1690,
            satellite_verified=True,
            status="active"
        ),
        models.Listing(
            farmer_id=farmers[1].id,
            crop_type="paddy",
            quantity=12.0,
            lat=30.8500,
            lng=75.7200,
            ai_price_min=1320,
            ai_price_max=1615,
            satellite_verified=True,
            status="active"
        ),
        # Ramesh Yadav — UP — Maize
        models.Listing(
            farmer_id=farmers[2].id,
            crop_type="maize",
            quantity=20.0,
            lat=26.4499,
            lng=80.3319,
            ai_price_min=1050,
            ai_price_max=1290,
            satellite_verified=True,
            status="active"
        ),
        models.Listing(
            farmer_id=farmers[2].id,
            crop_type="wheat",
            quantity=30.0,
            lat=26.5000,
            lng=80.4000,
            ai_price_min=1290,
            ai_price_max=1580,
            satellite_verified=False,
            status="active"
        ),
        # Suresh Reddy — Maharashtra — Sugarcane
        models.Listing(
            farmer_id=farmers[3].id,
            crop_type="sugarcane",
            quantity=40.0,
            lat=18.5204,
            lng=73.8567,
            ai_price_min=920,
            ai_price_max=1130,
            satellite_verified=True,
            status="active"
        ),
        # Harjinder Kaur — Punjab — Cotton
        models.Listing(
            farmer_id=farmers[4].id,
            crop_type="cotton",
            quantity=18.0,
            lat=31.6340,
            lng=74.8723,
            ai_price_min=1380,
            ai_price_max=1690,
            satellite_verified=True,
            status="active"
        ),
        models.Listing(
            farmer_id=farmers[4].id,
            crop_type="mustard",
            quantity=10.0,
            lat=31.5200,
            lng=74.9000,
            ai_price_min=1150,
            ai_price_max=1420,
            satellite_verified=False,
            status="active"
        ),
    ]

    for listing in listings:
        db.add(listing)
    db.commit()
    print(f"\nAdded {len(listings)} listings")

    # ── BUYERS ───────────────────────────────────────────────
    buyers = [
        models.Buyer(
            contact_name="Vikram Mehta",
            phone="9988776655",
            company_name="NTPC Biomass Division",
            gst_number="27AABCU9603R1ZX",
            industry_type="Thermal Power Plant (Co-firing)",
            verified=True
        ),
        models.Buyer(
            contact_name="Priya Sharma",
            phone="9988776656",
            company_name="Satia Industries Ltd",
            gst_number="27AABCU9603R1ZY",
            industry_type="Paper & Pulp Industry",
            verified=True
        ),
        models.Buyer(
            contact_name="Amit Joshi",
            phone="9988776657",
            company_name="SAEL Biomass Power",
            gst_number="27AABCU9603R1ZZ",
            industry_type="Biomass Power Plant",
            verified=False
        ),
    ]

    for buyer in buyers:
        db.add(buyer)
    db.commit()
    print(f"Added {len(buyers)} buyers")
    print("\nBuyer Login Numbers:")
    for b in buyers:
        print(f"  {b.contact_name} ({b.company_name}) — Phone: {b.phone} — Verified: {b.verified}")

    print("\n--- SEED COMPLETE ---")
    print("\nQuick Login Reference:")
    print("FARMERS:")
    for f in farmers:
        print(f"  {f.phone} — {f.name} ({f.state})")
    print("BUYERS:")
    for b in buyers:
        print(f"  {b.phone} — {b.company_name} (Verified: {b.verified})")

if __name__ == "__main__":
    seed()
    db.close()
