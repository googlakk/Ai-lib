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
import { Plus, Edit, Trash2, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

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
  const { toast } = useToast();

  const categoryForm = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const serviceForm = useForm({
    defaultValues: {
      title: "",
      description: "",
      url: "",
      category_id: "",
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

  const handleCreateService = async (data: { title: string; description: string; url: string; category_id: string }) => {
    try {
      const { error } = await supabase.from("services").insert([data]);
      if (error) throw error;

      toast({
        title: "Успех",
        description: "Сервис создан",
      });
      serviceForm.reset();
      fetchData();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось создать сервис",
        variant: "destructive",
      });
    }
  };

  const handleUpdateService = async (data: { title: string; description: string; url: string; category_id: string }) => {
    if (!editingService) return;

    try {
      const { error } = await supabase
        .from("services")
        .update(data)
        .eq("id", editingService.id);
      if (error) throw error;

      toast({
        title: "Успех",
        description: "Сервис обновлен",
      });
      setEditingService(null);
      serviceForm.reset();
      fetchData();
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обновить сервис",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (id: string) => {
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
    serviceForm.setValue("title", service.title);
    serviceForm.setValue("description", service.description);
    serviceForm.setValue("url", service.url);
    serviceForm.setValue("category_id", service.category_id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-white text-xl">Загрузка...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-primary">
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
                      <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-primary">
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
                            className="text-white border-white/30 hover:bg-white hover:text-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-white border-white/30 hover:bg-destructive hover:text-white"
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
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Управление сервисами
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-white border-white hover:bg-white hover:text-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить сервис
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{editingService ? "Редактировать" : "Добавить"} сервис</DialogTitle>
                        <DialogDescription>
                          {editingService ? "Отредактируйте" : "Создайте новый"} AI-сервис
                        </DialogDescription>
                      </DialogHeader>
                      <Form {...serviceForm}>
                        <form onSubmit={serviceForm.handleSubmit(editingService ? handleUpdateService : handleCreateService)} className="space-y-4">
                          <FormField
                            control={serviceForm.control}
                            name="title"
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
                            control={serviceForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Описание</FormLabel>
                                <FormControl>
                                  <Textarea {...field} required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={serviceForm.control}
                            name="url"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>URL</FormLabel>
                                <FormControl>
                                  <Input {...field} type="url" required />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={serviceForm.control}
                            name="category_id"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Категория</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Выберите категорию" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {categories.map((category) => (
                                      <SelectItem key={category.id} value={category.id}>
                                        {category.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="flex gap-2">
                            <Button type="submit">
                              {editingService ? "Обновить" : "Создать"}
                            </Button>
                            {editingService && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                  setEditingService(null);
                                  serviceForm.reset();
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
                  {services.map((service) => (
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
                            className="text-white border-white/30 hover:bg-white hover:text-primary"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                            className="text-white border-white/30 hover:bg-destructive hover:text-white"
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
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;