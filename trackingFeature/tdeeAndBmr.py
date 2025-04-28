from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/calculate_bmr")
def calculate_bmr(
    weight: float = Query(..., gt=0),
    height: float = Query(..., gt=0),
    age: int = Query(..., gt=0),
    gender: str = Query(...)
):
    if gender not in ['male', 'female']:
        raise HTTPException(status_code=400, detail="Invalid gender. Use 'male' or 'female'.")

    if gender == 'male':
        return {"bmr": 10 * weight + 6.25 * height - 5 * age + 5}
    else:
        return {"bmr": 10 * weight + 6.25 * height - 5 * age - 161}

@app.get("/calculate_tdee")
def calculate_tdee(
    bmr: float = Query(..., gt=0),
    activity_level: str = Query(...)
):
    activity_levels = {
        "sedentary": 1.2,
        "lightly_active": 1.375,
        "moderately_active": 1.55,
        "very_active": 1.725,
        "extra_active": 1.9,
    }
    multiplier = activity_levels.get(activity_level)
    if not multiplier:
        raise HTTPException(status_code=400, detail="Invalid activity level")
    return {"tdee": bmr * multiplier}

@app.get("/")
def root():
    return {"message": "Server is working!"}
