# 📈 Stock Market Prediction with Neural Networks

A comprehensive machine learning system for stock market prediction using advanced Recurrent Neural Networks (RNN) with attention mechanisms. This project combines deep learning, data processing, and web technologies to provide accurate stock price predictions.

## 🚀 Features

### 🤖 Advanced AI Models
- **LSTM/GRU Networks**: State-of-the-art recurrent neural networks
- **Attention Mechanism**: Enhanced focus on important time steps
- **Multiple Architecture Support**: Configurable LSTM/GRU architectures
- **Early Stopping**: Prevents overfitting with validation monitoring
- **Gradient Clipping**: Stable training with gradient normalization

### 📊 Comprehensive Data Processing
- **Real-time Data Fetching**: Yahoo Finance integration via yfinance
- **Technical Indicators**: 47+ technical and fundamental features
- **Feature Engineering**: Advanced preprocessing and normalization
- **Time Series Handling**: Proper sequence generation and splitting
- **Multiple Stock Support**: Process multiple tickers simultaneously

### 🎯 Performance Metrics
- **R² Score**: Model goodness of fit
- **RMSE/MAE**: Error measurement
- **MAPE**: Percentage-based accuracy
- **Direction Accuracy**: Trend prediction capability
- **Comprehensive Visualization**: Training history and prediction plots

### 🌐 Full-Stack Web Application
- **Modern Frontend**: React with TypeScript and Tailwind CSS
- **REST API**: FastAPI backend with comprehensive endpoints
- **Real-time Predictions**: Interactive prediction interface
- **Beautiful UI**: Modern design with dark/light mode support

## 📁 Project Structure

```
Stock_prediction/
├── 📁 backend/                    # Python backend
│   ├── 📁 api/                   # FastAPI endpoints
│   │   └── main.py               # Main API server
│   ├── 📁 data/                  # Data processing modules
│   │   ├── data_fetching.py      # Yahoo Finance integration
│   │   ├── data_processing.py    # Feature engineering
│   │   ├── raw_data/            # Historical stock data (Parquet)
│   │   └── processed_data/      # Processed datasets (CSV)
│   ├── 📁 models/               # ML models and training
│   │   ├── rnn_model.py         # RNN implementation
│   │   └── saved_models/        # Trained model weights
│   ├── 📁 training/             # Training scripts
│   │   ├── train.py             # Main training pipeline
│   │   └── quick_test.py        # Quick testing script
│   └── 📁 utils/                # Utility functions
├── 📁 frontend/                  # React frontend
│   ├── 📁 src/
│   │   ├── 📁 components/       # React components
│   │   │   ├── StockPredictor.tsx
│   │   │   ├── ui/              # Reusable UI components
│   │   │   └── ...
│   │   └── App.tsx              # Main application
│   └── package.json             # Frontend dependencies
├── 📁 config/                   # Configuration files
│   ├── requirements.txt         # Python dependencies
│   └── settings.py              # App settings
└── 📁 results/                  # Training results and reports
    └── summary_report.txt       # Performance summary
```

## 🛠️ Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Stock_prediction
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r config/requirements.txt
   ```

4. **Install PyTorch** (GPU support recommended)
   ```bash
   # For CUDA (GPU)
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
   
   # For CPU only
   pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## 🚀 Usage

### 1. Data Collection & Processing

Fetch and process stock data:

```python
from backend.data.data_fetching import fetch_stock_data
from backend.data.data_processing import get_processed_stock_data

# Fetch raw data
stock_data = fetch_stock_data("AAPL", period="5y", save_to_file=True)

# Process and engineer features
processed_data = get_processed_stock_data("AAPL")
```

### 2. Model Training

Train the RNN model:

```python
from backend.models.rnn_model import StockPredictor

# Initialize predictor
predictor = StockPredictor(
    sequence_length=60,
    hidden_size=64,
    num_layers=1,
    dropout=0.5,
    rnn_type='LSTM',
    use_attention=True
)

# Prepare data
input_size = predictor.prepare_data("processed_data/AAPL_processed_data.csv")

# Build and train model
predictor.build_model(input_size)
predictor.train(epochs=100, batch_size=32, patience=7)

# Evaluate and visualize results
train_metrics, test_metrics = predictor.evaluate()
predictor.plot_results()
```

### 3. Web Application

Start the development servers:

**Backend API:**
```bash
cd backend/api
python main.py
# API available at http://localhost:8000
```

**Frontend:**
```bash
cd frontend
npm run dev
# Frontend available at http://localhost:5173
```

### 4. API Usage

**Fetch Stock Data:**
```bash
curl -X POST "http://localhost:8000/api/fetch-data" \
     -H "Content-Type: application/json" \
     -d '{"ticker": "AAPL", "start_date": "2020-01-01"}'
```

**Make Predictions:**
```bash
curl -X POST "http://localhost:8000/api/predict" \
     -H "Content-Type: application/json" \
     -d '{"ticker": "AAPL", "retrain": false}'
```

## 📊 Model Performance

Based on recent training results:

| Stock | R² Score | RMSE | MAPE | Direction Accuracy |
|-------|----------|------|------|-------------------|
| AAPL  | 0.7254   | 7.58 | 2.50% | 51.69% |
| MSFT  | 0.6565   | 29.24| 5.49% | 56.78% |

**Average Performance:**
- **R² Score**: 0.6909
- **MAPE**: 4.00%
- **Direction Accuracy**: 54.23%

## 🧠 Model Architecture

### RNN with Attention Mechanism

```
Input Layer (60 time steps × 47 features)
           ↓
    LSTM/GRU Layers (64 hidden units)
           ↓
    Attention Mechanism
           ↓
    Dropout (0.5)
           ↓
    Dense Output Layer
           ↓
    Stock Price Prediction
```

### Key Features:
- **Sequence Length**: 60 days lookback
- **Hidden Units**: 64 (configurable)
- **Attention**: Focus on important time steps
- **Regularization**: Dropout and L2 weight decay
- **Optimization**: Adam optimizer with learning rate scheduling

## 🔧 Configuration

### Model Parameters
```python
config = {
    'sequence_length': 60,      # Look back 60 days
    'hidden_size': 64,         # Hidden units in RNN
    'num_layers': 1,           # Number of RNN layers
    'dropout': 0.5,            # Dropout rate
    'rnn_type': 'LSTM',        # 'LSTM' or 'GRU'
    'learning_rate': 0.001,    # Learning rate
    'weight_decay': 1e-4,      # L2 regularization
    'epochs': 100,             # Training epochs
    'batch_size': 32,          # Batch size
    'patience': 7,             # Early stopping patience
    'use_attention': True      # Enable attention mechanism
}
```

### Supported Stocks
Currently trained models available for:
- **AAPL** (Apple Inc.)
- **MSFT** (Microsoft Corporation)
- **GOOGL** (Alphabet Inc.)
- **META** (Meta Platforms)
- **TSLA** (Tesla Inc.)

## 📈 Technical Indicators

The model uses 47+ engineered features including:

### Price-Based Indicators
- Moving averages (SMA, EMA)
- Bollinger Bands
- Price momentum indicators
- Volatility measures

### Technical Analysis
- RSI (Relative Strength Index)
- MACD (Moving Average Convergence Divergence)
- Stochastic Oscillator
- Williams %R

### Volume Indicators
- Volume moving averages
- On-Balance Volume (OBV)
- Volume Price Trend (VPT)

### Custom Features
- Price change percentages
- High-Low spreads
- Gap indicators
- Trend strength measures

## 🚨 Important Notes

### ⚠️ Disclaimer
This project is for **educational and research purposes only**. Stock market predictions are inherently uncertain and should not be used as the sole basis for investment decisions. Always consult with financial advisors before making investment choices.

### 🔒 Data Privacy
- No personal data is collected or stored
- All data comes from publicly available sources (Yahoo Finance)
- No API keys required for basic functionality

### 🐛 Troubleshooting

**Common Issues:**

1. **CUDA Out of Memory**
   ```python
   # Reduce batch size or sequence length
   predictor.train(batch_size=16, sequence_length=30)
   ```

2. **Data Not Found**
   ```bash
   # Ensure processed data exists
   ls backend/data/processed_data/
   ```

3. **Frontend Build Issues**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **PyTorch** - Deep learning framework
- **yfinance** - Stock data API
- **FastAPI** - Modern web framework
- **React** - Frontend library
- **Yahoo Finance** - Data source

## 📞 Contact

For questions, suggestions, or collaboration opportunities, please open an issue or contact the maintainers.

---

**Built with ❤️ for the machine learning and finance community**
