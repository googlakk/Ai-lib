export interface AIService {
  id: string;
  title: string;
  description: string;
  category: string;
  url: string;
  rating: number;
  featured: boolean;
}

export const categories = [
  "Математика",
  "Русский язык",
  "Английский язык", 
  "История",
  "Физика",
  "Химия",
  "Биология",
  "География",
  "Информатика",
  "Искусство"
];

export const mockServices: AIService[] = [
  {
    id: "1",
    title: "ChatGPT в образовании",
    description: "Универсальный AI-помощник для создания планов уроков, объяснения сложных тем и генерации заданий для любого предмета.",
    category: "Универсальные",
    url: "https://chat.openai.com",
    rating: 4.8,
    featured: true
  },
  {
    id: "2", 
    title: "Photomath",
    description: "Решение математических задач с помощью камеры телефона. Пошаговые объяснения для алгебры, геометрии и математического анализа.",
    category: "Математика",
    url: "https://photomath.com",
    rating: 4.6,
    featured: true
  },
  {
    id: "3",
    title: "Grammarly",
    description: "AI-помощник для проверки грамматики, стиля и ясности текста. Помогает учителям и ученикам улучшить письменную речь.",
    category: "Английский язык",
    url: "https://grammarly.com",
    rating: 4.5,
    featured: false
  },
  {
    id: "4",
    title: "Duolingo",
    description: "Интерактивная платформа для изучения иностранных языков с использованием AI для персонализации обучения.",
    category: "Английский язык", 
    url: "https://duolingo.com",
    rating: 4.4,
    featured: false
  },
  {
    id: "5",
    title: "Kahoot!",
    description: "Создание интерактивных викторин и игр для любого предмета. AI помогает генерировать вопросы и анализировать результаты.",
    category: "Универсальные",
    url: "https://kahoot.com",
    rating: 4.7,
    featured: true
  },
  {
    id: "6",
    title: "Wolfram Alpha",
    description: "Вычислительная система знаний для решения задач по математике, физике, химии и другим точным наукам.",
    category: "Физика",
    url: "https://wolframalpha.com",
    rating: 4.6,
    featured: false
  },
  {
    id: "7",
    title: "Quill.org",
    description: "Бесплатные инструменты для обучения письму и грамматике с использованием AI для персонализированной обратной связи.",
    category: "Русский язык",
    url: "https://quill.org",
    rating: 4.3,
    featured: false
  },
  {
    id: "8",
    title: "ChemSketch",
    description: "Программа для рисования химических структур и уравнений с AI-подсказками и автоматической проверкой.",
    category: "Химия",
    url: "https://chemsketch.com",
    rating: 4.2,
    featured: false
  },
  {
    id: "9",
    title: "Google Earth VR",
    description: "Виртуальные путешествия по всему миру для изучения географии с интерактивными уроками и AI-гидом.",
    category: "География", 
    url: "https://earth.google.com/web/",
    rating: 4.5,
    featured: false
  },
  {
    id: "10",
    title: "MuseNet",
    description: "AI-композитор от OpenAI для создания музыки в различных стилях. Помогает в уроках музыки и творчества.",
    category: "Искусство",
    url: "https://openai.com/blog/musenet/",
    rating: 4.1,
    featured: false
  },
  {
    id: "11",
    title: "Socratic by Google",
    description: "AI-помощник для решения домашних заданий. Использует камеру для распознавания задач и предоставляет объяснения.",
    category: "Универсальные",
    url: "https://socratic.org",
    rating: 4.4,
    featured: false
  },
  {
    id: "12",
    title: "Labster",
    description: "Виртуальные научные лаборатории с AI-симуляциями для безопасного проведения экспериментов по биологии и химии.",
    category: "Биология",
    url: "https://labster.com",
    rating: 4.6,
    featured: true
  }
];