"""
Quick test runner: fetch/process data for a ticker and run a very short training
to validate the pipeline end-to-end without the API.
"""
import os
import sys
from datetime import datetime

CURRENT_DIR = os.path.dirname(__file__)
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from data.data_processing import get_processed_stock_data
from models.rnn_model import StockPredictor


def find_processed_csv(ticker: str) -> str:
    candidates = [
        os.path.join(BACKEND_DIR, 'data', 'processed_data', f'{ticker}_processed_data.csv'),
        os.path.join('processed_data', f'{ticker}_processed_data.csv'),
        os.path.join(os.getcwd(), 'processed_data', f'{ticker}_processed_data.csv'),
    ]
    for p in candidates:
        if os.path.exists(p):
            return p
    return ''


def main(ticker: str = 'AAPL'):
    print(f"=== Quick test for {ticker} ===")

    # Ensure processed data exists
    print("1) Processing data if needed...")
    get_processed_stock_data(ticker, period='5y', include_fundamentals=True, save_to_csv=True)

    data_path = find_processed_csv(ticker)
    if not data_path:
        raise FileNotFoundError(f"Processed CSV not found for {ticker}")
    print(f"   Using processed data: {data_path}")

    # Initialize a lightweight model
    predictor = StockPredictor(
        sequence_length=60,
        hidden_size=32,
        num_layers=1,
        dropout=0.2,
        rnn_type='LSTM',
        learning_rate=1e-3,
        weight_decay=1e-5,
        use_attention=True,
    )

    print("2) Preparing data...")
    input_size = predictor.prepare_data(
        data_path=data_path,
        target_column='Close',
        test_split_date='2025-01-01'
    )

    print("3) Building model...")
    predictor.build_model(input_size)

    print("4) Training (few epochs)...")
    predictor.train(epochs=3, batch_size=32, patience=2, gradient_clip=1.0)

    print("5) Evaluating...")
    train_metrics, test_metrics = predictor.evaluate()
    print("Train:", train_metrics)
    print("Test:", test_metrics)

    print("6) Saving artifacts...")
    os.makedirs(os.path.join(BACKEND_DIR, 'models', 'saved_models'), exist_ok=True)
    model_path = os.path.join(BACKEND_DIR, 'models', 'saved_models', f'rnn_model_{ticker}_quicktest.pth')
    predictor.save_model(model_path)

    # Save plots (in project root or CWD)
    predictor.plot_results(save_plots=True)
    predictor.plot_metrics_chart(save_plots=True)

    print(f"\n✅ Quick test complete. Model saved to: {model_path}")


if __name__ == '__main__':
    main()
