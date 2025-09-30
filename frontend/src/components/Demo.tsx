import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { TrendingUp, TrendingDown, Activity } from "lucide-react";
import { motion } from "motion/react";

export function Demo() {
  // Mock data for different stocks
  const appleData = [
    { date: "Jan", actual: 150, predicted: 152, confidence: 94 },
    { date: "Feb", actual: 155, predicted: 157, confidence: 92 },
    { date: "Mar", actual: 148, predicted: 151, confidence: 89 },
    { date: "Apr", actual: 162, predicted: 164, confidence: 96 },
    { date: "May", actual: 158, predicted: 159, confidence: 98 },
    { date: "Jun", actual: 165, predicted: 167, confidence: 95 },
  ];

  const teslaData = [
    { date: "Jan", actual: 800, predicted: 795, confidence: 91 },
    { date: "Feb", actual: 850, predicted: 845, confidence: 88 },
    { date: "Mar", actual: 780, predicted: 785, confidence: 93 },
    { date: "Apr", actual: 920, predicted: 915, confidence: 90 },
    { date: "May", actual: 900, predicted: 905, confidence: 94 },
    { date: "Jun", actual: 950, predicted: 945, confidence: 92 },
  ];

  const predictions = [
    {
      symbol: "AAPL",
      company: "Apple Inc.",
      current: 165.23,
      predicted: 172.50,
      change: "+4.4%",
      confidence: 95,
      trend: "up"
    },
    {
      symbol: "TSLA", 
      company: "Tesla Inc.",
      current: 950.75,
      predicted: 925.20,
      change: "-2.7%",
      confidence: 92,
      trend: "down"
    },
    {
      symbol: "GOOGL",
      company: "Alphabet Inc.",
      current: 2750.80,
      predicted: 2890.45,
      change: "+5.1%",
      confidence: 89,
      trend: "up"
    }
  ];

  return (
    <section id="demo" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Activity className="mr-2 h-4 w-4" />
            Live Demo
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            See Our AI{" "}
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              In Action
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore real-time predictions and historical accuracy across major stocks. Our AI continuously learns and adapts to market conditions.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-green-500" />
                  Prediction vs Reality
                </CardTitle>
                <CardDescription>
                  Compare our AI predictions with actual market performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="aapl" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="aapl">AAPL</TabsTrigger>
                    <TabsTrigger value="tsla">TSLA</TabsTrigger>
                  </TabsList>
                  <TabsContent value="aapl" className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={appleData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Actual Price"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="AI Prediction"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                  <TabsContent value="tsla" className="mt-6">
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={teslaData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="actual" 
                          stroke="#10b981" 
                          strokeWidth={2}
                          name="Actual Price"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="#3b82f6" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="AI Prediction"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Confidence Levels
                </CardTitle>
                <CardDescription>
                  AI confidence scores for recent predictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={appleData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="confidence" 
                      stroke="#8b5cf6" 
                      fill="url(#confidenceGradient)"
                      name="Confidence %"
                    />
                    <defs>
                      <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Real-Time Predictions</CardTitle>
              <CardDescription>
                Current AI predictions for popular stocks (Updated: {new Date().toLocaleTimeString()})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {predictions.map((stock, index) => (
                  <motion.div
                    key={stock.symbol}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card/80 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="font-bold text-lg">{stock.symbol}</div>
                        <div className="text-sm text-muted-foreground">{stock.company}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">${stock.current}</div>
                        <div className="text-sm text-muted-foreground">Current</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-medium">${stock.predicted}</div>
                        <div className="text-sm text-muted-foreground">Predicted (24h)</div>
                      </div>
                      <div className={`flex items-center gap-1 ${
                        stock.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stock.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="font-medium">{stock.change}</span>
                      </div>
                      <Badge variant="secondary">
                        {stock.confidence}% confident
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}