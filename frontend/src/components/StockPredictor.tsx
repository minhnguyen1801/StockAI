import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Brain, Loader2, Target, Check, Search } from "lucide-react";
import { motion } from "motion/react";

// Popular stock tickers for autocomplete
const POPULAR_TICKERS = [
  "AAPL", "MSFT", "GOOGL", "AMZN", "TSLA", "META", "NVDA", "BRK.B", "UNH", "XOM",
  "JNJ", "JPM", "V", "PG", "HD", "CVX", "MA", "BAC", "ABBV", "PFE",
  "KO", "AVGO", "PEP", "TMO", "COST", "DHR", "VZ", "ADBE", "ACN", "NFLX",
  "CRM", "TXN", "QCOM", "NKE", "RTX", "AMD", "INTC", "IBM", "DIS", "WMT",
  "GE", "CAT", "BA", "MMM", "AXP", "GS", "JPM", "MCD", "NEE", "PM"
];

export function StockPredictor() {
  const [ticker, setTicker] = useState("");
  const [horizon, setHorizon] = useState("");
  const [model, setModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  
  // Autocomplete states
  const [tickerSuggestions, setTickerSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const tickerInputRef = useRef<HTMLInputElement>(null);

  // Autocomplete functions
  const handleTickerChange = (value: string) => {
    const upperValue = value.toUpperCase();
    setTicker(upperValue);
    
    if (upperValue.length >= 1) {
      const suggestions = POPULAR_TICKERS.filter(t =>
        t.startsWith(upperValue)
      ).slice(0, 8); // Show max 8 suggestions
      
      setTickerSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
      setSelectedSuggestionIndex(-1);
    } else {
      setShowSuggestions(false);
      setTickerSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTicker(suggestion);
    setShowSuggestions(false);
    setTickerSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < tickerSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0) {
          handleSuggestionClick(tickerSuggestions[selectedSuggestionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tickerInputRef.current && !tickerInputRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock prediction data
  const generateMockPrediction = () => {
    const currentPrice = Math.random() * 200 + 100;
    const change = (Math.random() - 0.5) * 20;
    const futurePrice = currentPrice + change;
    const confidence = Math.random() * 15 + 85; // 85-100%
    
    const historicalData = Array.from({ length: 30 }, (_, i) => {
      const basePrice = currentPrice - (Math.random() * 20 - 10);
      return {
        day: i + 1,
        price: basePrice + Math.sin(i / 5) * 5 + (Math.random() - 0.5) * 3
      };
    });

    const predictionData = Array.from({ length: parseInt(horizon) || 7 }, (_, i) => {
      const trend = (futurePrice - currentPrice) / (parseInt(horizon) || 7);
      return {
        day: 30 + i + 1,
        price: currentPrice + (trend * (i + 1)) + (Math.random() - 0.5) * 2,
        predicted: true
      };
    });

    return {
      ticker: ticker.toUpperCase(),
      currentPrice: currentPrice.toFixed(2),
      predictedPrice: futurePrice.toFixed(2),
      change: change.toFixed(2),
      changePercent: ((change / currentPrice) * 100).toFixed(2),
      confidence: confidence.toFixed(1),
      model: model,
      horizon: horizon,
      data: [...historicalData, ...predictionData]
    };
  };

  const handlePredict = async () => {
    if (!ticker || !horizon || !model) return;
    
    // Display user input in console for debugging
    console.log('User Input:', {
      ticker: ticker.toUpperCase(),
      horizon: parseInt(horizon),
      model: model,
      timestamp: new Date().toISOString()
    });
    
    setIsLoading(true);
    
    try {
      // Call the Python backend API
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticker: ticker.toUpperCase(),
          horizon: parseInt(horizon),
          model: model
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Prediction failed');
      }

      const result = await response.json();
      
      // Add safety checks
      if (!result || !result.ticker) {
        throw new Error('Invalid response from server');
      }
      
      // Transform API response to match frontend format
      const transformedResult = {
        ticker: result.ticker,
        currentPrice: result.current_price.toString(),
        predictedPrice: result.predicted_price.toString(),
        change: result.change.toString(),
        changePercent: result.change_percent.toString(),
        confidence: result.confidence.toString(),
        model: result.model_type,  // Fixed: use model_type instead of model_used
        horizon: result.horizon.toString(),
        data: [
          ...(result.historical_data || []).map((item: any) => ({
            day: item.day,
            price: item.price,
            is_current: item.is_current || false,  // Add current day flag
            date: item.date  // Add actual date
          })),
          ...(result.prediction_data || []).map((item: any) => ({
            day: item.day,
            price: item.price,
            predicted: true,
            date: item.date  // Add future date
          }))
        ]
      };
      
      setPrediction(transformedResult);
    } catch (error) {
      console.error('Error making prediction:', error);
      // Fallback to mock data if backend is not available
      const mockPrediction = generateMockPrediction();
      setPrediction(mockPrediction);
    }
    
    setIsLoading(false);
  };

  const modelDescriptions = {
    "lstm": "Long Short-Term Memory networks excel at capturing long-range dependencies in sequential data",
    "gru": "Gated Recurrent Units offer similar performance to LSTM with simplified architecture",
    "ensemble": "Combines LSTM, GRU, and transformer models for maximum accuracy"
  };

  return (
    <section id="predictor" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            <Target className="mr-2 h-4 w-4" />
            AI Predictor
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            Try Our{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Stock Predictor
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Enter any stock ticker and see our AI models predict future prices. Choose your preferred neural network architecture and prediction timeframe.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-500" />
                  Stock Prediction Configuration
                </CardTitle>
                <CardDescription>
                  Configure your prediction parameters and let our AI analyze the market
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={(e) => { 
                  e.preventDefault(); 
                  console.log('Form submitted with data:', { ticker, horizon, model });
                  handlePredict(); 
                }} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ticker">Stock Ticker</Label>
                  <div className="relative" ref={tickerInputRef}>
                    <Input
                      id="ticker"
                      name="ticker"
                      placeholder="e.g., AAPL, TSLA, GOOGL"
                      value={ticker}
                      onChange={(e) => handleTickerChange(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="uppercase pr-8"
                      required
                      autoComplete="off"
                    />
                    
                    
                    {/* Autocomplete suggestions */}
                    {showSuggestions && tickerSuggestions.length > 0 && (
                      <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-md shadow-lg max-h-60 overflow-auto">
                        {tickerSuggestions.map((suggestion, index) => (
                          <div
                            key={suggestion}
                            className={`px-3 py-2 cursor-pointer flex items-center justify-between hover:bg-accent ${
                              index === selectedSuggestionIndex ? 'bg-accent' : ''
                            }`}
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            <span className="font-mono text-sm">{suggestion}</span>
                            {ticker === suggestion && (
                              <Check className="h-4 w-4 text-green-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Start typing a stock symbol (e.g., AAP, TS, GOOG) for suggestions
                  </p>
                </div>

                  <div className="space-y-2">
                    <Label htmlFor="horizon">Prediction Horizon (Days)</Label>
                    <Select value={horizon} onValueChange={setHorizon} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select prediction timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                          Type to search or select:
                        </div>
                        <SelectItem value="1">1 Day</SelectItem>
                        <SelectItem value="3">3 Days</SelectItem>
                        <SelectItem value="7">1 Week</SelectItem>
                        <SelectItem value="14">2 Weeks</SelectItem>
                        <SelectItem value="30">1 Month</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="model">AI Model</Label>
                    <Select value={model} onValueChange={setModel} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose neural network model" />
                      </SelectTrigger>
                      <SelectContent>
                        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground border-b">
                          Select AI model type:
                        </div>
                        <SelectItem value="lstm">
                          <div className="flex flex-col">
                            <span className="font-medium">LSTM</span>
                            <span className="text-xs text-muted-foreground">Long Short-Term Memory</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="gru">
                          <div className="flex flex-col">
                            <span className="font-medium">GRU</span>
                            <span className="text-xs text-muted-foreground">Gated Recurrent Unit</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="ensemble">
                          <div className="flex flex-col">
                            <span className="font-medium">Ensemble</span>
                            <span className="text-xs text-muted-foreground">LSTM + GRU + Transformer</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {model && (
                      <p className="text-sm text-muted-foreground">
                        {modelDescriptions[model as keyof typeof modelDescriptions]}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={!ticker || !horizon || !model || isLoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing Market Data...
                      </>
                    ) : (
                      <>
                        <Brain className="mr-2 h-4 w-4" />
                        Generate Prediction
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Prediction Results</CardTitle>
                <CardDescription>
                  {prediction ? 
                    `AI analysis for ${prediction.ticker} using ${prediction.model.toUpperCase()} model` :
                    "Configure and run a prediction to see results"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {prediction ? (
                  <div className="space-y-6">
                    {/* Prediction Summary */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Current Price</p>
                        <p className="text-2xl font-bold">${prediction.currentPrice}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Predicted Price</p>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-bold">${prediction.predictedPrice}</p>
                          {parseFloat(prediction.change) > 0 ? (
                            <TrendingUp className="h-5 w-5 text-green-500" />
                          ) : (
                            <TrendingDown className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Change and Confidence */}
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center gap-2 ${
                        parseFloat(prediction.change) > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <span className="font-medium">
                          {parseFloat(prediction.change) > 0 ? '+' : ''}${prediction.change}
                        </span>
                        <span className="font-medium">
                          ({parseFloat(prediction.changePercent) > 0 ? '+' : ''}{prediction.changePercent}%)
                        </span>
                      </div>
                      <Badge variant="secondary">
                        {prediction.confidence}% confident
                      </Badge>
                    </div>

                    {/* Price Chart */}
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={prediction.data}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="day" />
                          <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                          <Tooltip 
                            labelFormatter={(label, payload) => {
                              if (payload && payload[0] && payload[0].payload) {
                                const data = payload[0].payload;
                                if (data.is_current) {
                                  return `${data.date} (Current)`;
                                } else if (data.predicted) {
                                  return `${data.date} (Predicted)`;
                                } else {
                                  return data.date;
                                }
                              }
                              return `Day ${label}`;
                            }}
                            formatter={(value: any, name) => [
                              `$${parseFloat(value).toFixed(2)}`, 
                              name === 'price' ? 'Price' : 'Predicted'
                            ]}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="price" 
                            stroke="#10b981" 
                            strokeWidth={2}
                            dot={(props) => {
                              if (props.payload && props.payload.predicted) {
                                // Blue dot for predicted values
                                return <circle {...props} fill="#3b82f6" r={3} />;
                              } else if (props.payload && props.payload.is_current) {
                                // Red dot for current day
                                return <circle {...props} fill="#ef4444" r={4} stroke="#ffffff" strokeWidth={2} />;
                              }
                              // Green dot for historical values
                              return <circle {...props} fill="#10b981" r={1} />;
                            }}
                            connectNulls={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      * This is a demonstration using simulated data. Real predictions would use live market data and trained models.
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    <div className="text-center space-y-2">
                      <Brain className="h-12 w-12 mx-auto opacity-50" />
                      <p>Enter stock details and click "Generate Prediction" to see AI analysis</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}