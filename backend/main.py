from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from prediction_service import prediction_service
import traceback

# Create FastAPI app
app = FastAPI(title="Stock Prediction API", version="1.0.0")

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Define the data model that matches what frontend sends
class PredictionRequest(BaseModel):
    ticker: str
    horizon: int
    model: str

# Define the response model
class PredictionResponse(BaseModel):
    ticker: str
    current_price: float
    predicted_price: float
    change: float
    change_percent: float
    confidence: float
    horizon: int
    historical_data: list
    prediction_data: list
    model_type: str
    message: str

@app.get("/")
def read_root():
    return {"message": "Stock Prediction API is running!"}

@app.post("/predict", response_model=PredictionResponse)
def predict_stock(request: PredictionRequest):
    """
    Receive user input from frontend and process it with real AI predictions
    """
    print("=" * 50)
    print("RECEIVED USER DATA FROM FRONTEND:")
    print(f"   Ticker: {request.ticker}")
    print(f"   Horizon: {request.horizon} days")
    print(f"   Model: {request.model}")
    print("=" * 50)
    
    try:
        # Validate input
        if request.horizon < 1 or request.horizon > 30:
            raise HTTPException(status_code=400, detail="Horizon must be between 1 and 30 days")
        
        # Make real prediction using our AI model
        prediction_result = prediction_service.predict_stock_price(
            ticker=request.ticker,
            horizon_days=request.horizon
        )
        
        print(f"Prediction completed:")
        print(f"   Current Price: ${prediction_result['current_price']:.2f}")
        print(f"   Predicted Price: ${prediction_result['predicted_price']:.2f}")
        print(f"   Change: ${prediction_result['change']:.2f} ({prediction_result['change_percent']:.2f}%)")
        print(f"   Confidence: {prediction_result['confidence']:.1f}%")
        print("=" * 50)
        
        return PredictionResponse(**prediction_result)
        
    except Exception as e:
        print(f"Error in prediction: {e}")
        print(f"Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

if __name__ == "__main__":
    print("Starting Stock Prediction API...")
    print("API will be available at: http://localhost:8000")
    print("API docs will be at: http://localhost:8000/docs")
    uvicorn.run(app, host="0.0.0.0", port=8000)
