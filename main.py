from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Dict

app = FastAPI()

# Define the MarsData model
class MarsData(BaseModel):
    water: float  # Water amount in milliliters
    soil_composition: Dict[str, int]  # Dictionary of gases (name -> amount)
    year: int  # Year of the data

# In-memory database (for simplicity)
fake_db = {}

# Initialize a global counter for the Mars ID
mars_id_counter = 1  # Start ID counter from 1

# CREATE - POST request to create Mars data
@app.post("/mars/", response_model=MarsData)
async def create_mars_data(data: MarsData):
    global mars_id_counter  # Use the global counter
    mars_id = mars_id_counter  # Assign current counter value as the Mars ID
    fake_db[mars_id] = data  # Store the Mars data in fake_db with the generated ID
    mars_id_counter += 1  # Increment the ID counter for the next entry
    return data  # Return the data that was added

# READ - GET request to retrieve Mars data by ID
@app.get("/mars/{mars_id}", response_model=MarsData)
async def get_mars_data(mars_id: int):
    if mars_id not in fake_db:
        raise HTTPException(status_code=404, detail="Mars data not found")
    return fake_db[mars_id]  # Return the requested Mars data

# UPDATE - PUT request to update Mars data
@app.put("/mars/{mars_id}", response_model=MarsData)
async def update_mars_data(mars_id: int, data: MarsData):
    if mars_id not in fake_db:
        raise HTTPException(status_code=404, detail="Mars data not found")
    fake_db[mars_id] = data  # Update the entry in the fake database
    return data  # Return the updated data

# DELETE - DELETE request to remove Mars data by ID
@app.delete("/mars/{mars_id}", response_model=MarsData)
async def delete_mars_data(mars_id: int):
    if mars_id not in fake_db:
        raise HTTPException(status_code=404, detail="Mars data not found")
    deleted_data = fake_db.pop(mars_id)  # Remove the entry from the fake database
    return deleted_data  # Return the data that was deleted