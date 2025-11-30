# StockAI: AI-Powered Stock Prediction & Chatbot Platform

StockAI is a full-stack web application that leverages deep learning (LSTM) and modern web technologies to provide:
- **Stock price prediction** for major tickers (AAPL, GOOGL, MSFT, TSLA, etc.)
- **Interactive AI chatbot** for financial Q&A
- **Beautiful, responsive frontend** (React + Vite)
- **FastAPI backend** with real-time model inference

---

## Features

- **LSTM Neural Network** for time series stock price prediction
- **Historical & future price charting**
- **Multi-day prediction horizon** (1-30 days)
- **Prediction confidence & error metrics**
- **Financial expert chatbot** (Gemini integration)
- **Modern UI/UX** (React, TypeScript, Vite, Tailwind)
- **API-first backend** (FastAPI, Python)
- **Comprehensive model testing & visualization tools**

---

## Project Structure

```
StockAI/
├── backend/           # FastAPI server, ML model, and utilities
│   ├── main.py        # FastAPI app entrypoint
│   ├── prediction_service.py  # LSTM model logic & API
│   ├── gemini_chatbot.py      # Chatbot logic
│   ├── requirements.txt       # Python dependencies
│   ├── ...testing scripts (see below)
│   └── model/
│       ├── AAPL_Stock_Data.csv
│       ├── stock_model.pkl
│       ├── scaler.pkl
│       └── ...
├── frontend/          # React + Vite frontend
│   ├── src/
│   │   ├── App.tsx, main.tsx, ...
│   │   └── components/
│   ├── public/
│   ├── index.html
│   ├── package.json
│   └── ...
└── README.md          # (You are here)
```

---

## Quickstart

### 1. Backend (Python, FastAPI)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # (Windows)
pip install -r requirements.txt
python main.py          # Starts FastAPI server at http://localhost:8000
```

### 2. Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev             # Starts Vite dev server at http://localhost:3000
```

---

## Model & API Details

- **Model:** LSTM (Keras, TensorFlow) trained on 5 years of stock data
- **API Endpoints:**
  - `/predict` (POST): Predicts future stock prices
  - `/chat` (POST): Financial chatbot Q&A
- **Model Artifacts:** Saved in `backend/model/` (pkl, keras, scaler)
- **Testing Scripts:**
  - `test_lstm_model.py`: Full model evaluation, charts, cross-validation
  - `train_loss_visualizer.py`: Training/validation loss curves
  - `quick_lstm_test.py`: Fast model sanity check

---

## Model Testing & Visualization

- Run `python test_lstm_model.py` for a full report (metrics, charts, overfitting analysis)
- Run `python train_loss_visualizer.py` for detailed loss curves
- All plots are saved as PNGs in `backend/`

---

## Frontend Highlights

- **StockPredictor**: Enter ticker, horizon, and get predictions + chart
- **AIChatbox**: Ask financial questions, get AI-powered answers
- **Modern UI**: Responsive, dark/light mode, reusable UI components

---

## API Usage Example

**POST /predict**
```json
{
  "ticker": "AAPL",
  "horizon": 7,
  "model": "lstm"
}
```
**Response:**
```json
{
  "ticker": "AAPL",
  "current_price": 189.23,
  "predicted_price": 192.11,
  "change": 2.88,
  "change_percent": 1.52,
  "confidence": 82.0,
  "horizon": 7,
  "historical_data": [...],
  "prediction_data": [...],
  "model_type": "LSTM",
  "message": "Prediction for AAPL using your exact LSTM model"
}
```

---

## Development & Customization

- **Add new tickers:** Update model/data and retrain
- **Tune model:** Edit `backend/model/main.py` or `prediction_service.py`
- **Frontend customization:** Edit React components in `frontend/src/components/`
- **API keys:** Place in `.env` (see `.env.example`)

---

## Testing & Evaluation

- `test_lstm_model.py`: Full model test suite (metrics, charts, cross-validation)
- `train_loss_visualizer.py`: Training/validation loss analysis
- `quick_lstm_test.py`: Fast API/model check
- All results and plots are saved in `backend/`

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** FastAPI, Python, TensorFlow/Keras, scikit-learn, yfinance
- **Testing/Visualization:** Matplotlib, Seaborn, JSON

---

## Authors & Credits

- **Project Lead:** minhnguyen1801
- **AI/ML:** LSTM model, Gemini chatbot integration
- **Frontend:** Modern React + Vite UI
- **Backend:** FastAPI, scalable API design




---

## License

This project is for educational and research purposes. See individual files for license details.

---

## Tips
- For best results, keep your model and data up to date
- Use the testing scripts to monitor for overfitting
- Customize the frontend for your brand or use-case

---

## Feedback & Contributions

Pull requests and issues are welcome! For questions, contact the project maintainer.



https://github.com/user-attachments/assets/5a4a5b13-ef53-4c68-9d42-ffaea730098d


