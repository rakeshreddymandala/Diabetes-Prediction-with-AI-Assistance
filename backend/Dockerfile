# Use official Python slim image
FROM python:3.10-slim

# Set working directory inside the container
WORKDIR /app

# Copy only requirements first (for layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code (main.py, etc.)
COPY . .

# Expose FastAPI port (default is 8000)
EXPOSE 8000

# Start FastAPI app
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
