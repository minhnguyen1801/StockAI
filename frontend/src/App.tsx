import React from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { Technology } from "./components/Technology";
import { Features } from "./components/Features";
import { Demo } from "./components/Demo";
import { StockPredictor } from "./components/StockPredictor";
import { Footer } from "./components/Footer";
import AIChatbox from "./components/AIChatbox";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="stockai-theme">
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main>
          <Hero />
          <Technology />
          <Features />
          <Demo />
          <StockPredictor />
        </main>
        <Footer />
        <AIChatbox />
      </div>
    </ThemeProvider>
  );
}