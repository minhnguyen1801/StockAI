"""
Utility functions for the Stock Prediction project
"""

import os
import logging
from datetime import datetime
from pathlib import Path
import sys

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

def setup_logging(log_level=logging.INFO):
    """Setup logging configuration"""
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler(f'logs/stock_prediction_{datetime.now().strftime("%Y%m%d")}.log')
        ]
    )
    return logging.getLogger(__name__)

def ensure_directory_exists(directory_path):
    """Ensure a directory exists, create if it doesn't"""
    Path(directory_path).mkdir(parents=True, exist_ok=True)

def get_project_root():
    """Get the project root directory"""
    return Path(__file__).parent.parent.parent

def validate_ticker(ticker):
    """Validate ticker symbol format"""
    if not ticker:
        return False
    if not isinstance(ticker, str):
        return False
    if len(ticker) < 1 or len(ticker) > 10:
        return False
    return ticker.replace('.', '').replace('-', '').isalnum()

def format_currency(value, decimals=2):
    """Format value as currency"""
    return f"${value:,.{decimals}f}"

def format_percentage(value, decimals=2):
    """Format value as percentage"""
    return f"{value:.{decimals}f}%"

def safe_divide(numerator, denominator, default=0):
    """Safe division that handles zero denominator"""
    try:
        return numerator / denominator if denominator != 0 else default
    except (TypeError, ZeroDivisionError):
        return default
