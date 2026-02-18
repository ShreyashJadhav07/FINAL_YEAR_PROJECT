from fastapi.middleware.cors import CORSMiddleware

from fastapi import FastAPI
import joblib
import pandas as pd

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load saved ML files
dt_model = joblib.load("../decision_tree_model.pkl")
rf_model = joblib.load("../random_forest_model.pkl")
scaler = joblib.load("../scaler.pkl")
columns = joblib.load("../columns.pkl")

@app.get("/")
def home():
    return {"message": "Heart Disease Prediction API Running"}

@app.post("/predict")
def predict(data: dict):
    input_df = pd.DataFrame([data])

    # Ensure same column order
    for col in columns:
        if col not in input_df:
            input_df[col] = 0
    input_df = input_df[columns]

    # Scale numeric columns
    cols_to_standardise = ['age','totChol','sysBP','BMI','heartRate','glucose','cigsPerDay']
    input_df[cols_to_standardise] = scaler.transform(input_df[cols_to_standardise])

    dt_pred = dt_model.predict(input_df)[0]
    rf_pred = rf_model.predict(input_df)[0]

    return {
        "decision_tree_prediction": int(dt_pred),
        "random_forest_prediction": int(rf_pred)
    }
