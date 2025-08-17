-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  url TEXT NOT NULL,
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view categories" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can view services" 
ON public.services 
FOR SELECT 
USING (true);

-- Admin policies will be added after authentication is implemented
-- For now, allow all operations for development
CREATE POLICY "Anyone can insert categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update categories" 
ON public.categories 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete categories" 
ON public.categories 
FOR DELETE 
USING (true);

CREATE POLICY "Anyone can insert services" 
ON public.services 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update services" 
ON public.services 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete services" 
ON public.services 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some initial categories
INSERT INTO public.categories (name, description) VALUES
  ('Математика', 'AI-сервисы для преподавания математики'),
  ('История', 'AI-сервисы для изучения истории'),
  ('Физика', 'AI-сервисы для преподавания физики'),
  ('Языки', 'AI-сервисы для изучения языков'),
  ('Программирование', 'AI-сервисы для обучения программированию');

-- Insert some initial services
INSERT INTO public.services (title, description, url, category_id) VALUES
  ('MathGPT', 'AI-помощник для решения математических задач', 'https://mathgpt.com', (SELECT id FROM public.categories WHERE name = 'Математика')),
  ('HistoryBot', 'Интерактивный помощник по истории', 'https://historybot.ai', (SELECT id FROM public.categories WHERE name = 'История')),
  ('PhysicsAI', 'Симуляции и объяснения физических процессов', 'https://physicsai.com', (SELECT id FROM public.categories WHERE name = 'Физика')),
  ('LangTeacher', 'AI-преподаватель иностранных языков', 'https://langteacher.ai', (SELECT id FROM public.categories WHERE name = 'Языки')),
  ('CodeMentor', 'AI-наставник по программированию', 'https://codementor.ai', (SELECT id FROM public.categories WHERE name = 'Программирование'));