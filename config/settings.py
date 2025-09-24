"""
Configuration settings for Stock Prediction Project
"""

import os
from pathlib import Path

# Project structure
PROJECT_ROOT = Path(__file__).parent.parent
BACKEND_DIR = PROJECT_ROOT / "backend"
FRONTEND_DIR = PROJECT_ROOT / "frontend"
DOCS_DIR = PROJECT_ROOT / "docs"

# Data directories
DATA_DIR = BACKEND_DIR / "data"
RAW_DATA_DIR = DATA_DIR / "raw_data"
PROCESSED_DATA_DIR = DATA_DIR / "processed_data"

# Model directories
MODELS_DIR = BACKEND_DIR / "models"
SAVED_MODELS_DIR = MODELS_DIR / "saved_models"

# API settings
API_HOST = "0.0.0.0"
API_PORT = 8000
API_RELOAD = True

# Frontend settings
FRONTEND_PORT = 5173
FRONTEND_HOST = "localhost"

# Model default configuration
DEFAULT_MODEL_CONFIG = {
    'sequence_length': 60,
    'hidden_size': 64,
    'num_layers': 1,
    'dropout': 0.5,
    'rnn_type': 'LSTM',
    'learning_rate': 0.001,
    'weight_decay': 1e-4,
    'epochs': 100,
    'batch_size': 32,
    'patience': 7,
    'gradient_clip': 1.0,
    'use_attention': True,
    'test_split_date': '2025-01-01'
}

# Data fetching settings
DEFAULT_DATA_CONFIG = {
    'start_date': '2020-01-01',
    'end_date': None,
    'output_format': 'parquet',
    'save_to_file': True
}

# Ensure directories exist
for directory in [DATA_DIR, RAW_DATA_DIR, PROCESSED_DATA_DIR, MODELS_DIR, SAVED_MODELS_DIR]:
    directory.mkdir(parents=True, exist_ok=True)
