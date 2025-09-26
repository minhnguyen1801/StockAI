// Environment configuration utilities
// Import this file to access environment variables consistently

interface Config {
  apiUrl: string;
  stockApiKey: string;
  finnhubApiKey: string;
  alphaVantageApiKey: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: Config = {
  // Use development API URL if in dev mode, otherwise production
  apiUrl: import.meta.env.VITE_APP_ENV === 'development' 
    ? import.meta.env.VITE_DEV_API_URL || 'http://localhost:8000/api'
    : import.meta.env.VITE_API_URL || '/api',
    
  stockApiKey: import.meta.env.VITE_STOCK_API_KEY || '',
  finnhubApiKey: import.meta.env.VITE_FINNHUB_API_KEY || '',
  alphaVantageApiKey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY || '',
  
  isDevelopment: import.meta.env.VITE_APP_ENV === 'development',
  isProduction: import.meta.env.VITE_APP_ENV === 'production',
};

// Validate required environment variables
const validateConfig = () => {
  const requiredVars = ['apiUrl'];
  const missingVars = requiredVars.filter(key => !config[key as keyof Config]);
  
  if (missingVars.length > 0) {
    console.warn('Missing environment variables:', missingVars);
  }
};

// Run validation in development
if (config.isDevelopment) {
  validateConfig();
}

export default config;
