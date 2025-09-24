"""
Main Script for Stock Market Prediction with RNN Deep Learning
===============================================================

This script provides a complete pipeline for stock market prediction using 
recurrent neural networks (LSTM/GRU) with comprehensive data processing,
leak-free feature engineering, and robust evaluation.

Features:
- Automated data fetching and processing
- 48 leak-free technical and fundamental features
- PyTorch-based RNN with LSTM/GRU architecture
- Proper time-series data preparation and validation
- Comprehensive evaluation metrics and visualization
- Production-ready model saving and loading

Author: AI Assistant
Date: September 2025
"""

import os
import sys
import argparse
from datetime import datetime
import pandas as pd
import numpy as np

# Ensure backend package is on the path when running this script directly
CURRENT_DIR = os.path.dirname(__file__)
BACKEND_DIR = os.path.abspath(os.path.join(CURRENT_DIR, ".."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

# Import our modules from backend package
from data.data_fetching import fetch_stock_data, load_stock_data
from data.data_processing import get_processed_stock_data
from models.rnn_model import StockPredictor

def setup_directories():
    """Create necessary directories if they don't exist (under backend)."""
    directories = [
        os.path.join(BACKEND_DIR, 'data'),
        os.path.join(BACKEND_DIR, 'data', 'processed_data'),
        os.path.join(BACKEND_DIR, 'models'),
        os.path.join(BACKEND_DIR, 'models', 'saved_models'),
        os.path.join(BACKEND_DIR, 'results'),
    ]
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")

def fetch_and_process_data(tickers, start_date='2020-01-01', end_date=None):
    """
    Fetch and process stock data for given tickers
    
    Args:
        tickers: List of stock tickers
        start_date: Start date for data fetching
        end_date: End date for data fetching (defaults to today)
    
    Returns:
        Dictionary with processing results
    """
    if end_date is None:
        end_date = datetime.now().strftime('%Y-%m-%d')
    
    results = {}
    
    for ticker in tickers:
        print(f"\n{'='*50}")
        print(f"Fetching and Processing {ticker}")
        print(f"{'='*50}")
        
        try:
            # Step 1: Fetch stock data
            print(f"1. Fetching stock data for {ticker}...")
            stock_data = fetch_stock_data(ticker, start_date, end_date)
            
            if stock_data is None or stock_data.empty:
                print(f"No data fetched for {ticker}")
                continue
            
            print(f"   Fetched {len(stock_data)} days of data")
            
            # Step 2: Process stock data (includes technical indicators and fundamentals)
            print(f"2. Processing data with technical indicators and fundamentals...")
            processed_data = get_processed_stock_data(ticker)
            
            if processed_data is None or processed_data.empty:
                print(f"Processing failed for {ticker}")
                continue
            
            print(f"   Processed data: {processed_data.shape}")
            print(f"   Features: {processed_data.shape[1]}")
            try:
                start_dt = processed_data.index.min()
                end_dt = processed_data.index.max()
                print(f"   Date range: {start_dt} to {end_dt}")
            except Exception:
                print("   Date range: unavailable")
            
            results[ticker] = {
                'status': 'success',
                'data_shape': processed_data.shape,
                'features': processed_data.shape[1],
                'date_range': (processed_data.index.min(), processed_data.index.max())
            }
            
        except Exception as e:
            print(f"Error processing {ticker}: {str(e)}")
            results[ticker] = {
                'status': 'error',
                'error': str(e)
            }
    
    return results

def train_rnn_models(tickers, model_config=None):
    """
    Train RNN models for given tickers
    
    Args:
        tickers: List of stock tickers
        model_config: Dictionary with model configuration
    
    Returns:
        Dictionary with training results
    """
    if model_config is None:
        model_config = {
            'sequence_length': 60,
            'hidden_size': 128,
            'num_layers': 2,
            'dropout': 0.2,
            'rnn_type': 'LSTM',
            'learning_rate': 0.001,
            'epochs': 100,
            'batch_size': 32,
            'patience': 10,
            'test_split_date': '2025-01-01'
        }
    
    results = {}
    
    for ticker in tickers:
        data_file = os.path.join(BACKEND_DIR, 'data', 'processed_data', f'{ticker}_processed_data.csv')
        
        if not os.path.exists(data_file):
            print(f"Processed data file not found for {ticker}: {data_file}")
            results[ticker] = {'status': 'data_not_found'}
            continue
        
        print(f"\n{'='*50}")
        print(f"Training RNN Model for {ticker}")
        print(f"{'='*50}")
        
        try:
            # Initialize predictor
            predictor = StockPredictor(
                sequence_length=model_config['sequence_length'],
                hidden_size=model_config['hidden_size'],
                num_layers=model_config['num_layers'],
                dropout=model_config['dropout'],
                rnn_type=model_config['rnn_type'],
                learning_rate=model_config['learning_rate']
            )
            
            # Prepare data
            print("1. Preparing data...")
            input_size = predictor.prepare_data(
                data_path=data_file,
                target_column='Close',
                test_split_date=model_config['test_split_date']
            )
            
            # Build model
            print("2. Building model...")
            predictor.build_model(input_size)
            
            # Train model
            print("3. Training model...")
            predictor.train(
                epochs=model_config['epochs'],
                batch_size=model_config['batch_size'],
                patience=model_config['patience']
            )
            
            # Evaluate model
            print("4. Evaluating model...")
            train_metrics, test_metrics = predictor.evaluate()
            
            # Generate plots
            print("5. Generating plots...")
            predictor.plot_results(save_plots=True)
            
            # Save model
            model_path = os.path.join(BACKEND_DIR, 'models', 'saved_models', f'rnn_model_{ticker}.pth')
            predictor.save_model(model_path)
            
            results[ticker] = {
                'status': 'success',
                'train_metrics': train_metrics,
                'test_metrics': test_metrics,
                'model_path': model_path,
                'predictor': predictor
            }
            
            print(f"✅ {ticker} model training completed successfully!")
            
        except Exception as e:
            print(f"❌ Error training model for {ticker}: {str(e)}")
            results[ticker] = {
                'status': 'error',
                'error': str(e)
            }
    
    return results

def generate_summary_report(data_results, model_results, output_file=None):
    """
    Generate a comprehensive summary report
    
    Args:
        data_results: Results from data processing
        model_results: Results from model training
        output_file: Path to save the report
    """
    if output_file is None:
        output_file = os.path.join(BACKEND_DIR, 'results', 'summary_report.txt')
    report_lines = []
    
    # Header
    report_lines.append("=" * 80)
    report_lines.append("STOCK MARKET PREDICTION WITH RNN - SUMMARY REPORT")
    report_lines.append("=" * 80)
    report_lines.append(f"Generated: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    report_lines.append("")
    
    # Data Processing Summary
    report_lines.append("DATA PROCESSING SUMMARY")
    report_lines.append("-" * 40)
    
    for ticker, result in data_results.items():
        if result['status'] == 'success':
            report_lines.append(f"{ticker}:")
            report_lines.append(f"  ✅ Status: Success")
            report_lines.append(f"  📊 Data Shape: {result['data_shape']}")
            report_lines.append(f"  🔢 Features: {result['features']}")
            report_lines.append(f"  📅 Date Range: {result['date_range'][0]} to {result['date_range'][1]}")
        else:
            report_lines.append(f"{ticker}:")
            report_lines.append(f"  ❌ Status: Error - {result.get('error', 'Unknown error')}")
        report_lines.append("")
    
    # Model Training Summary
    report_lines.append("MODEL TRAINING SUMMARY")
    report_lines.append("-" * 40)
    
    successful_models = 0
    total_models = len(model_results)
    
    for ticker, result in model_results.items():
        if result['status'] == 'success':
            successful_models += 1
            metrics = result['test_metrics']
            report_lines.append(f"{ticker} Model Performance:")
            report_lines.append(f"  ✅ Status: Successfully Trained")
            report_lines.append(f"  📈 Test R²: {metrics['R2']:.4f}")
            report_lines.append(f"  📉 Test RMSE: {metrics['RMSE']:.6f}")
            report_lines.append(f"  📊 Test MAPE: {metrics['MAPE']:.2f}%")
            report_lines.append(f"  🎯 Direction Accuracy: {metrics['Direction_Accuracy']:.2f}%")
            report_lines.append(f"  💾 Model Saved: {result['model_path']}")
        else:
            report_lines.append(f"{ticker} Model:")
            status = result['status']
            if status == 'data_not_found':
                report_lines.append(f"  ⚠️  Status: Data not found")
            else:
                report_lines.append(f"  ❌ Status: Error - {result.get('error', 'Unknown error')}")
        report_lines.append("")
    
    # Overall Summary
    report_lines.append("OVERALL SUMMARY")
    report_lines.append("-" * 40)
    report_lines.append(f"📊 Total Tickers Processed: {len(data_results)}")
    report_lines.append(f"🤖 Models Successfully Trained: {successful_models}/{total_models}")
    report_lines.append(f"✅ Success Rate: {(successful_models/total_models)*100:.1f}%")
    
    if successful_models > 0:
        # Calculate average performance
        avg_r2 = np.mean([result['test_metrics']['R2'] for result in model_results.values() 
                         if result['status'] == 'success'])
        avg_mape = np.mean([result['test_metrics']['MAPE'] for result in model_results.values() 
                          if result['status'] == 'success'])
        avg_direction = np.mean([result['test_metrics']['Direction_Accuracy'] for result in model_results.values() 
                                if result['status'] == 'success'])
        
        report_lines.append("")
        report_lines.append("AVERAGE PERFORMANCE ACROSS ALL MODELS")
        report_lines.append("-" * 40)
        report_lines.append(f"📈 Average Test R²: {avg_r2:.4f}")
        report_lines.append(f"📊 Average Test MAPE: {avg_mape:.2f}%")
        report_lines.append(f"🎯 Average Direction Accuracy: {avg_direction:.2f}%")
    
    # Technical Details
    report_lines.append("")
    report_lines.append("TECHNICAL DETAILS")
    report_lines.append("-" * 40)
    report_lines.append("🧠 Model Architecture: LSTM Recurrent Neural Network")
    report_lines.append("📊 Features: 47 leak-free technical and fundamental indicators")
    report_lines.append("⏰ Sequence Length: 60 days lookback")
    report_lines.append("🔄 Training: Early stopping with validation split")
    report_lines.append("📈 Evaluation: MSE, RMSE, MAE, R², MAPE, Direction Accuracy")
    report_lines.append("💾 Framework: PyTorch")
    
    # Files Generated
    report_lines.append("")
    report_lines.append("FILES GENERATED")
    report_lines.append("-" * 40)
    
    # List generated files
    generated_files = []
    for ticker in model_results.keys():
        if model_results[ticker]['status'] == 'success':
            generated_files.extend([
                os.path.join('models', 'saved_models', f"rnn_model_{ticker}.pth"),
                f"stock_prediction_results_*.png"
            ])
    
    for file in set(generated_files):
        if os.path.exists(file) or '*' in file:
            report_lines.append(f"  📄 {file}")
    
    report_lines.append("")
    report_lines.append("=" * 80)
    
    # Write report to file
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write('\n'.join(report_lines))
    
    # Also print to console
    for line in report_lines:
        print(line)
    
    print(f"\n📄 Full report saved to: {output_file}")

def main():
    """
    Interactive main function to execute stock prediction pipeline
    """
    print("🚀 Stock Market Prediction with RNN Deep Learning")
    print("=" * 60)
    
    # Prompt user for stock ticker
    while True:
        ticker = input("\nEnter a stock ticker (e.g., AAPL, MSFT, GOOGL): ").upper().strip()
        if ticker:
            break
        print("Please enter a valid ticker symbol.")
    
    print(f"\n📊 Processing: {ticker}")
    
    # Setup directories
    setup_directories()
    
    # Configuration for original RNN model with regularization
    config = {
        'sequence_length': 60,
        'hidden_size': 128,
        'num_layers': 2,
        'dropout': 0.2,
        'rnn_type': 'LSTM',
        'learning_rate': 0.001,
        'weight_decay': 1e-5,       # L2 regularization
        'epochs': 100,
        'batch_size': 32,
        'patience': 10,
        'gradient_clip': 1.0,       # Gradient clipping
        'test_split_date': '2025-01-01'
    }
    
    # Step 1: Check if processed data exists, if not, fetch and process
    data_file = os.path.join(BACKEND_DIR, 'data', 'processed_data', f'{ticker}_processed_data.csv')
    
    if not os.path.exists(data_file):
        print(f"\n🔄 Step 1: Fetching and Processing Data for {ticker}")
        try:
            # Fetch stock data
            print(f"   Fetching stock data...")
            stock_data = fetch_stock_data(ticker, '2020-01-01')
            
            if stock_data is None or stock_data.empty:
                print(f"❌ No data found for {ticker}. Please check the ticker symbol.")
                return
            
            # Process stock data
            print(f"   Processing data with technical indicators...")
            processed_data = get_processed_stock_data(ticker, period='5y')
            
            if processed_data is None or processed_data.empty:
                print(f"❌ Processing failed for {ticker}")
                return
                
            print(f"   ✅ Data processed successfully: {processed_data.shape}")
            
        except Exception as e:
            print(f"❌ Error processing {ticker}: {str(e)}")
            return
    else:
        print(f"\n✅ Using existing processed data for {ticker}")
        df = pd.read_csv(data_file)
        print(f"   Data shape: {df.shape}")
        if 'Date' in df.columns:
            print(f"   Date range: {df['Date'].min()} to {df['Date'].max()}")
    
    # Step 2: Train RNN Model
    print(f"\n🤖 Step 2: Training RNN Model for {ticker}")

    try:
        # Initialize predictor (using original model with regularization)
        predictor = StockPredictor(
            sequence_length=config['sequence_length'],
            hidden_size=config['hidden_size'],
            num_layers=config['num_layers'],
            dropout=config['dropout'],
            rnn_type=config['rnn_type'],
            learning_rate=config['learning_rate'],
            weight_decay=config['weight_decay']
        )

        # Prepare data
        print("   Preparing data...")
        input_size = predictor.prepare_data(
            data_path=data_file,
            target_column='Close',
            test_split_date=config['test_split_date']
        )

        # Build model
        print("   Building model...")
        predictor.build_model(input_size)

        # Train model
        print("   Training model...")
        predictor.train(
            epochs=config['epochs'],
            batch_size=config['batch_size'],
            patience=config['patience'],
            gradient_clip=config['gradient_clip']
        )

        # Evaluate model
        print("   Evaluating model...")
        train_metrics, test_metrics = predictor.evaluate()

        # Generate plots
        print("   Generating visualization...")
        predictor.plot_results(save_plots=True)
        predictor.plot_metrics_chart(save_plots=True)

        # Save model
        model_path = os.path.join(BACKEND_DIR, 'models', 'saved_models', f'rnn_model_{ticker}.pth')
        predictor.save_model(model_path)

        # Display results
        print(f"\n🎉 Model Training Completed for {ticker}!")
        print("=" * 60)
        print("📊 PERFORMANCE SUMMARY")
        print("=" * 60)
        print(f"✅ Test R²: {test_metrics['R2']:.4f}")
        print(f"📉 Test RMSE: {test_metrics['RMSE']:.6f}")
        print(f"📊 Test MAPE: {test_metrics['MAPE']:.2f}%")
        print(f"🎯 Direction Accuracy: {test_metrics['Direction_Accuracy']:.2f}%")
        print(f"💾 Model saved: {model_path}")
        print(f"📈 Plots saved: Check for stock_prediction_results_*.png")

        # Ask if user wants to process another ticker
        while True:
            another = input("\nWould you like to process another ticker? (y/n): ").lower().strip()
            if another in ['y', 'yes']:
                print("\n" + "="*60)
                main()  # Recursive call for another ticker
                break
            elif another in ['n', 'no']:
                print("\n🎉 Thank you for using Stock Market Prediction!")
                break
            else:
                print("Please enter 'y' or 'n'.")

    except Exception as e:
        print(f"❌ Error training model for {ticker}: {str(e)}")
        return

if __name__ == "__main__":
    main()
