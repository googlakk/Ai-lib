import { Button } from "@/components/ui/button";
import { Brain, Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-hero rounded-lg">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground">AI Edu Tools</h1>
              <p className="text-xs text-muted-foreground">Каталог для учителей</p>
            </div>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#catalog" className="text-muted-foreground hover:text-ai-primary transition-colors">
              Каталог
            </a>
            <a href="#categories" className="text-muted-foreground hover:text-ai-primary transition-colors">
              Категории
            </a>
            <a href="#about" className="text-muted-foreground hover:text-ai-primary transition-colors">
              О проекте
            </a>
            <Button variant="outline" size="sm" className="hover:bg-ai-primary hover:text-white hover:border-ai-primary">
              Админ-панель
            </Button>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col gap-4">
              <a href="#catalog" className="text-muted-foreground hover:text-ai-primary transition-colors">
                Каталог
              </a>
              <a href="#categories" className="text-muted-foreground hover:text-ai-primary transition-colors">
                Категории
              </a>
              <a href="#about" className="text-muted-foreground hover:text-ai-primary transition-colors">
                О проекте
              </a>
              <Button variant="outline" size="sm" className="hover:bg-ai-primary hover:text-white hover:border-ai-primary w-fit">
                Админ-панель
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;