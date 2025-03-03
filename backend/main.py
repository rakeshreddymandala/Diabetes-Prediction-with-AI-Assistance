from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import google.generativeai as genai
import tensorflow as tf
import numpy as np
import pickle
import os
from sklearn.preprocessing import StandardScaler
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# ✅ Load trained ANN model safely
model_path = os.path.join(os.path.dirname(__file__), "deeplearning.keras")
if os.path.exists(model_path):
    model = tf.keras.models.load_model(model_path)
    print("✅ Model loaded successfully!")
else:
    raise RuntimeError("❌ Model file not found! Make sure ANN_Keras.keras exists.")

# ✅ Load StandardScaler safely
scaler_path = os.path.join(os.path.dirname(__file__), "scaler.pkl")
if os.path.exists(scaler_path):
    with open(scaler_path, "rb") as f:
        scaler = pickle.load(f)
    print("✅ Scaler loaded successfully!")
else:
    raise RuntimeError("❌ Scaler file not found! Make sure scaler.pkl exists.")

# ✅ Configure Google Gemini API from .env
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("❌ GOOGLE_API_KEY is missing in .env file!")
genai.configure(api_key=GOOGLE_API_KEY)

# ✅ Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Define request models
class PredictionInput(BaseModel):
    pregnancies: float
    glucose: float
    bloodPressure: float
    skinThickness: float
    insulin: float
    bmi: float
    diabetesPedigreeFunction: float
    age: float

class AIRequest(BaseModel):
    result: str  # Expecting "Yes" or "No"

# ✅ Diabetes Prediction API
@app.post("/predict")
def predict_diabetes(data: PredictionInput):
    try:
        # Convert input to NumPy array and reshape it
        input_data = np.array([[
            data.pregnancies, data.glucose, data.bloodPressure,
            data.skinThickness, data.insulin, data.bmi,
            data.diabetesPedigreeFunction, data.age
        ]]).reshape(1, -1)  # 🔥 Ensure correct shape for model

        # Scale input data
        input_scaled = scaler.transform(input_data)  

        # Make prediction
        prediction = model.predict(input_scaled)
        predicted_class = np.argmax(prediction)  # Get class with highest probability

        # Format result based on predicted class
        result = "The patient has diabetes" if predicted_class == 1 else "The patient does not have diabetes"

        return {"result": result}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Prediction Error: {str(e)}")


# ✅ AI Assistance API
@app.post("/ai-assist")
async def ai_assistance(data: AIRequest):
    try:
        # 🔥 Add a structured prompt
        # 🔥 Improved AI Prompt
        prompt = (
            f"{data.result}. Based on this, provide a detailed yet easy-to-understand explanation of diabetes, "
            f"including its causes, symptoms, and impact on health. Then, offer a structured, practical health guide "
            f"covering lifestyle changes, diet recommendations, exercise routines, and overall well-being. Ensure the "
            f"advice is clear, specific, and actionable, avoiding vague or generic tips. Use a supportive and encouraging "
            f"tone to motivate the user to make positive health choices."
        )


        model = genai.GenerativeModel("gemini-1.5-pro")
        response = model.generate_content(prompt, generation_config={"max_output_tokens": 250})

        # ✅ Handle AI response properly
        if response and hasattr(response, "text"):
            return {"assistance": response.text}
        elif response and response.candidates:
            return {"assistance": response.candidates[0].content.parts[0].text}
        else:
            raise HTTPException(status_code=500, detail="❌ AI response is empty!")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ AI Assistance Error: {str(e)}")
