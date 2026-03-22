import pandas as pd
import numpy as np
import os

# Residue price ratio vs grain price
# Residue is cheaper than grain — these are conversion factors
RESIDUE_RATIO = {
    "paddy": 0.35,
    "wheat": 0.40,
    "maize": 0.38,
    "cotton": 0.45,
}

# Season mapping by month
SEASON_MAP = {
    1: "rabi", 2: "rabi", 3: "rabi",
    4: "rabi", 5: "rabi", 6: "kharif",
    7: "kharif", 8: "kharif", 9: "kharif",
    10: "kharif", 11: "rabi", 12: "rabi"
}

# Crop type encoding
CROP_ENCODING = {
    "paddy": 0,
    "wheat": 1,
    "maize": 2,
    "cotton": 3,
    "sugarcane": 4,
    "mustard": 5,
    "soybean": 6,
    "groundnut": 7
}

# State encoding
STATE_ENCODING = {
    "punjab": 0,
    "maharashtra": 1,
    "uttar pradesh": 2,
    "haryana": 3,
    "other": 4
}

def generate_training_data():
    # Load Agmarknet CSV
    csv_path = os.path.join(
        os.path.dirname(__file__),
        "../datasets/raw/Commodity-wise_Market-wise_Daily_Weighted_Avg_Report_19-03-2026_06-08-47_PM.csv"
    )

    # Read CSV skipping first 2 header rows
    df = pd.read_csv(csv_path, skiprows=2)

    # Rename columns
    df.columns = [
        "market", "arrivals", "unit_arrivals",
        "variety", "min_price", "max_price",
        "modal_price", "unit_price", "grade"
    ]

    # Drop rows with missing prices
    df = df.dropna(subset=["modal_price", "min_price", "max_price"])

    # Keep only numeric price rows
    df = df[pd.to_numeric(df["modal_price"], errors="coerce").notna()]
    df["modal_price"] = pd.to_numeric(df["modal_price"])
    df["min_price"] = pd.to_numeric(df["min_price"])
    df["max_price"] = pd.to_numeric(df["max_price"])

    print(f"Loaded {len(df)} rows from Agmarknet CSV")

    # Generate synthetic residue training data
    records = []
    np.random.seed(42)

    crops = ["paddy", "wheat", "maize", "cotton",
             "sugarcane", "mustard", "soybean", "groundnut"]
    states = ["punjab", "maharashtra", "uttar pradesh", "haryana", "other"]
    seasons = ["kharif", "rabi"]

    # Generate 2000 synthetic records
    for _ in range(2000):
        crop = np.random.choice(crops)
        state = np.random.choice(states)
        season = np.random.choice(seasons)
        quantity = round(np.random.uniform(1, 50), 1)

        # Base price from MNRE benchmarks
        base_prices = {
            "paddy":     (1000, 1500),
            "wheat":     (1200, 1800),
            "maize":     (900,  1400),
            "cotton":    (1200, 1800),
            "sugarcane": (800,  1200),
            "mustard":   (1000, 1600),
            "soybean":   (900,  1300),
            "groundnut": (1000, 1500),
        }

        base_min, base_max = base_prices[crop]

        # State multiplier
        state_mult = {
            "punjab": 1.15, "maharashtra": 1.10,
            "uttar pradesh": 1.05, "haryana": 1.12,
            "other": 1.0
        }[state]

        # Season multiplier
        season_mult = 1.1 if season == "kharif" else 1.0

        # Quantity bonus
        qty_bonus = min(quantity * 0.5, 200)

        # Add random noise ±10%
        noise = np.random.uniform(0.90, 1.10)

        price_min = round((base_min * state_mult * season_mult + qty_bonus) * noise)
        price_max = round((base_max * state_mult * season_mult + qty_bonus) * noise)
        modal_price = round((price_min + price_max) / 2)

        records.append({
            "crop_type": CROP_ENCODING[crop],
            "state": STATE_ENCODING[state],
            "season": 1 if season == "kharif" else 0,
            "quantity": quantity,
            "price_min": price_min,
            "price_max": price_max,
            "modal_price": modal_price
        })

    training_df = pd.DataFrame(records)

    # Save to processed folder
    output_path = os.path.join(
        os.path.dirname(__file__),
        "../datasets/processed/training_data.csv"
    )
    training_df.to_csv(output_path, index=False)
    print(f"Generated {len(training_df)} training records")
    print(f"Saved to {output_path}")
    print(training_df.head())

    return training_df

if __name__ == "__main__":
    generate_training_data()
