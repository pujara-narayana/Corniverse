from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware  
from typing import Dict
from statistics import mean

app = FastAPI()

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

# In-memory database 
fake_db = {}

# Initialize a global counter for the Mars and Earth ID
mars_id_counter = 1  
earth_id_counter = 1

# CREATE - POST request to create Mars data
@app.post("/mars/", response_model=MarsData)
async def create_mars_data(data: MarsData):
    global mars_id_counter  
    mars_id = mars_id_counter 
    fake_db[mars_id] = data 
    mars_id_counter += 1  
    return data 

# READ - GET request to retrieve Mars data by ID
@app.get("/mars/{mars_id}", response_model=MarsData)
async def get_mars_data(mars_id: int):
    if mars_id not in fake_db:
        raise HTTPException(status_code=404, detail="Mars data not found")
    return fake_db[mars_id]  

# UPDATE - PUT request to update Mars data
@app.put("/mars/{mars_id}", response_model=MarsData)
async def update_mars_data(mars_id: int, data: MarsData):
    if mars_id not in fake_db:
        raise HTTPException(status_code=404, detail="Mars data not found")
    fake_db[mars_id] = data 
    return data 

# DELETE - DELETE request to remove Mars data by ID
@app.delete("/mars/{mars_id}", response_model=MarsData)
async def delete_mars_data(mars_id: int):
    if mars_id not in fake_db:
        raise HTTPException(status_code=404, detail="Mars data not found")
    deleted_data = fake_db.pop(mars_id) 
    return deleted_data  

fake_db = {}

# Earth CRUD Methods (POST, GET, PUT, DELETE)
@app.post("/earth/", response_model=EarthData)
async def create_earth_data(data: EarthData):
    global earth_id_counter
    earth_id = earth_id_counter
    fake_db[earth_id] = data
    earth_id_counter += 1
    return data

@app.get("/earth/{earth_id}", response_model=EarthData)
async def get_earth_data(earth_id: int):
    if earth_id not in fake_db:
        raise HTTPException(status_code=404, detail="Earth data not found")
    return fake_db[earth_id]

@app.put("/earth/{earth_id}", response_model=EarthData)
async def update_earth_data(earth_id: int, data: EarthData):
    if earth_id not in fake_db:
        raise HTTPException(status_code=404, detail="Earth data not found")
    fake_db[earth_id] = data
    return data

@app.delete("/earth/{earth_id}", response_model=EarthData)
async def delete_earth_data(earth_id: int):
    if earth_id not in fake_db:
        raise HTTPException(status_code=404, detail="Earth data not found")
    deleted_data = fake_db.pop(earth_id)
    return deleted_data

async def compute_average_water_content():
    if not fake_db:
        return 0
    water_contents = []
    for data in fake_db.values():
        if isinstance(data, MarsData):
            water_contents.append(data.water)
    return mean(water_contents) if water_contents else 0

@app.get("/average-water-content")
async def get_average_water_content():
    average = await compute_average_water_content()
    return {"average_water_content": average}