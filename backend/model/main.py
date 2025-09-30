from tensorflow import keras
import pandas as pd
import numpy as np  
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt 
import seaborn as sns
import os
from datetime import datetime
import pickle

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' # Suppress TensorFlow logging (1)

data = pd.read_csv('AAPL_Stock_Data.csv')

# Data Preprocessing
# Convert 'Date' to datetime

data['Date'] = pd.to_datetime(data['Date'])

print(data.info())

prediction = data.loc[
    (data['Date'] > datetime(2015, 1, 1)) &
     (data['Date'] < datetime(2020, 1, 1))
]

plt.figure(figsize=(14,7))
plt.plot(data['Date'], data['Close'], label='Close Price', color='green')
plt.title('Close Price Over Time')

# Prepare for LTSM (Sequential)

stock_close = data.filter(['Close'])
dataset = stock_close.values #convert to numpy array
training_data_len = int(np.ceil(len(dataset) * 0.90)) #90% of data for training

# Preprocessing stages
scaler = StandardScaler()
scaled_data = scaler.fit_transform(dataset).reshape(-1, 1)

training_data = scaled_data[:training_data_len] # 90% of data for training

x_train, y_train = [], []

# Create a sliding window for our stock (100 days)
for i in range(100, len(training_data)):
    x_train.append(training_data[i - 100:i, 0])
    y_train.append(training_data[i, 0])

x_train, y_train = np.array(x_train), np.array(y_train)

x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

# build the LSTM model
model = keras.models.Sequential()

# First layer
model.add(keras.layers.LSTM(64, return_sequences = True, input_shape = (x_train.shape[1], 1)))

# Second layer
model.add(keras.layers.LSTM(64, return_sequences = False))

# Third layer
model.add(keras.layers.Dense(128, activation='relu'))

#Fourth layer
model.add(keras.layers.Dropout(0.5))

# Output layer
model.add(keras.layers.Dense(1))

model.summary()
model.compile(optimizer='adam',
              loss="mae",
              metrics=[keras.metrics.RootMeanSquaredError()])

# train the model
training = model.fit(x_train, y_train, epochs=50, batch_size=32)

# prepare the test data
test_data = scaled_data[training_data_len - 100:]
x_test, y_test = [], dataset[training_data_len:]

for i in range(100, len(test_data)):
    x_test.append(test_data[i - 100:i, 0])

x_test = np.array(x_test)
x_test = np.reshape(x_test, (x_test.shape[0], x_test.shape[1], 1))

# make predictions
predictions = model.predict(x_test)
predictions = scaler.inverse_transform(predictions)

#plot the data
train  = data[:training_data_len]
test = data[training_data_len:]

test = test.copy()

test["predictions"] = np.nan
test.loc[test.index[:len(predictions)], "predictions"] = predictions
test["predictions"] = predictions
test = test.dropna()

# Create focused plot showing actual vs predicted prices
plt.figure(figsize=(15, 8))

# Plot only the test period (actual vs predicted)
plt.plot(test['Date'], test['Close'], label='Actual Price', color='blue', linewidth=2)
plt.plot(test['Date'], test['predictions'], label='Predicted Price', color='red', linewidth=2, linestyle='--')

# Formatting for better visibility
plt.xlabel('Date', fontsize=12)
plt.ylabel('Price (USD $)', fontsize=12)
plt.title('Actual vs Predicted Stock Prices (Test Period Only)', fontsize=14, fontweight='bold')
plt.legend(fontsize=12)
plt.grid(True, alpha=0.3)

# Rotate x-axis labels for better readability
plt.xticks(rotation=45)

# Tight layout to prevent label cutoff
plt.tight_layout()

# Show the plot
plt.show()

# Print some statistics to see the difference
print(f"\nPrediction Performance:")
print(f"Average Actual Price: ${test['Close'].mean():.2f}")
print(f"Average Predicted Price: ${test['predictions'].mean():.2f}")
print(f"Difference: ${abs(test['Close'].mean() - test['predictions'].mean()):.2f}")

# Calculate accuracy metrics
mae = np.mean(np.abs(test['Close'] - test['predictions']))
rmse = np.sqrt(np.mean((test['Close'] - test['predictions'])**2))
mape = np.mean(np.abs((test['Close'] - test['predictions']) / test['Close'])) * 100

print(f"Mean Absolute Error (MAE): ${mae:.2f}")
print(f"Root Mean Square Error (RMSE): ${rmse:.2f}")
print(f"Mean Absolute Percentage Error (MAPE): {mape:.2f}%")


try:
    # Use the last 20% of the training sequences as a validation holdout
    if len(x_train) < 10:
        print("\n[Validation] Not enough training samples to create a validation split.")
    else:
        val_count = max(1, int(len(x_train) * 0.2))
        split_idx = len(x_train) - val_count
        x_train_sub, y_train_sub = x_train[:split_idx], y_train[:split_idx]
        x_val_sub, y_val_sub     = x_train[split_idx:], y_train[split_idx:]

        # Evaluate losses (MAE is the compiled loss) and RMSE metric
        train_eval = model.evaluate(x_train_sub, y_train_sub, verbose=0)
        val_eval   = model.evaluate(x_val_sub, y_val_sub, verbose=0)

        # Unpack results (loss, rmse) given model.compile(loss='mae', metrics=[RootMeanSquaredError])
        if isinstance(train_eval, (list, tuple)) and len(train_eval) >= 2:
            train_mae, train_rmse = float(train_eval[0]), float(train_eval[1])
            val_mae, val_rmse     = float(val_eval[0]), float(val_eval[1])
        else:
            # If metrics not returned as list for some reason
            train_mae, train_rmse = float(train_eval), float('nan')
            val_mae, val_rmse     = float(val_eval), float('nan')

        print("\n===== Train vs Validation Loss =====")
        print(f"Train MAE (loss): {train_mae:.4f}")
        print(f"Val   MAE (loss): {val_mae:.4f}")
        if not np.isnan(train_rmse):
            print(f"Train RMSE     : {train_rmse:.4f}")
            print(f"Val   RMSE     : {val_rmse:.4f}")

        # Quick comparison chart
        fig, axes = plt.subplots(1, 2 if not np.isnan(train_rmse) else 1, figsize=(10, 4))
        if not isinstance(axes, np.ndarray):
            axes = np.array([axes])

        # MAE bar chart
        axes[0].bar(["Train", "Validation"], [train_mae, val_mae], color=["#4C78A8", "#F58518"])
        axes[0].set_title("MAE (Lower is better)")
        axes[0].set_ylabel("MAE (scaled units)")
        axes[0].grid(True, axis='y', alpha=0.3)

        # RMSE bar chart (if available)
        if not np.isnan(train_rmse):
            axes[1].bar(["Train", "Validation"], [train_rmse, val_rmse], color=["#4C78A8", "#F58518"])
            axes[1].set_title("RMSE (Lower is better)")
            axes[1].set_ylabel("RMSE (scaled units)")
            axes[1].grid(True, axis='y', alpha=0.3)

        plt.suptitle("Training vs Validation Loss Comparison", fontsize=12)
        plt.tight_layout()
        plt.show()
except Exception as e:
    print(f"[Validation] Skipped due to error: {e}")

pickle.dump(model, open('stock_model.pkl', 'wb'))
pickle.dump(scaler, open('scaler.pkl', 'wb'))
model.save("stock_model.keras")
