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
from langchain_core.language_models import LLM
import requests
from typing import Any, List, Optional
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS

# Custom OpenRouter LLM Implementation
class OpenRouterLLM(LLM):
    api_key: str
    model: str
    
    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        headers = {
            "HTTP-Referer": "https://localhost",  # Required for OpenRouter
            "Authorization": f"Bearer {self.api_key}"
        }
        
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json={
                "model": self.model,
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 512,
                "temperature": 0.3
            }
        )
        
        if response.status_code == 200:
            return response.json()["choices"][0]["message"]["content"]
        else:
            raise Exception(f"Error from OpenRouter API: {response.text}")

    @property
    def _llm_type(self) -> str:
        return "openrouter"

# Load environment variables
load_dotenv()

OPEN_ROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL")

if not OPEN_ROUTER_API_KEY:
    raise RuntimeError("❌ OPEN_ROUTER_API_KEY is missing in .env file!")

llm = OpenRouterLLM(
    api_key=OPEN_ROUTER_API_KEY,
    model=OPENROUTER_MODEL
)

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

class QueryInput(BaseModel):
    query: str

# ✅ RAG Components
DB_FAISS_PATH = os.path.join(os.path.dirname(__file__), "vectorstore/db_faiss")
CUSTOM_PROMPT_TEMPLATE = """
You are an AI medical assistant. Use the provided context to generate a structured, informative answer.

📌 **Guidelines:**
- Provide a **clear and structured** answer.
- Use **bullet points** and **bold headings** where needed.
- Keep it **easy to read** for non-medical users.
- End with a **medical disclaimer**.

📌 **Context:**
{context}

📌 **User's Question:**
{question}

💡 **AI's Answer:**
"""

def custom_prompt(template):
    return PromptTemplate(template=template, input_variables=["context", "question"])

def is_medical_query(query: str, llm_instance: OpenRouterLLM) -> bool:
    prompt = """
    Classify the following question as 'medical' or 'non-medical'. 
    - A 'medical' question is related to diseases, symptoms, medications, healthcare, treatments, or medical research.
    - A 'non-medical' question is anything else.
    Only respond with one word: 'medical' or 'non-medical'.
    Query: {query}
    """.format(query=query)
    
    response = llm_instance._call(prompt).strip().lower()
    return "medical" in response

# Initialize RAG components
try:
    embedding_model = HuggingFaceEmbeddings(
        model_name="sentence-transformers/paraphrase-MiniLM-L3-v2"
    )
    if os.path.exists(DB_FAISS_PATH):
        db = FAISS.load_local(DB_FAISS_PATH, embedding_model, allow_dangerous_deserialization=True)
        qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=db.as_retriever(search_kwargs={'k': 7}),
            return_source_documents=True,
            chain_type_kwargs={'prompt': custom_prompt(CUSTOM_PROMPT_TEMPLATE)}
        )
        logger.info("✅ RAG components loaded successfully!")
    else:
        raise RuntimeError("❌ FAISS database not found!")
except Exception as e:
    logger.error(f"❌ Error loading RAG components: {str(e)}")
    raise

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

# ✅ Query Assistance API using OpenRouter and RAG
@app.post("/ask")
async def query_assistance(data: QueryInput):
    try:
        # Check if query is medical-related
        if not is_medical_query(data.query, llm):
            return {"response": "I can only answer medical-related questions. Please ask about health or medicine."}
        
        # Use RAG chain to get response
        response = qa_chain.invoke({
            'query': data.query
        })
        
        # Format response with sources
        answer = response["result"]
        sources = [str(doc) for doc in response["source_documents"]]
        
        return {
            "response": answer,
            "sources": sources  # Optional: Frontend can choose to display sources or not
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
