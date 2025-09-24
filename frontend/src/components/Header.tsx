import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { Brain, TrendingUp } from "lucide-react";

export function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <header style={{ marginLeft: '175px' }} className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <a 
            className="mr-6 flex items-center space-x-2 cursor-pointer" 
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <Brain className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">StockAI</span>
          </a>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
              href="#technology"
              onClick={(e) => handleNavClick(e, 'technology')}
            >
              Technology
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
              href="#features"
              onClick={(e) => handleNavClick(e, 'features')}
            >
              Features
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
              href="#demo"
              onClick={(e) => handleNavClick(e, 'demo')}
            >
              Demo
            </a>
            <a
              className="transition-colors hover:text-foreground/80 text-foreground/60 cursor-pointer"
              href="#predictor"
              onClick={(e) => handleNavClick(e, 'predictor')}
            >
              Predictor
            </a>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button 
              size="sm"
              onClick={() => scrollToSection('predictor')}
            >
              Get Started
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}