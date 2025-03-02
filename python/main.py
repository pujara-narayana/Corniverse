from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Optional, List, Any
import sys
import os
import requests
import json
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

MY_ENV_VAR = os.getenv("DEEPSEEKAPI")

sys.path.append(os.path.abspath("python"))
from EarthPredict import YieldPredictor
from MarsPredict import MarsYieldPredictor

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the input models
class YearInput(BaseModel):
    year: int

class MarsData(BaseModel):
    water: float
    soil_composition: Dict[str, int]

class EarthData(BaseModel):
    crop_yield: int

class ChatMessage(BaseModel):
    role: str
    content: str

class AIChatbotInput(BaseModel):
    messages: List[ChatMessage]
    context: Optional[str] = None  # 'earth' or 'mars'

# DeepSeek API configuration
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", MY_ENV_VAR)
DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions"  

# Corn knowledge reference for the chatbot
CORN_KNOWLEDGE = """
# Earth Corn Knowledge
- Current average corn yield on Earth: ~180 bushels per acre (as of 2024)
- Earth corn is grown using traditional agricultural methods with advanced irrigation and fertilization
- Major challenges: climate change, water scarcity, pest resistance
- Future yields expected to reach ~275 bushels/acre by 2100
- Corn was first domesticated in Mexico about 10,000 years ago
- Modern corn is the result of thousands of years of selective breeding

# Mars Corn Knowledge
- Current Mars corn yield: ~5 bushels per acre in experimental habitats (as of 2050)
- Mars corn must be grown in enclosed habitats with artificial atmosphere
- Major challenges: radiation, low gravity, limited water, soil composition
- Projections show yields reaching ~190 bushels/acre by 2100
- First experimental Mars corn grown in 2035 at Olympus Base
- Mars colony agricultural centers: Arcadia Dome (est. 2047)

# General Corn Facts
- Corn is the most widely produced grain in the world
- Scientific name: Zea mays
- Corn is technically a type of grass
- A single corn plant can produce up to 1,000 kernels
- Corn is used in thousands of products including biofuel, plastics, and sweeteners
"""

# Yield prediction functions
@app.get("/predict/{year}")
def predict_yield(year: int):
    """Allow predictions via GET requests for Earth corn yields."""
    try:
        predictor = YieldPredictor()
        prediction = predictor.predict_yield(year)
        return {"year": year, "predicted_yield": prediction}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/marsPredict/{year}")
def mars_predict_yield(year: int):
    """Allow predictions via GET requests for Mars corn yields."""
    try:
        predictor = MarsYieldPredictor()
        prediction = predictor.predict_yield_yes(year)
        return {"year": year, "predicted_yield": prediction}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# AI Chatbot endpoint using DeepSeek API
@app.post("/ai-chatbot")
async def ai_chatbot(input_data: AIChatbotInput):
    """Process chatbot messages and return a DeepSeek-generated response."""
    try:
        # Add system instructions to the messages
        corn_system_message = {
            "role": "system",
            "content": f"""You are CornHusker, an AI assistant specializing in corn agriculture across the solar system. 
            The user is viewing information about {input_data.context.upper() if input_data.context else 'space'} corn agriculture.
            
            Use this knowledge reference when answering questions:
            {CORN_KNOWLEDGE}
            
            Keep your answers conversational, helpful, and focused on corn agriculture. 
            If asked about corn yield predictions, refer to the data provided.
            Be truthful, and if you don't know something, say so rather than making up information.
            """
        }
        
        # Prepare messages for the DeepSeek API
        messages = [corn_system_message]
        
        for msg in input_data.messages:
            # Skip any system messages from the frontend
            if msg.role == "system":
                continue
            messages.append({"role": msg.role, "content": msg.content})
        
        # Call DeepSeek API
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {DEEPSEEK_API_KEY}"
        }
        
        payload = {
            "model": "deepseek-chat",  # Adjust based on available DeepSeek models
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 500
        }
        
        try:
            response = requests.post(
                DEEPSEEK_API_URL,
                headers=headers,
                data=json.dumps(payload),
                timeout=15
            )
            
            response.raise_for_status()  # Raise exception for HTTP errors
            response_data = response.json()
            
            # Extract the assistant's message (adjust based on DeepSeek's response format)
            ai_response = response_data["choices"][0]["message"]["content"]
            
            return {"response": ai_response}
            
        except requests.exceptions.RequestException as e:
            # Handle API errors
            error_message = str(e)
            try:
                error_data = response.json()
                if "error" in error_data:
                    error_message = error_data["error"]["message"]
            except:
                pass
                
            # Use a fallback response and log the error
            print(f"API Error: {error_message}")
            
            # Use the fallback function if the API fails
            fallback_response = generate_fallback_response(
                [msg.dict() for msg in input_data.messages], 
                input_data.context
            )
            return {"response": fallback_response}
    
    except Exception as e:
        # Generic error handling
        print(f"Unexpected error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

# For local testing/fallback without API
def generate_fallback_response(messages, context):
    """Generate a fallback response if the AI API is unavailable."""
    # Get the last user message
    last_message = messages[-1]["content"].lower() if messages else ""
    
    # Simple keyword matching as a fallback
    if "yield" in last_message or "prediction" in last_message:
        if context == "earth":
            return "Earth corn yields are projected to reach around 275 bushels per acre by 2100. For more precise predictions, please use the prediction tool."
        elif context == "mars":
            return "Mars corn yields are expected to grow from experimental levels today to approximately 190 bushels per acre by 2100 as our agricultural technology advances."
    
    # Default fallback response
    return "I'm CornHusker, your expert on corn agriculture in space. While I'm having trouble connecting to my knowledge base right now, I can still help with basic information about corn cultivation on Earth and Mars."