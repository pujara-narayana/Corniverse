from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  
from typing import Dict
from statistics import mean
from fastapi import FastAPI, Response
from fastapi.responses import HTMLResponse
from fastapi.responses import JSONResponse
import sys
import os
sys.path.append(os.path.abspath("python")) 
from EarthPredict import YieldPredictor
from MarsPredict import MarsYieldPredictor

app = FastAPI()


# ✅ Fix: Add Missing `YearInput` Model
class YearInput(BaseModel):
    year: int
# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

# Define the MarsData model
class MarsData(BaseModel):
    water: float  # Water amount in milliliters
    soil_composition: Dict[str, int]  # Dictionary of gases (name -> amount)

# Earth
class EarthData(BaseModel):
    crop_yield: int


@app.get("/predict/{year}")
def predict_yield(year: int):
    """Allow predictions via GET requests."""
    try:
        predictor = YieldPredictor()
        prediction = predictor.predict_yield(year)
        return {"year": year, "predicted_yield": prediction}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    
@app.get("/marsPredict/{year}")
def predict_yield(year: int):
    """Allow predictions via GET requests."""
    try:
        predictor = MarsYieldPredictor()
        prediction = predictor.predict_yield_yes(year)
        return {"year": year, "predicted_yield": prediction}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))