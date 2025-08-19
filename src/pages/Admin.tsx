import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { Plus, Edit, Trash2, ArrowLeft, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AddServiceForm } from "../components/AddServiceForm";

interface Category {
  id: string;
  name: string;
  description: string;
}

interface Service {
  id: string;
  title: string;
  description: string;
  url: string;
  category_id: string;
  teacher_id: string | null;
  instructions: string | null;
  examples: string | null;
  tags: string[] | null;
  categories: {
    name: string;
  };
}

const Admin = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const [showEditServiceForm, setShowEditServiceForm] = useState(false);
  const { toast } = useToast();
  const { teacher } = useAuth();
  const navigate = useNavigate();

  const categoryForm = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesResponse, servicesResponse] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("services").select("*, categories(name)").order("title"),
      ]);

      if (categoriesResponse.error) throw categoriesResponse.error;
      if (servicesResponse.error) throw servicesResponse.error;

      setCategories(categoriesResponse.data || []);
      setServices(servicesResponse.data || []);
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить данные",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async (data: { name: string; description: string }) => {
    try {
      const { error } = await supabase.from("categories").insert([data]);
      if (error) throw error;

      toast({
        title: "Успех",
        description: "Категория создана",
      });
      categoryForm.reset();
      fetchData();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать категорию",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCategory = async (data: { name: string; description: string }) => {
    if (!editingCategory) return;

    try {
      const { error } = await supabase
        .from("categories")
        .update(data)
        .eq("id", editingCategory.id);
      if (error) throw error;

      toast({
        title: "Успех",
        description: "Категория обновлена",
      });
      setEditingCategory(null);
      categoryForm.reset();
      fetchData();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить категорию",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Успех",
        description: "Категория удалена",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить категорию",
        variant: "destructive",
      });
    }
  };


  const handleDeleteService = async (id: string) => {
    if (!teacher) return;

    const service = services.find(s => s.id === id);
    if (service && service.teacher_id !== teacher.id) {
      toast({
        title: "Ошибка",
        description: "Вы можете удалять только свои сервисы",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.from("services").delete().eq("id", id);
      if (error) throw error;

      toast({
        title: "Успех",
        description: "Сервис удален",
      });
      fetchData();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось удалить сервис",
        variant: "destructive",
      });
    }
  };

  const editCategory = (category: Category) => {
    setEditingCategory(category);
    categoryForm.setValue("name", category.name);
    categoryForm.setValue("description", category.description);
  };

  const editService = (service: Service) => {
    setEditingService(service);
    setShowEditServiceForm(true);
    setShowAddServiceForm(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  if (!teacher) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <Lock className="w-12 h-12 text-muted-foreground" />
              <Alert>
                <AlertDescription>
                  Для доступа к админ-панели необходимо войти в систему как учитель
                </AlertDescription>
              </Alert>
              <div className="flex gap-2">
                <Button onClick={() => navigate('/auth')}>
                  Войти / Зарегистрироваться
                </Button>
                <Button variant="outline" onClick={() => navigate('/')}>
                  На главную
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-primary transition-all duration-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              На главную
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Админ-панель</h1>
        </div>

        <Tabs defaultValue="categories" className="space-y-6">
          <TabsList className="bg-white/10 border-white/20">
            <TabsTrigger value="categories" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
              Категории
            </TabsTrigger>
            <TabsTrigger value="services" className="text-white data-[state=active]:bg-white data-[state=active]:text-primary">
              Сервисы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="categories" className="space-y-6">
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Управление категориями
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-primary transition-all duration-300">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить категорию
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingCategory ? "Редактировать" : "Добавить"} категорию</DialogTitle>
                        <DialogDescription>
                          {editingCategory ? "Отредактируйте" : "Создайте новую"} категорию для AI-сервисов
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...categoryForm}>
                        <form onSubmit={categoryForm.handleSubmit(editingCategory ? handleUpdateCategory : handleCreateCategory)} className="space-y-4">
                          <FormField
                            control={categoryForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Название</FormLabel>
                                <FormControl>
                                  <Input {...field} required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={categoryForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Описание</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2">
                            <Button type="submit">
                              {editingCategory ? "Обновить" : "Создать"}
                            </Button>
                            {editingCategory && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setEditingCategory(null);
                                  categoryForm.reset();
                                }}
                              >
                                Отмена
                              </Button>
                            )}
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.map((category) => (
                    <Card key={category.id} className="bg-white/5 border-white/10">
                      <CardHeader>
                        <CardTitle className="text-white text-lg">{category.name}</CardTitle>
                        <CardDescription className="text-white/80">{category.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editCategory(category)}
                            className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary transition-all duration-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="bg-red-500/20 text-white border-red-400/30 hover:bg-red-500 hover:text-white transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            {showAddServiceForm || showEditServiceForm ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowAddServiceForm(false);
                      setShowEditServiceForm(false);
                      setEditingService(null);
                    }}
                    className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-primary transition-all duration-300"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад к списку
                  </Button>
                </div>
                <AddServiceForm
                  mode={showEditServiceForm ? 'edit' : 'add'}
                  editingService={editingService ? {
                    id: editingService.id,
                    title: editingService.title,
                    description: editingService.description,
                    url: editingService.url,
                    category_id: editingService.category_id,
                    instructions: editingService.instructions,
                    examples: editingService.examples,
                    tags: editingService.tags
                  } : null}
                  onSuccess={() => {
                    setShowAddServiceForm(false);
                    setShowEditServiceForm(false);
                    setEditingService(null);
                    fetchData();
                    toast({
                      title: "Успех",
                      description: showEditServiceForm ? "Сервис успешно обновлен" : "Сервис успешно добавлен",
                    });
                  }}
                  onCancel={() => {
                    setShowAddServiceForm(false);
                    setShowEditServiceForm(false);
                    setEditingService(null);
                  }}
                />
              </div>
            ) : (
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Управление сервисами
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setShowAddServiceForm(true)}
                      className="bg-white/20 text-white border-white/30 hover:bg-white hover:text-primary transition-all duration-300"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Добавить сервис с AI
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {services.filter(service => service.teacher_id === teacher?.id).map((service) => (
                      <Card key={service.id} className="bg-white/5 border-white/10">
                        <CardHeader>
                          <CardTitle className="text-white text-lg">{service.title}</CardTitle>
                          <CardDescription className="text-white/80">{service.categories.name}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-white/90 text-sm mb-4">{service.description}</p>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editService(service)}
                              className="bg-white/10 text-white border-white/30 hover:bg-white hover:text-primary transition-all duration-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteService(service.id)}
                              className="bg-red-500/20 text-white border-red-400/30 hover:bg-red-500 hover:text-white transition-all duration-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {services.filter(service => service.teacher_id === teacher?.id).length === 0 && (
                      <div className="col-span-full text-center text-white/60 py-8">
                        У вас пока нет добавленных сервисов. Нажмите кнопку "Добавить сервис с AI" чтобы создать первый.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;