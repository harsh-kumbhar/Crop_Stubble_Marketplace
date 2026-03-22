import pickle
import os
import numpy as np

# Crop encoding — must match generate_data.py
CROP_ENCODING = {
    "paddy": 0, "wheat": 1, "maize": 2,
    "cotton": 3, "sugarcane": 4, "mustard": 5,
    "soybean": 6, "groundnut": 7
}

# State encoding — must match generate_data.py
STATE_ENCODING = {
    "punjab": 0, "maharashtra": 1,
    "uttar pradesh": 2, "haryana": 3, "other": 4
}

# Load model once when server starts
model_path = os.path.join(os.path.dirname(__file__), "price_model.pkl")

model = None

def load_model():
    global model
    if model is None:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
    return model

def predict_price(crop_type: str, state: str, season: str, quantity: float):
    m = load_model()

    # Encode inputs
    crop_encoded = CROP_ENCODING.get(crop_type.lower(), 0)
    state_encoded = STATE_ENCODING.get(state.lower(), 4)
    season_encoded = 1 if season.lower() == "kharif" else 0

    # Prepare input
    X = np.array([[crop_encoded, state_encoded, season_encoded, quantity]])

    # Predict modal price
    modal_price = float(m.predict(X)[0])

    # Calculate min and max around modal
    price_min = round(modal_price * 0.90)
    price_max = round(modal_price * 1.10)
    suggested = round(modal_price)

    return price_min, price_max, suggested