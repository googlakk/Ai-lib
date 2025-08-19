import { GoogleGenerativeAI } from '@google/generative-ai';

interface ServiceInfo {
  title: string;
  description: string;
  category: string;
  url?: string;
}

interface GeneratedContent {
  instructions: string;
  examples: string;
  tags: string[];
}

// Инициализация Gemini AI
const getGeminiAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  console.log('API Key found:', apiKey ? 'Yes' : 'No');
  console.log('API Key length:', apiKey?.length || 0);
  
  if (!apiKey) {
    throw new Error('VITE_GEMINI_API_KEY не найден в переменных окружения');
  }
  return new GoogleGenerativeAI(apiKey);
};

export async function generateServiceContent(serviceInfo: ServiceInfo): Promise<GeneratedContent> {
  try {
    console.log('Начинаем генерацию контента для:', serviceInfo.title);
    const genAI = getGeminiAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const { title, description, category } = serviceInfo;

    const prompt = `
Ты эксперт в области образовательных технологий и AI-инструментов для учителей. 
Создай подробную инструкцию и примеры применения для AI-сервиса.

**Информация о сервисе:**
- Название: ${title}
- Описание: ${description}
- Категория: ${category}
${serviceInfo.url ? `- URL: ${serviceInfo.url}` : ''}

**Задача:**
Создай структурированный ответ в формате JSON со следующими полями:

1. **instructions** - Пошаговая инструкция по использованию сервиса (7-10 пунктов)
2. **examples** - Практические примеры применения в образовательном процессе, разделенные по тематикам с эмодзи
3. **tags** - Массив релевантных тегов на русском языке (5-8 тегов)

**Требования:**
- Инструкции должны быть конкретными и понятными для учителей
- Примеры должны быть практическими и применимыми в реальном учебном процессе
- Теги должны отражать предметную область и функциональность
- Текст должен быть на русском языке
- Учитывай специфику категории "${category}"

**Формат ответа:** Только JSON без дополнительных комментариев:
{
  "instructions": "текст инструкций",
  "examples": "текст примеров с эмодзи и разделами",
  "tags": ["тег1", "тег2", "тег3"]
}
`;

    console.log('Отправляем запрос к Gemini API...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Ответ от Gemini:', text.substring(0, 200) + '...');
    
    try {
      // Пытаемся распарсить JSON из ответа
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const generatedData = JSON.parse(jsonMatch[0]);
        
        return {
          instructions: generatedData.instructions || fallbackInstructions(title),
          examples: generatedData.examples || fallbackExamples(title, category),
          tags: Array.isArray(generatedData.tags) ? generatedData.tags : fallbackTags(category)
        };
      } else {
        throw new Error('JSON не найден в ответе');
      }
    } catch (parseError) {
      console.warn('Ошибка парсинга JSON от Gemini, используем fallback:', parseError);
      return getFallbackContent(title, description, category);
    }
    
  } catch (error) {
    console.error('Ошибка генерации контента через Gemini:', error);
    console.error('Детали ошибки:', error instanceof Error ? error.message : error);
    // Возвращаем fallback контент при ошибке API
    return getFallbackContent(title, description, category);
  }
}

// Функция для генерации описания на основе URL с помощью Gemini
export async function generateDescriptionFromUrl(url: string, title: string): Promise<string> {
  try {
    const genAI = getGeminiAI();
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const prompt = `
Проанализируй URL и создай краткое описание AI-сервиса для каталога образовательных инструментов.

**Информация:**
- Название сервиса: ${title}
- URL: ${url}

**Задача:**
Создай краткое описание (2-3 предложения) на русском языке, которое:
- Объясняет назначение сервиса для учителей
- Описывает основные возможности
- Подчеркивает образовательную ценность

**Формат:** Только текст описания, без дополнительных комментариев.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    return text || getFallbackDescription(url, title);
    
  } catch (error) {
    console.error('Ошибка генерации описания через Gemini:', error);
    return getFallbackDescription(url, title);
  }
}

// Fallback функции
function getFallbackContent(title: string, description: string, category: string): GeneratedContent {
  return {
    instructions: fallbackInstructions(title),
    examples: fallbackExamples(title, category),
    tags: fallbackTags(category)
  };
}

function fallbackInstructions(title: string): string {
  return `Пошаговая инструкция по использованию ${title}:

1. Откройте сервис в веб-браузере
2. Ознакомьтесь с интерфейсом и основными функциями
3. Следуйте встроенному руководству или туториалу
4. Начните с простых задач для освоения функционала
5. Постепенно переходите к более сложным возможностям
6. Используйте справочные материалы при необходимости
7. Делитесь результатами с коллегами и учениками
8. Регулярно изучайте новые функции и обновления`;
}

function fallbackExamples(title: string, category: string): string {
  const categoryExamples: Record<string, string> = {
    'Математика': `Примеры применения ${title} в обучении математике:

📚 **На уроках алгебры:**
- Решение уравнений с подробным объяснением
- Построение графиков функций
- Проверка домашних заданий

📐 **На уроках геометрии:**
- Доказательство теорем
- Вычисление площадей и объемов
- Создание геометрических построений`,

    'Физика': `Использование ${title} на уроках физики:

⚡ **Эксперименты и симуляции:**
- Виртуальные лабораторные работы
- Моделирование физических процессов
- Анализ результатов экспериментов

🔬 **Практическое применение:**
- Решение задач по механике
- Изучение электрических явлений
- Подготовка к экзаменам`,

    'Английский язык': `Применение ${title} в изучении английского языка:

📝 **Развитие навыков:**
- Проверка грамматики и стиля
- Тренировка произношения
- Расширение словарного запаса

🗣️ **Интерактивная практика:**
- Диалоговые упражнения
- Изучение идиоматических выражений
- Подготовка к языковым экзаменам`
  };

  return categoryExamples[category] || `Примеры использования ${title}:

🎓 **В образовательном процессе:**
- Подготовка интерактивных уроков
- Создание заданий для учеников
- Оценка и анализ успеваемости

💡 **Повышение эффективности:**
- Автоматизация рутинных задач
- Персонализация обучения
- Быстрый доступ к информации`;
}

function fallbackTags(category: string): string[] {
  const categoryTags: Record<string, string[]> = {
    'Математика': ['математика', 'алгебра', 'геометрия', 'решение задач', 'образование', 'школа'],
    'Физика': ['физика', 'эксперименты', 'симуляция', 'лабораторная работа', 'наука', 'образование'],
    'Английский язык': ['английский язык', 'грамматика', 'произношение', 'словарь', 'изучение языков', 'ESL'],
    'История': ['история', 'даты', 'события', 'хронология', 'образование', 'школа'],
    'Химия': ['химия', 'реакции', 'элементы', 'лабораторная работа', 'эксперименты', 'наука']
  };

  return categoryTags[category] || ['образование', 'обучение', 'AI', 'технологии', 'школа', 'учитель'];
}

function getFallbackDescription(url: string, title: string): string {
  const domain = new URL(url).hostname.toLowerCase();
  
  if (domain.includes('chat') || domain.includes('gpt')) {
    return `${title} - мощный AI-ассистент для создания образовательного контента, разработки планов уроков и помощи в обучении. Поддерживает множество языков и предметных областей.`;
  } else if (domain.includes('math') || domain.includes('calculate')) {
    return `${title} - интеллектуальный инструмент для решения математических задач с пошаговыми объяснениями. Поддерживает алгебру, геометрию, анализ и статистику.`;
  } else if (domain.includes('translate') || domain.includes('language')) {
    return `${title} - AI-платформа для изучения языков с персонализированным подходом, интерактивными упражнениями и проверкой произношения.`;
  }
  
  return `${title} - современный AI-инструмент для образования, который поможет автоматизировать рутинные задачи и сделать обучение более интерактивным и эффективным.`;
}