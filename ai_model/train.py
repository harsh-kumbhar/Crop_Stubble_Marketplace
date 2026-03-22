import pandas as pd
import numpy as np
import xgboost as xgb
import pickle
import os
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_percentage_error, r2_score

def train_model():
    # Load training data
    data_path = os.path.join(
        os.path.dirname(__file__),
        "../datasets/processed/training_data.csv"
    )
    df = pd.read_csv(data_path)
    print(f"Loaded {len(df)} training records")

    # Features and target
    X = df[["crop_type", "state", "season", "quantity"]]
    y = df["modal_price"]

    # Split into train and test
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train XGBoost model
    model = xgb.XGBRegressor(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.1,
        subsample=0.8,
        colsample_bytree=0.8,
        random_state=42
    )

    model.fit(
        X_train, y_train,
        eval_set=[(X_test, y_test)],
        verbose=50
    )

    # Evaluate model
    y_pred = model.predict(X_test)
    r2 = r2_score(y_test, y_pred)
    mape = mean_absolute_percentage_error(y_test, y_pred)

    print(f"\n--- Model Performance ---")
    print(f"R² Score:  {r2:.4f}")
    print(f"MAPE:      {mape * 100:.2f}%")
    print(f"------------------------")

    # Save model
    model_path = os.path.join(
        os.path.dirname(__file__),
        "../backend/ai/price_model.pkl"
    )
    with open(model_path, "wb") as f:
        pickle.dump(model, f)

    print(f"\nModel saved to {model_path}")
    return model

if __name__ == "__main__":
    train_model()
