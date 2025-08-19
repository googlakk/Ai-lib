import { Button } from "@/components/ui/button";
import { Brain, Menu, X, User, LogOut, UserPlus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { teacher, logout } = useAuth();
  const navigate = useNavigate();

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
              <h1 className="font-bold text-lg text-foreground">Intellect Pro School</h1>
              <p className="text-xs text-muted-foreground">AI-каталог для преподавателей</p>
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
            
            {teacher ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span>{teacher.full_name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/admin')}>
                  Админ-панель
                </Button>
                <Button variant="outline" size="sm" onClick={logout}>
                  <LogOut className="w-4 h-4 mr-1" />
                  Выйти
                </Button>
              </div>
            ) : (
              <Button variant="outline" size="sm" onClick={() => navigate('/auth')}>
                <UserPlus className="w-4 h-4 mr-1" />
                Вход / Регистрация
              </Button>
            )}
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
              
              {teacher ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{teacher.full_name}</span>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/admin')} className="w-fit">
                    Админ-панель
                  </Button>
                  <Button variant="outline" size="sm" onClick={logout} className="w-fit">
                    <LogOut className="w-4 h-4 mr-1" />
                    Выйти
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => navigate('/auth')} className="w-fit">
                  <UserPlus className="w-4 h-4 mr-1" />
                  Вход / Регистрация
                </Button>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;