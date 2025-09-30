import yfinance as yf
from sklearn.preprocessing import StandardScaler  # currently unused, kept for later steps
import pandas as pd
import numpy as np
from datetime import datetime
import matplotlib.pyplot as plt
import seaborn as sns

# Download recent stock data (default AAPL)
print("Downloading stock data (last ~5 years)...")

try:
    # --- Input ticker ---
    user = input("Enter ticker symbol (default AAPL): ").strip() or "AAPL"

    # --- Build start/end with pandas to avoid TypeError ---
    end_ts = pd.Timestamp.now()
    start_ts = end_ts - pd.DateOffset(years=5)

    start = start_ts.strftime("%Y-%m-%d")
    end = end_ts.strftime("%Y-%m-%d")

    # --- Download ---
    df = yf.download(user, start=start, end=end, auto_adjust=False, progress=False)

    if df is None or df.empty:
        raise ValueError(f"No data returned for '{user}' between {start} and {end}.")

    # --- Reset index to make Date a column ---
    df = df.reset_index()  

    # Ensure 'Date' is datetime and timezone-naive (some sources are tz-aware)
    df['Date'] = pd.to_datetime(df['Date'], errors='coerce')
    try:
        # If tz-aware, drop tz; if already naive, this is a no-op or raises TypeError
        df['Date'] = df['Date'].dt.tz_localize(None)
    except (TypeError, AttributeError):
        pass

    # --- Flatten tuple-style columns: keep only the first part ---
    if isinstance(df.columns, pd.MultiIndex) or any(isinstance(c, tuple) for c in df.columns):
        df.columns = [c[0] if isinstance(c, tuple) else c for c in df.columns]
        # Drop duplicate names produced by flattening (keeps first occurrence)
        df = df.loc[:, ~pd.Index(df.columns).duplicated()]
        print("Flattened columns:", list(df.columns))

    # --- Keep relevant columns ---
    df = df[['Date', 'Open', 'High', 'Low', 'Close', 'Volume', 'Adj Close']]

    # --- Clean ---
    df = df.dropna().copy()

    # --- Diagnostics ---
    print(df.info())
    print(f"Downloaded {len(df)} rows for {user}")
    print(f"Date range: {df['Date'].min().date()} -> {df['Date'].max().date()}")
    print(f"Close range: ${df['Close'].min():.2f} -> ${df['Close'].max():.2f}")

    print("\nFirst 5 rows:")
    print(df.head())

    print("\nBasic stats:")
    print(df.describe())

    # --- Save CSV ---
    out_csv = f"{user}_Stock_Data.csv"
    df.to_csv(out_csv, index=False)
    print(f"\nSaved to '{out_csv}'")

except Exception as e:
    print(f"Error: {e}")
    print("Please check ticker symbol, dates, and internet connectivity.")
    df = None

# --- Plot heatmap (guarded) ---
if df is not None and not df.empty:
    plt.figure(figsize=(10, 6))
    plt.title(f'{user} Stock Data Correlation Heatmap')
    numeric_df = df.select_dtypes(include=[np.number])
    if numeric_df.empty:
        print("No numeric columns available for correlation heatmap.")
    else:
        sns.heatmap(numeric_df.corr(), annot=True, cmap='coolwarm', fmt=".2f")
        plt.tight_layout()
        plt.show()
else:
    print("Skipping heatmap because no data is available.")