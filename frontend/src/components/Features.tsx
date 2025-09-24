import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  BarChart3, 
  Shield, 
  Clock, 
  Globe, 
  Smartphone, 
  AlertTriangle,
  TrendingUp,
  Users
} from "lucide-react";
import { motion } from "motion/react";

export function Features() {
  const features = [
    {
      icon: BarChart3,
      title: "Real-Time Predictions",
      description: "Get instant market forecasts updated every second with live data streams",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Shield,
      title: "99.9% Reliability",
      description: "Enterprise-grade infrastructure ensuring consistent and accurate predictions",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Clock,
      title: "24/7 Monitoring",
      description: "Continuous market surveillance across global exchanges and time zones",
      color: "from-purple-500 to-violet-500"
    },
    {
      icon: Globe,
      title: "Global Markets",
      description: "Coverage of major stock exchanges worldwide including NYSE, NASDAQ, LSE, and more",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Ready",
      description: "Access predictions anywhere with our responsive web platform and mobile apps",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: AlertTriangle,
      title: "Risk Management",
      description: "Advanced risk assessment tools to help you make informed investment decisions",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: TrendingUp,
      title: "Trend Analysis",
      description: "Identify long-term trends and short-term opportunities with AI-powered insights",
      color: "from-indigo-500 to-blue-500"
    },
    {
      icon: Users,
      title: "Expert Support",
      description: "Access to financial experts and AI specialists for personalized guidance",
      color: "from-teal-500 to-cyan-500"
    }
  ];

  return (
    <section id="features" className="py-24 bg-muted/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <Badge variant="outline" className="text-purple-600 border-purple-600">
            <TrendingUp className="mr-2 h-4 w-4" />
            Key Features
          </Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Smart Trading
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our comprehensive platform provides all the tools and insights you need to make data-driven investment decisions with confidence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full group hover:shadow-xl transition-all duration-300 border-2 hover:border-transparent hover:bg-gradient-to-br hover:from-background hover:to-muted">
                <CardHeader className="space-y-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} w-fit`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl mb-2 group-hover:text-foreground transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card className="max-w-4xl mx-auto border-2 border-gradient-to-r from-blue-500 to-purple-600">
            <CardHeader>
              <CardTitle className="text-2xl sm:text-3xl">
                Why Choose Our AI Platform?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">5X</div>
                  <p className="text-sm text-muted-foreground">Faster than traditional analysis</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">95%</div>
                  <p className="text-sm text-muted-foreground">Prediction accuracy rate</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-pink-600">1000+</div>
                  <p className="text-sm text-muted-foreground">Happy traders worldwide</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}