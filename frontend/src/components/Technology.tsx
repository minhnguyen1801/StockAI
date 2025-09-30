import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Brain, Cpu, Database, Zap, Network, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function Technology() {
  const technologies = [
    {
      icon: Brain,
      title: "Recurrent Neural Networks",
      description: "Advanced LSTM and GRU architectures that understand temporal patterns in market data",
      features: ["Long-term memory", "Sequence modeling", "Pattern recognition"]
    },
    {
      icon: Cpu,
      title: "Deep Learning Engine",
      description: "Multi-layer neural networks processing millions of market indicators simultaneously",
      features: ["Real-time processing", "Feature extraction", "Adaptive learning"]
    },
    {
      icon: Database,
      title: "Big Data Analytics",
      description: "Analyzing vast datasets from global markets, news, and economic indicators",
      features: ["Real-time feeds", "Historical analysis", "Cross-market correlation"]
    },
    {
      icon: Zap,
      title: "Edge Computing",
      description: "Lightning-fast predictions powered by distributed computing infrastructure",
      features: ["Sub-second latency", "Scalable architecture", "High availability"]
    }
  ];

  return (
    <section id="technology" className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Network className="mr-2 h-4 w-4" />
            Advanced Technology
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            Powered by{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Cutting-Edge AI
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our proprietary AI system combines multiple neural network architectures to deliver the most accurate stock market predictions in the industry.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-2xl sm:text-3xl">Neural Network Architecture</h3>
            <p className="text-muted-foreground">
              Our RNN-based system processes sequential market data through multiple layers of LSTM cells, 
              each trained to recognize different aspects of market behavior. The network learns from:
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span>Historical price movements and volume patterns</span>
              </li>
              <li className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <span>Technical indicators and market sentiment</span>
              </li>
              <li className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <span>Economic events and news sentiment analysis</span>
              </li>
              <li className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-orange-500" />
                <span>Cross-market correlations and global trends</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-600 rounded-3xl blur-3xl opacity-20" />
            <div className="relative rounded-3xl overflow-hidden border bg-card/50 backdrop-blur-sm">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1645839078449-124db8a049fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwbmV1cmFsJTIwbmV0d29ya3xlbnwxfHx8fDE3NTg2Njk3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Neural network visualization"
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {technologies.map((tech, index) => (
            <motion.div
              key={tech.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 hover:border-blue-500/20 transition-all duration-300 hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                      <tech.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tech.title}</CardTitle>
                  </div>
                  <CardDescription>{tech.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tech.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-2 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}