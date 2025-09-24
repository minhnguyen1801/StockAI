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
import argparse


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


def main(
    ticker: str = 'AAPL',
    epochs: int = 3,
    hidden_size: int = 64,
    num_layers: int = 1,
    dropout: float = 0.5,
    weight_decay: float = 1e-4,
    rnn_type: str = 'LSTM',
    use_attention: bool = True,
    seq_len: int = 60,
    batch_size: int = 32,
    patience: int = 7,
    lr: float = 1e-3,
    test_split_date: str = '2025-01-01',
):
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
        sequence_length=seq_len,
        hidden_size=hidden_size,
        num_layers=num_layers,
        dropout=dropout,
        rnn_type=rnn_type,
        learning_rate=lr,
        weight_decay=weight_decay,
        use_attention=use_attention,
    )

    print("2) Preparing data...")
    input_size = predictor.prepare_data(
        data_path=data_path,
        target_column='Close',
        test_split_date=test_split_date
    )

    print("3) Building model...")
    predictor.build_model(input_size)

    print("4) Training (few epochs)...")
    predictor.train(epochs=epochs, batch_size=batch_size, patience=patience, gradient_clip=1.0)

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
    parser = argparse.ArgumentParser(description='Quick test stock prediction model without server')
    parser.add_argument('--ticker', type=str, default='AAPL', help='Stock ticker symbol')
    parser.add_argument('--epochs', type=int, default=3, help='Number of training epochs')
    parser.add_argument('--hidden_size', type=int, default=64)
    parser.add_argument('--num_layers', type=int, default=1)
    parser.add_argument('--dropout', type=float, default=0.5)
    parser.add_argument('--weight_decay', type=float, default=1e-4)
    parser.add_argument('--rnn_type', type=str, default='LSTM', choices=['LSTM','GRU'])
    parser.add_argument('--no_attention', action='store_true', help='Disable attention mechanism')
    parser.add_argument('--seq_len', type=int, default=60)
    parser.add_argument('--batch_size', type=int, default=32)
    parser.add_argument('--patience', type=int, default=7)
    parser.add_argument('--lr', type=float, default=1e-3)
    parser.add_argument('--test_split_date', type=str, default='2025-01-01')
    args = parser.parse_args()
    main(
        ticker=args.ticker.upper(),
        epochs=args.epochs,
        hidden_size=args.hidden_size,
        num_layers=args.num_layers,
        dropout=args.dropout,
        weight_decay=args.weight_decay,
        rnn_type=args.rnn_type,
        use_attention=not args.no_attention,
        seq_len=args.seq_len,
        batch_size=args.batch_size,
        patience=args.patience,
        lr=args.lr,
        test_split_date=args.test_split_date,
    )
