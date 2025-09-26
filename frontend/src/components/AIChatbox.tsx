import React, { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  MessageCircle, 
  Send, 
  X, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  type?: 'prediction' | 'general' | 'error';
}

const AIChatbox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm your AI stock prediction assistant. I can help you understand market trends, explain predictions, or answer questions about the stock market. What would you like to know?",
      sender: 'ai',
      timestamp: new Date(),
      type: 'general'
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chatbox opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);

  // Mock AI responses for stock prediction context
  const getAIResponse = (userMessage: string): Promise<Message> => {
    return new Promise((resolve) => {
      const lowerMessage = userMessage.toLowerCase();
      
      let response = "";
      let type: 'prediction' | 'general' | 'error' = 'general';

      if (lowerMessage.includes('prediction') || lowerMessage.includes('forecast')) {
        response = "Based on our LSTM model with attention mechanism, I analyze 60 days of historical data including 47+ technical indicators. The model considers price patterns, volume trends, and market sentiment to generate predictions with an average R² score of 0.69.";
        type = 'prediction';
      } else if (lowerMessage.includes('model') || lowerMessage.includes('algorithm')) {
        response = "Our system uses a Recurrent Neural Network (RNN) with LSTM cells and attention mechanism. Key features include: 60-day lookback window, 64 hidden units, dropout for regularization, and early stopping to prevent overfitting. The model processes technical indicators like RSI, MACD, Bollinger Bands, and volume metrics.";
        type = 'prediction';
      } else if (lowerMessage.includes('accuracy') || lowerMessage.includes('performance')) {
        response = "Our model performance metrics: Average R² Score: 0.69, MAPE: 4.0%, Direction Accuracy: 54.2%. For AAPL: R² 0.73, MAPE 2.5%. For MSFT: R² 0.66, MAPE 5.5%. These results indicate strong predictive capability while maintaining realistic expectations for market volatility.";
        type = 'prediction';
      } else if (lowerMessage.includes('risk') || lowerMessage.includes('disclaimer')) {
        response = "⚠️ Important: All predictions are for educational purposes only. Stock markets are inherently unpredictable and past performance doesn't guarantee future results. Always consult with financial advisors and never invest more than you can afford to lose. Our AI provides insights, not financial advice.";
        type = 'error';
      } else if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
        response = "I can help you with: 📈 Explaining stock predictions and model performance, 🧠 Describing our AI architecture and algorithms, 📊 Interpreting technical indicators and market data, ⚠️ Providing risk disclaimers and educational content, 🔍 Answering questions about market trends and patterns. Try asking about specific stocks, model accuracy, or technical analysis!";
        type = 'general';
      } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        response = "Hello! 👋 I'm here to help you understand stock market predictions and our AI system. Feel free to ask me about predictions, model performance, technical analysis, or any questions about the stock market!";
        type = 'general';
      } else {
        const responses = [
          "That's an interesting question about the stock market! While I can provide general insights, remember that all predictions are for educational purposes only.",
          "I'd be happy to help explain our prediction methodology. Our LSTM model with attention mechanism analyzes multiple technical indicators to generate forecasts.",
          "Great question! Our AI system processes 47+ features including price patterns, volume data, and technical indicators to make predictions.",
          "I can explain how our neural network works or discuss specific stocks. What aspect of stock prediction would you like to explore?",
          "Based on our analysis, I can share insights about market trends and prediction accuracy. What specific information are you looking for?"
        ];
        response = responses[Math.floor(Math.random() * responses.length)];
      }

      setTimeout(() => {
        resolve({
          id: Date.now().toString(),
          text: response,
          sender: 'ai',
          timestamp: new Date(),
          type
        });
      }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
    });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const aiResponse = await getAIResponse(inputValue);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Sorry, I encountered an error. Please try again.",
        sender: 'ai',
        timestamp: new Date(),
        type: 'error'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageBadgeColor = (type?: string) => {
    switch (type) {
      case 'prediction': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    }
  };

  return (
    <>
      {/* Custom scrollbar styles */}
      <style>{`
        .chat-scroll {
          scrollbar-width: thin; /* Firefox */
          scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
        }
        .dark .chat-scroll {
          scrollbar-color: rgba(71, 85, 105, 0.4) transparent;
        }
        .chat-scroll::-webkit-scrollbar {
          width: 8px;
          background: transparent;
        }
        .chat-scroll::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 4px;
        }
        .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 4px;
          border: 1px solid rgba(148, 163, 184, 0.1);
        }
        .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
          border: 1px solid rgba(148, 163, 184, 0.2);
        }
        .dark .chat-scroll::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.4);
          border: 1px solid rgba(71, 85, 105, 0.2);
        }
        .dark .chat-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 0.6);
          border: 1px solid rgba(71, 85, 105, 0.3);
        }
        .chat-scroll::-webkit-scrollbar-corner {
          background: transparent;
        }
      `}</style>
      
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 20,
              delay: 0.5 
            }}
            className="fixed bottom-6 right-6 z-[9999]"
            style={{ position: 'fixed', bottom: '24px', right: '24px' }}
          >
            <Button
              onClick={() => setIsOpen(true)}
              size="icon"
              className="h-16 w-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300 group"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle className="h-7 w-7 text-white" />
              </motion.div>
              
              {/* Pulse animation */}
              <motion.div
                className="absolute inset-0 rounded-full bg-blue-400"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ 
              opacity: 0, 
              scale: 0.8,
              y: 20,
              x: 20
            }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              y: 0,
              x: 0
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8,
              y: 20,
              x: 20
            }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="fixed bottom-6 right-6 z-[9999] w-80 h-[600px] overflow-hidden"
            style={{ 
              position: 'fixed', 
              bottom: '24px', 
              right: '24px', 
              width: '400px', 
              height: '600px',
              overflow: 'hidden'
            }}
          >
            <Card className="shadow-2xl border-0 bg-background/95 backdrop-blur-sm h-full flex flex-col overflow-hidden">
              {/* Header */}
              <CardHeader className="pb-3 flex-shrink-0 border-b bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-semibold">
                        AI Stock Assistant
                      </CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Online
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMinimized(!isMinimized)}
                      className="h-8 w-8"
                    >
                      {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Body - Chat Messages */}
              {!isMinimized && (
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <div className="flex-1 px-4 overflow-y-auto scroll-smooth chat-scroll">
                    <div className="space-y-4 py-4 pr-2">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`flex gap-2 max-w-[85%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.sender === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            }`}>
                              {message.sender === 'user' ? (
                                <User className="h-3 w-3" />
                              ) : (
                                <Bot className="h-3 w-3" />
                              )}
                            </div>
                            <div className="space-y-1 min-w-0 flex-1">
                              <div className={`rounded-lg px-3 py-2 text-sm break-words ${
                                message.sender === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}>
                                {message.text}
                              </div>
                              {message.type && (
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getMessageBadgeColor(message.type)}`}
                                >
                                  {message.type === 'prediction' ? '📈 Prediction' : 
                                   message.type === 'error' ? '⚠️ Warning' : '💬 General'}
                                </Badge>
                              )}
                              <div className="text-xs text-muted-foreground">
                                {formatTime(message.timestamp)}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                      
                      {/* Typing indicator */}
                      {isTyping && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-2 justify-start"
                        >
                          <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <Bot className="h-3 w-3 text-white" />
                          </div>
                          <div className="bg-muted rounded-lg px-3 py-2">
                            <div className="flex gap-1">
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="w-2 h-2 bg-current rounded-full"
                              />
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                                className="w-2 h-2 bg-current rounded-full"
                              />
                              <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                                className="w-2 h-2 bg-current rounded-full"
                              />
                            </div>
                          </div>
                        </motion.div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </div>
                </div>
              )}

              {/* Footer - Input Area */}
              {!isMinimized && (
                <div className="flex-shrink-0 border-t bg-muted/30 p-4">
                  <div className="flex gap-2">
                    <Input
                      ref={inputRef}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about stock predictions..."
                      className="flex-1"
                      disabled={isTyping}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || isTyping}
                      size="icon"
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbox;
