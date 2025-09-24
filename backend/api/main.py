"""
FastAPI REST API for Stock Prediction Model
Provides endpoints for stock data fetching, processing, and prediction
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import sys
import os
import uvicorn

# Add backend modules to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from models.rnn_model import StockPredictor
from data.data_fetching import fetch_stock_data
from data.data_processing import get_processed_stock_data

app = FastAPI(
    title="Stock Prediction API",
    description="API for stock market prediction using RNN with attention mechanism",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://localhost:3001"
    ],  # Vite dev server(s)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request/Response models
class StockRequest(BaseModel):
    ticker: str
    start_date: str = "2020-01-01"
    end_date: str = None

class PredictionRequest(BaseModel):
    ticker: str
    retrain: bool = False
    epochs: Optional[int] = None  # Optional override for quick tests

class StockResponse(BaseModel):
    ticker: str
    data_shape: List[int]
    date_range: Dict[str, str]
    status: str

class PredictionResponse(BaseModel):
    ticker: str
    metrics: Dict[str, float]
    model_info: Dict[str, Any]
    prediction_plots: str
    metrics_plots: str

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Stock Prediction API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2025-09-21"}

@app.post("/api/fetch-data", response_model=StockResponse)
async def fetch_stock_data_endpoint(request: StockRequest):
    """
    Fetch and process stock data for a given ticker
    """
    try:
        # Fetch raw stock data
        stock_data = fetch_stock_data(
            request.ticker, 
            start_date=request.start_date,
            end_date=request.end_date,
            save_to_file=True
        )
        
        if stock_data.empty:
            raise HTTPException(status_code=404, detail=f"No data found for ticker {request.ticker}")

        # Process the data
        processed_data = get_processed_stock_data(request.ticker)

        return StockResponse(
            ticker=request.ticker,
            data_shape=list(processed_data.shape),
            date_range={
                "start": processed_data.index.min().strftime('%Y-%m-%d'),
                "end": processed_data.index.max().strftime('%Y-%m-%d')
            },
            status="success"
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/predict", response_model=PredictionResponse)
async def predict_stock_endpoint(request: PredictionRequest):
    """
    Train model and make predictions for a given ticker
    """
    try:
        # Initialize predictor with attention mechanism
        predictor = StockPredictor(
            sequence_length=60,
            hidden_size=64,
            num_layers=1,
            dropout=0.5,
            rnn_type='LSTM',
            learning_rate=0.001,
            weight_decay=1e-4,
            use_attention=True
        )
        
        # Prepare data
        # Resolve processed data path from common locations
        candidate_dirs = [
            os.path.join("backend", "data", "processed_data"),
            os.path.join("processed_data"),
            os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "data", "processed_data"))
        ]
        data_path = None
        for d in candidate_dirs:
            candidate = os.path.join(d, f"{request.ticker}_processed_data.csv")
            if os.path.exists(candidate):
                data_path = candidate
                break
        if data_path is None:
            raise HTTPException(status_code=404, detail=f"Processed data not found for {request.ticker}")
        
        input_size = predictor.prepare_data(
            data_path=data_path,
            target_column='Close',
            test_split_date='2025-01-01'
        )
        
        # Build and train model
        predictor.build_model(input_size)
        predictor.train(
            epochs=request.epochs if request.epochs is not None else 100,
            batch_size=32,
            patience=7,
            gradient_clip=1.0
        )
        
        # Evaluate model
        train_metrics, test_metrics = predictor.evaluate()
        
        # Generate plots
        prediction_plot = predictor.plot_predictions(save_plots=True)
        metrics_plot = predictor.plot_metrics(save_plots=True)
        
        # Save model
        model_path = f"backend/models/saved_models/rnn_model_{request.ticker}.pth"
        predictor.save_model(model_path)
        
        return PredictionResponse(
            ticker=request.ticker,
            metrics={
                "train_r2": train_metrics["r2"],
                "train_mape": train_metrics["mape"],
                "test_r2": test_metrics["r2"],
                "test_mape": test_metrics["mape"],
                "test_rmse": test_metrics["rmse"],
                "direction_accuracy": test_metrics["direction_accuracy"]
            },
            model_info={
                "parameters": sum(p.numel() for p in predictor.model.parameters()),
                "attention_enabled": predictor.use_attention,
                "architecture": predictor.rnn_type
            },
            prediction_plots=prediction_plot,
            metrics_plots=metrics_plot
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tickers")
async def get_available_tickers():
    """
    Get list of available processed tickers
    """
    try:
        processed_data_dir = "backend/data/processed_data"
        if not os.path.exists(processed_data_dir):
            return {"tickers": []}
        
        files = os.listdir(processed_data_dir)
        tickers = [
            f.replace("_processed_data.csv", "")
            for f in files if f.endswith("_processed_data.csv")
        ]
        
        return {"tickers": tickers}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
