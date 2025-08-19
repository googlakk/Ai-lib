-- Add new columns for instructions and examples to services table
ALTER TABLE public.services 
ADD COLUMN instructions TEXT,
ADD COLUMN examples TEXT,
ADD COLUMN tags TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Create index for better search performance on tags
CREATE INDEX idx_services_tags ON public.services USING GIN (tags);