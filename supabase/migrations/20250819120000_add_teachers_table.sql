-- Create teachers table for authentication
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  school TEXT,
  subject TEXT,
  password_hash TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add teacher_id to services table to track who added the service
ALTER TABLE public.services 
ADD COLUMN teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL;

-- Enable Row Level Security for teachers
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Create policies for teachers
CREATE POLICY "Teachers can view their own profile" 
ON public.teachers 
FOR SELECT 
USING (auth.uid()::text = id::text);

CREATE POLICY "Teachers can update their own profile" 
ON public.teachers 
FOR UPDATE 
USING (auth.uid()::text = id::text);

-- Update services policies to require authentication
DROP POLICY "Anyone can insert services" ON public.services;
DROP POLICY "Anyone can update services" ON public.services;
DROP POLICY "Anyone can delete services" ON public.services;

-- New service policies - only authenticated teachers can modify
CREATE POLICY "Only authenticated teachers can insert services" 
ON public.services 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Teachers can update their own services" 
ON public.services 
FOR UPDATE 
USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their own services" 
ON public.services 
FOR DELETE 
USING (teacher_id = auth.uid());

-- Create trigger for automatic timestamp updates on teachers
CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle teacher registration
CREATE OR REPLACE FUNCTION public.register_teacher(
  p_email TEXT,
  p_full_name TEXT,
  p_school TEXT DEFAULT NULL,
  p_subject TEXT DEFAULT NULL,
  p_password TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  teacher_id UUID;
  hashed_password TEXT;
BEGIN
  -- Hash the password (in production, use proper password hashing)
  hashed_password := crypt(p_password, gen_salt('bf'));
  
  -- Insert new teacher
  INSERT INTO public.teachers (email, full_name, school, subject, password_hash)
  VALUES (p_email, p_full_name, p_school, p_subject, hashed_password)
  RETURNING id INTO teacher_id;
  
  RETURN teacher_id;
END;
$$;

-- Create function for teacher login
CREATE OR REPLACE FUNCTION public.authenticate_teacher(
  p_email TEXT,
  p_password TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  teacher_record RECORD;
BEGIN
  SELECT id, password_hash, is_active
  INTO teacher_record
  FROM public.teachers
  WHERE email = p_email;
  
  -- Check if teacher exists and is active
  IF NOT FOUND OR NOT teacher_record.is_active THEN
    RETURN NULL;
  END IF;
  
  -- Verify password
  IF crypt(p_password, teacher_record.password_hash) = teacher_record.password_hash THEN
    RETURN teacher_record.id;
  ELSE
    RETURN NULL;
  END IF;
END;
$$;