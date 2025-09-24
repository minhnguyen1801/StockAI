# Stock Prediction React Frontend

A modern React-based frontend for the Stock Prediction AI system, built with TypeScript, Tailwind CSS, and Radix UI components.

## Features

- **Modern UI**: Built with React 18, TypeScript, and Tailwind CSS
- **Component Library**: Uses Radix UI for accessible, high-quality components
- **Stock Predictor**: Interactive form to predict stock prices using AI models
- **Real-time Charts**: Visualize stock price predictions with Recharts
- **Responsive Design**: Mobile-first responsive design
- **Dark/Light Mode**: Theme switching with next-themes
- **Animations**: Smooth animations with Framer Motion

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Radix UI** - Component primitives
- **Recharts** - Data visualization
- **Framer Motion** - Animations
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. The app will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

## API Integration

The frontend connects to a Python Flask API server running on `http://localhost:8000`. Make sure to start the API server before using the stock prediction features:

```bash
# From the project root
python api_server.py
```

## Components

- **Header**: Navigation and theme toggle
- **Hero**: Landing section with main value proposition
- **Technology**: AI/ML technology showcase
- **Features**: Key features and benefits
- **Demo**: Interactive demonstration
- **StockPredictor**: Main prediction interface
- **Footer**: Links and information

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components (Radix UI)
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing section
│   ├── StockPredictor.tsx # Main prediction interface
│   └── ...
├── styles/             # Global styles
├── App.tsx            # Main app component
└── main.tsx           # App entry point
```

## Development

The project uses Vite for fast development with hot module replacement. All components are written in TypeScript with proper type definitions.

### Key Dependencies

- `@radix-ui/*` - Accessible UI primitives
- `lucide-react` - Icon library
- `recharts` - Chart components
- `motion` - Animation library
- `next-themes` - Theme management
- `tailwind-merge` - Tailwind class merging
- `clsx` - Conditional class names

## API Endpoints

The frontend expects the following API endpoints:

- `GET /health` - Health check
- `POST /predict` - Make stock prediction
- `GET /models` - Get available models
- `GET /stocks/popular` - Get popular stocks

## Contributing

1. Follow TypeScript best practices
2. Use Tailwind CSS for styling
3. Ensure components are accessible
4. Add proper error handling
5. Test on multiple screen sizes