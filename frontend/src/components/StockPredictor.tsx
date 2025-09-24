import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Brain, Loader2, Target } from "lucide-react";
import { motion } from "motion/react";

export function StockPredictor() {
  const [ticker, setTicker] = useState("");
  const [horizon, setHorizon] = useState("");
  const [model, setModel] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

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
        throw new Error('Prediction failed');
      }

      const result = await response.json();
      setPrediction(result);
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
                <div className="space-y-2">
                  <Label htmlFor="ticker">Stock Ticker</Label>
                  <Input
                    id="ticker"
                    placeholder="e.g., AAPL, TSLA, GOOGL"
                    value={ticker}
                    onChange={(e) => setTicker(e.target.value.toUpperCase())}
                    className="uppercase"
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the stock symbol you want to predict
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="horizon">Prediction Horizon (Days)</Label>
                  <Select value={horizon} onValueChange={setHorizon}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select prediction timeframe" />
                    </SelectTrigger>
                    <SelectContent>
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
                  <Select value={model} onValueChange={setModel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose neural network model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lstm">LSTM (Long Short-Term Memory)</SelectItem>
                      <SelectItem value="gru">GRU (Gated Recurrent Unit)</SelectItem>
                      <SelectItem value="ensemble">Ensemble (LSTM + GRU + Transformer)</SelectItem>
                    </SelectContent>
                  </Select>
                  {model && (
                    <p className="text-sm text-muted-foreground">
                      {modelDescriptions[model as keyof typeof modelDescriptions]}
                    </p>
                  )}
                </div>

                <Button
                  onClick={handlePredict}
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
                            labelFormatter={(label) => `Day ${label}`}
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
                                return <circle {...props} fill="#3b82f6" r={3} />;
                              }
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