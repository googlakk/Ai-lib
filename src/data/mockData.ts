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
  "Кыргызский язык",
  "Английский язык", 
  "История Кыргызстана",
  "Всемирная история",
  "Физика",
  "Химия",
  "Биология",
  "География",
  "Информатика",
  "Изобразительное искусство",
  "Физическая культура"
];

export const mockServices: AIService[] = [
  {
    id: "1",
    title: "ChatGPT для преподавателей",
    description: "Помощник для создания планов уроков, разработки заданий и подготовки материалов для всех предметов в Intellect Pro School.",
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
    description: "Инструменты для обучения письму и грамматике на русском языке с AI-обратной связью для учеников Intellect Pro School.",
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
    title: "Google Earth для изучения Кыргызстана",
    description: "Интерактивное изучение географии Кыргызстана и мира с виртуальными экскурсиями и AI-гидом для уроков в Intellect Pro School.",
    category: "География", 
    url: "https://earth.google.com/web/",
    rating: 4.5,
    featured: false
  },
  {
    id: "10",
    title: "AI помощник для кыргызского языка",
    description: "Специализированный инструмент для изучения кыргызского языка, проверки правописания и создания учебных материалов.",
    category: "Кыргызский язык",
    url: "https://translate.google.com/?sl=ky&tl=ru",
    rating: 4.1,
    featured: false
  },
  {
    id: "11",
    title: "Socratic для учеников IPS",
    description: "AI-помощник для домашних заданий учеников Intellect Pro School. Распознает задачи через камеру и предоставляет пошаговые объяснения.",
    category: "Универсальные",
    url: "https://socratic.org",
    rating: 4.4,
    featured: false
  },
  {
    id: "12",
    title: "Виртуальные лаборатории IPS",
    description: "Безопасные виртуальные научные эксперименты с AI-симуляциями для уроков биологии и химии в Intellect Pro School.",
    category: "Биология",
    url: "https://labster.com",
    rating: 4.6,
    featured: true
  }
];