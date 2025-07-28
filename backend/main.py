# Configure basic logging
import os
import logging
import warnings
import asyncio
from functools import lru_cache
from typing import Any, List, Optional

# Configure custom logging to make important messages more visible
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
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain.chains import RetrievalQA
from langchain_community.vectorstores import FAISS

# Suppress specific warnings
warnings.filterwarnings("ignore", category=FutureWarning)
warnings.filterwarnings("ignore", category=DeprecationWarning)

# Set environment variables to suppress specific warnings
os.environ["TRANSFORMERS_CACHE"] = os.path.join(os.path.dirname(__file__), "model_cache")
os.environ["HF_HOME"] = os.path.join(os.path.dirname(__file__), "model_cache")

# Load environment variables once
load_dotenv()

# Custom OpenRouter LLM Implementation
class OpenRouterLLM(LLM):
    api_key: str
    model: str
    
    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        headers = {
            "HTTP-Referer": "https://localhost",
            "Authorization": f"Bearer {self.api_key}"
        }
        
        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers=headers,
                json={
                    "model": self.model,
                    "messages": [{"role": "user", "content": prompt}],
                    "max_tokens": 512,
                    "temperature": 0.3
                },
                timeout=30
            )
            
            if response.status_code == 200:
                return response.json()["choices"][0]["message"]["content"]
            else:
                raise Exception(f"Error from OpenRouter API: {response.text}")
        except requests.exceptions.RequestException as e:
            raise Exception(f"Network error when calling OpenRouter API: {str(e)}")

    @property
    def _llm_type(self) -> str:
        return "openrouter"

# Validate environment variables
OPEN_ROUTER_API_KEY = os.getenv("OPEN_ROUTER_API_KEY")
OPENROUTER_MODEL = os.getenv("OPENROUTER_MODEL", "microsoft/wizardlm-2-8x22b")
HUGGINGFACE_API_KEY = os.getenv("HUGGINGFACE_API_KEY")

if not OPEN_ROUTER_API_KEY:
    raise RuntimeError("❌ OPEN_ROUTER_API_KEY is missing in .env file!")

if not HUGGINGFACE_API_KEY:
    raise RuntimeError("❌ HUGGINGFACE_API_KEY is missing in .env file!")

# Initialize LLM and Hugging Face client
llm = OpenRouterLLM(
    api_key=OPEN_ROUTER_API_KEY,
    model=OPENROUTER_MODEL
)

client = InferenceClient(
    model="mistralai/Mistral-7B-Instruct-v0.3",
    token=HUGGINGFACE_API_KEY
)

# FastAPI app
app = FastAPI(
    title="Diabetes Prediction API",
    description="AI-powered diabetes prediction and assistance API",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables for lazy loading
_ml_model = None
_scaler = None
_qa_chain = None

# Cache loaders with better error handling
@lru_cache()
def load_ml_model():
    global _ml_model
    if _ml_model is not None:
        return _ml_model
        
    # Try container path first, then local path
    container_path = "/app/backend/deeplearning.keras"
    local_path = os.path.join(os.path.dirname(__file__), "deeplearning.keras")
    
    model_path = container_path if os.path.exists(container_path) else local_path
    
    if not os.path.exists(model_path):
        raise RuntimeError(f"❌ Model file not found at {model_path}!")
        
    try:
        if not os.access(model_path, os.R_OK):
            permissions = oct(os.stat(model_path).st_mode)[-3:]
            raise PermissionError(f"No read permission for model file. Current permissions: {permissions}")
            
        import tensorflow as tf
        tf.keras.utils.disable_interactive_logging()
        
        # Load model with minimal options
        _ml_model = tf.keras.models.load_model(
            model_path,
            compile=False
        )
        
        # Recompile the model
        _ml_model.compile(
            optimizer='adam',
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        logger.info("✅ Model loaded successfully!")
        return _ml_model
    except Exception as e:
        logger.error(f"❌ Error loading model: {str(e)}")
        raise

@lru_cache()
def load_scaler():
    global _scaler
    if _scaler is not None:
        return _scaler
        
    scaler_path = os.path.join(os.path.dirname(__file__), "scaler.pkl")
    if not os.path.exists(scaler_path):
        raise RuntimeError("❌ Scaler file not found!")
        
    try:
        with open(scaler_path, "rb") as f:
            _scaler = pickle.load(f)
        logger.info("✅ Scaler loaded successfully!")
        return _scaler
    except Exception as e:
        logger.error(f"❌ Error loading scaler: {str(e)}")
        raise

def load_rag_components():
    global _qa_chain
    if _qa_chain is not None:
        return _qa_chain
        
    try:
        embedding_model = HuggingFaceEmbeddings(
            model_name="sentence-transformers/paraphrase-MiniLM-L3-v2",
            cache_folder="model_cache",
            model_kwargs={'device': 'cpu'},
            encode_kwargs={'device': 'cpu', 'batch_size': 32}
        )
        
        db_path = os.path.join(os.path.dirname(__file__), "vectorstore/db_faiss")
        if not os.path.exists(db_path):
            raise RuntimeError(f"❌ FAISS database not found at {db_path}!")
            
        db = FAISS.load_local(
            db_path, 
            embedding_model,
            allow_dangerous_deserialization=True
        )
        
        _qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            chain_type="stuff",
            retriever=db.as_retriever(search_kwargs={'k': 7}),
            return_source_documents=True,
            chain_type_kwargs={'prompt': custom_prompt(CUSTOM_PROMPT_TEMPLATE)}
        )
        logger.info("✅ RAG components loaded successfully!")
        return _qa_chain
    except Exception as e:
        logger.error(f"❌ Error loading RAG components: {str(e)}")
        raise

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
    result: str

class QueryInput(BaseModel):
    query: str

# ✅ RAG Components
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
    try:
        prompt = f"""
        Classify the following question as 'medical' or 'non-medical'. 
        - A 'medical' question is related to diseases, symptoms, medications, healthcare, treatments, or medical research.
        - A 'non-medical' question is anything else.
        Only respond with one word: 'medical' or 'non-medical'.
        Query: {query}
        """
        
        response = llm_instance._call(prompt).strip().lower()
        return "medical" in response
    except Exception as e:
        logger.error(f"Error in medical query classification: {str(e)}")
        return True  # Default to treating as medical query

# Initialize components on startup
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Starting up Diabetes Prediction API...")
    # Optionally pre-load critical components
    try:
        await asyncio.to_thread(load_ml_model)
        await asyncio.to_thread(load_scaler)
        logger.info("✅ Critical components pre-loaded successfully!")
    except Exception as e:
        logger.warning(f"⚠️ Could not pre-load components: {str(e)}")

# ✅ Diabetes Prediction API
@app.post("/predict")
async def predict_diabetes(data: PredictionInput):
    try:
        # Load model and scaler
        model = await asyncio.to_thread(load_ml_model)
        scaler = await asyncio.to_thread(load_scaler)
        
        # Convert input to NumPy array
        input_data = np.array([
            [
            data.pregnancies, data.glucose, data.bloodPressure,
            data.skinThickness, data.insulin, data.bmi,
            data.diabetesPedigreeFunction, data.age
            ]
        ])

        # Scale input data
        input_scaled = scaler.transform(input_data)

        # Make prediction
        prediction = model.predict(input_scaled)
        predicted_class = np.argmax(prediction)

        # Format result
        result = "The patient has diabetes" if predicted_class == 1 else "The patient does not have diabetes"
        probability = float(prediction[0][predicted_class])

        return {
            "result": result,
            "probability": f"{probability:.2%}",
            "risk_level": "High" if probability > 0.7 else "Medium" if probability > 0.4 else "Low"
        }
    
    except Exception as e:
        logger.error(f"Prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"❌ Prediction Error: {str(e)}")

# ✅ AI Assistance API
@app.post("/ai-assist")
async def ai_assistance(data: AIRequest):
    try:
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
        response = await asyncio.to_thread(
            client.text_generation,
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
        logger.error(f"AI assistance error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"❌ AI Assistance Error: {str(e)}")

# ✅ Query Assistance API using OpenRouter and RAG
@app.post("/ask")
async def query_assistance(data: QueryInput):
    try:
        # Check if query is medical-related
        if not await asyncio.to_thread(is_medical_query, data.query, llm):
            return {"response": "I can only answer medical-related questions. Please ask about health or medicine."}
        
        # Load RAG components
        qa_chain = await asyncio.to_thread(load_rag_components)
        response = await asyncio.to_thread(qa_chain.invoke, {'query': data.query})
        
        return {
            "response": response["result"],
            "sources": [str(doc)[:200] + "..." if len(str(doc)) > 200 else str(doc) for doc in response["source_documents"]]
        }
        
    except Exception as e:
        logger.error(f"Query assistance error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"❌ Query Error: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "components": {
            "ml_model": _ml_model is not None,
            "scaler": _scaler is not None,
            "rag_chain": _qa_chain is not None
        }
    }

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Diabetes Prediction API",
        "version": "1.0.0",
        "endpoints": ["/predict", "/ai-assist", "/ask", "/health"]
    }
