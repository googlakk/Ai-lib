import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Loader2, Sparkles, Globe, X } from 'lucide-react';
import { Tables } from '../integrations/supabase/types';
import { generateServiceContent, generateDescriptionFromUrl } from '../utils/aiContentGenerator';

type Category = Tables<'categories'>;

interface ServiceFormData {
  id?: string;
  title: string;
  description: string;
  url: string;
  category_id: string;
  instructions: string | null;
  examples: string | null;
  tags: string[] | null;
}

interface AddServiceFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  editingService?: ServiceFormData | null;
  mode?: 'add' | 'edit';
}

export const AddServiceForm: React.FC<AddServiceFormProps> = ({ onSuccess, onCancel, editingService, mode = 'add' }) => {
  const { teacher } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    title: editingService?.title || '',
    description: editingService?.description || '',
    url: editingService?.url || '',
    category_id: editingService?.category_id || '',
    instructions: editingService?.instructions || '',
    examples: editingService?.examples || '',
    tags: editingService?.tags || []
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category_id: value
    }));
  };

  const handleGenerateContent = async () => {
    if (!formData.title || !formData.category_id) {
      setError('Для генерации контента заполните название сервиса и выберите категорию');
      return;
    }

    const selectedCategory = categories.find(c => c.id === formData.category_id);
    if (!selectedCategory) return;

    setIsGenerating(true);
    setError(''); // Очищаем предыдущие ошибки
    
    try {
      const generatedContent = await generateServiceContent({
        title: formData.title,
        description: formData.description,
        category: selectedCategory.name,
        url: formData.url
      });

      setFormData(prev => ({
        ...prev,
        instructions: generatedContent.instructions,
        examples: generatedContent.examples,
        tags: [...prev.tags, ...generatedContent.tags.filter(tag => !prev.tags.includes(tag))]
      }));
      
      // Показываем успешное уведомление
      console.log('Контент успешно сгенерирован с помощью Gemini AI');
    } catch (error) {
      console.error('Ошибка генерации:', error);
      setError('Ошибка при генерации контента с помощью AI. Проверьте API ключ Gemini в переменных окружения.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDescription = async () => {
    if (!formData.url || !formData.title) {
      setError('Для генерации описания заполните название и URL сервиса');
      return;
    }

    setIsGenerating(true);
    setError(''); // Очищаем предыдущие ошибки
    
    try {
      const description = await generateDescriptionFromUrl(formData.url, formData.title);
      setFormData(prev => ({
        ...prev,
        description
      }));
      
      console.log('Описание успешно сгенерировано с помощью Gemini AI');
    } catch (error) {
      console.error('Ошибка генерации описания:', error);
      setError('Ошибка при генерации описания с помощью AI. Проверьте API ключ Gemini в переменных окружения.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const tag = newTag.trim().toLowerCase();
      if (!formData.tags.includes(tag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...prev.tags, tag]
        }));
      }
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!teacher) {
      setError('Вы должны быть авторизованы для добавления сервиса');
      return;
    }

    if (!formData.title || !formData.description || !formData.url || !formData.category_id) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setIsLoading(true);

      const serviceData = {
        title: formData.title,
        description: formData.description,
        url: formData.url,
        category_id: formData.category_id,
        instructions: formData.instructions || null,
        examples: formData.examples || null,
        tags: formData.tags.length > 0 ? formData.tags : null
      };

      let error;

      if (mode === 'edit' && editingService?.id) {
        // Обновление существующего сервиса
        const result = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', editingService.id);
        error = result.error;
      } else {
        // Создание нового сервиса
        const result = await supabase
          .from('services')
          .insert({
            ...serviceData,
            teacher_id: teacher.id
          });
        error = result.error;
      }

      if (error) throw error;

      if (mode === 'add') {
        setFormData({
          title: '',
          description: '',
          url: '',
          category_id: '',
          instructions: '',
          examples: '',
          tags: []
        });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error with service:', error);
      setError(`Ошибка при ${mode === 'edit' ? 'обновлении' : 'добавлении'} сервиса. Попробуйте еще раз.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!teacher) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <Alert>
            <AlertDescription>
              Для добавления сервисов необходимо войти в систему
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          {mode === 'edit' ? 'Редактировать AI-сервис' : 'Добавить новый AI-сервис'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="basic" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Основная информация</TabsTrigger>
              <TabsTrigger value="content">Контент и инструкции</TabsTrigger>
              <TabsTrigger value="tags">Теги и метки</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Название сервиса *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Категория *</Label>
                  <Select value={formData.category_id} onValueChange={handleSelectChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите категорию" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="url">URL сервиса *</Label>
                <div className="flex gap-2">
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    placeholder="https://example.com"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating || !formData.url || !formData.title}
                    className="shrink-0"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Globe className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Описание *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                  placeholder="Краткое описание сервиса и его возможностей..."
                />
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Инструкции и примеры использования</h3>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !formData.title || !formData.category_id}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Генерация...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Сгенерировать AI-контент
                    </>
                  )}
                </Button>
              </div>

              <div>
                <Label htmlFor="instructions">Инструкции по использованию</Label>
                <Textarea
                  id="instructions"
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Пошаговые инструкции по использованию сервиса..."
                />
              </div>

              <div>
                <Label htmlFor="examples">Примеры применения</Label>
                <Textarea
                  id="examples"
                  name="examples"
                  value={formData.examples}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Конкретные примеры использования сервиса в образовательном процессе..."
                />
              </div>
            </TabsContent>

            <TabsContent value="tags" className="space-y-4">
              <div>
                <Label htmlFor="newTag">Добавить теги</Label>
                <Input
                  id="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="Введите тег и нажмите Enter..."
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Теги помогают в поиске и категоризации сервисов
                </p>
              </div>

              <div className="space-y-2">
                <Label>Выбранные теги:</Label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                  {formData.tags.length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      Теги не добавлены
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6 pt-4 border-t">
            <Button type="submit" disabled={isLoading || isGenerating}>
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === 'edit' ? 'Сохранение...' : 'Добавление...'}
                </>
              ) : (
                mode === 'edit' ? 'Сохранить изменения' : 'Добавить сервис'
              )}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Отмена
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};