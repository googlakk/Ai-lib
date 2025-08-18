import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-hero">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-20 h-20 bg-ai-primary rounded-full animate-float"></div>
        <div className="absolute bottom-32 right-16 w-16 h-16 bg-success rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-ai-primary rounded-full animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 text-center text-white relative z-10">
        <div className="animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-ai-secondary" />
            <span className="text-ai-secondary font-semibold text-lg">Intellect Pro School • Бишкек</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Внутренний каталог <span className="text-ai-secondary">AI-сервисов</span><br />
            для преподавателей
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            Эксклюзивная коллекция AI-инструментов для преподавателей Intellect Pro School. 
            Современные технологии для инновационного образования в Бишкеке
          </p>
          
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-ai-secondary hover:text-white transition-all duration-300 shadow-ai">
              <BookOpen className="w-5 h-5 mr-2" />
              Исследовать каталог
            </Button>
            <Button size="lg" variant="outline" className="bg-white text-primary hover:bg-ai-secondary hover:text-white transition-all duration-300 shadow-ai">
              <Users className="w-5 h-5 mr-2" />
              Для администраторов
            </Button>
          </div> */}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
          <div className="text-center">
            <div className="text-3xl font-bold text-ai-secondary mb-2">30+</div>
            <div className="text-blue-100">AI-инструментов</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-ai-secondary mb-2">12+</div>
            <div className="text-blue-100">Предметных областей</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-ai-secondary mb-2">85+</div>
            <div className="text-blue-100">Преподавателей школы</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;