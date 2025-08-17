import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import FilterBar from "@/components/FilterBar";
import ServiceCard from "@/components/ServiceCard";
import { mockServices, categories } from "@/data/mockData";

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // All available categories including "Универсальные"
  const allCategories = [...new Set([...categories, 'Универсальные'])].sort();

  const filteredServices = useMemo(() => {
    return mockServices.filter(service => {
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Hero />
        
        {/* Catalog Section */}
        <section id="catalog" className="py-16 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-foreground mb-4">
                Каталог AI-сервисов
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Найдите идеальные инструменты искусственного интеллекта для вашего предмета
              </p>
            </div>

            <div className="mb-8">
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                categories={allCategories}
              />
            </div>

            {/* Results count */}
            <div className="mb-6">
              <p className="text-muted-foreground">
                Найдено сервисов: <span className="font-semibold text-ai-primary">{filteredServices.length}</span>
                {selectedCategory !== 'all' && (
                  <span> в категории "{selectedCategory}"</span>
                )}
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  category={service.category}
                  url={service.url}
                  rating={service.rating}
                  featured={service.featured}
                />
              ))}
            </div>

            {/* Empty state */}
            {filteredServices.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  Сервисы не найдены
                </h3>
                <p className="text-muted-foreground mb-6">
                  Попробуйте изменить фильтры или поисковый запрос
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="text-ai-primary hover:underline"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4 bg-gradient-hero">
          <div className="container mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Готовы добавить свой AI-сервис?
            </h2>
            <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
              Для добавления новых сервисов и управления каталогом подключите backend
            </p>
            <div className="bg-white/10 rounded-lg p-6 max-w-md mx-auto">
              <p className="text-sm mb-4">
                Нажмите на зеленую кнопку Supabase в правом верхнем углу для активации backend функций
              </p>
              <div className="text-ai-secondary text-sm">
                ✨ База данных • 🔐 Админ-панель • 📊 Управление контентом
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
