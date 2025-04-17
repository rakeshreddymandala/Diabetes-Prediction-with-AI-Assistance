# 1. Set TensorFlow logging level to only show errors (suppress info and warnings)
# Level 0 -> all messages are logged (default)
# Level 1 -> INFO messages are not printed
# Level 2 -> INFO and WARNING messages are not printed
# Level 3 -> INFO, WARNING, and ERROR messages are not printed
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# 2. Import TensorFlow after setting environment variable
import tensorflow as tf

# 3. Suppress TensorFlow logging at the logger level (backup suppression)
tf.get_logger().setLevel('ERROR')

# 4. Configure custom logging to make important messages more visible
import logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from huggingface_hub import InferenceClient
import numpy as np
import pickle
from sklearn.preprocessing import StandardScaler
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Diabetes Prediction API",
    description="AI-powered diabetes prediction and assistance API",
    version="1.0.0"
)

# ✅ Load trained ANN model safely
model_path = os.path.join(os.path.dirname(__file__), "deeplearning.keras")
if os.path.exists(model_path):
    model = tf.keras.models.load_model(model_path)
    logger.info("✅ Model loaded successfully!")
else:
    raise RuntimeError("❌ Model file not found! Make sure ANN_Keras.keras exists.")

# ✅ Load StandardScaler safely
scaler_path = os.path.join(os.path.dirname(__file__), "scaler.pkl")
if os.path.exists(scaler_path):
    with open(scaler_path, "rb") as f:
        scaler = pickle.load(f)
    logger.info("✅ Scaler loaded successfully!")
else:
    raise RuntimeError("❌ Scaler file not found! Make sure scaler.pkl exists.")

# ✅ Configure Hugging Face Client
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
if not HUGGINGFACE_API_KEY:
    raise RuntimeError("❌ HUGGINGFACE_API_KEY is missing in .env file!")

client = InferenceClient(
    model="mistralai/Mistral-7B-Instruct-v0.3",
    token=HUGGINGFACE_API_KEY
)

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
        ]]).reshape(1, -1)

        # Scale input data
        input_scaled = scaler.transform(input_data)  

        # Make prediction
        prediction = model.predict(input_scaled)
        predicted_class = np.argmax(prediction)

        # Format result based on predicted class
        result = "The patient has diabetes" if predicted_class == 1 else "The patient does not have diabetes"
        probability = float(prediction[0][predicted_class])  # Get prediction probability

        return {
            "result": result,
            "probability": f"{probability:.2%}",
            "risk_level": "High" if probability > 0.7 else "Medium" if probability > 0.4 else "Low"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ Prediction Error: {str(e)}")

# ✅ AI Assistance API
@app.post("/ai-assist")
async def ai_assistance(data: AIRequest):
    try:
        # Create a structured prompt for Mistral
        prompt = f"""[INST] As a medical AI assistant, analyze this diabetes prediction result: {data.result}

Please provide:
1. A clear explanation of what this means
2. Key health implications
3. Actionable lifestyle recommendations
4. Diet and exercise suggestions
5. When to seek medical attention

Keep the response concise but informative, using simple language.
[/INST]"""

        # Get response from Mistral
        response = client.text_generation(
            prompt,
            max_new_tokens=150,
            temperature=0.7,
            top_p=0.95,
            repetition_penalty=1.15
        )

        if not response:
            raise HTTPException(status_code=500, detail="❌ Empty response from AI model")

        # Clean and format the response
        formatted_response = response.strip().replace("[/INST]", "").replace("[INST]", "")

        return {"assistance": formatted_response}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"❌ AI Assistance Error: {str(e)}")
