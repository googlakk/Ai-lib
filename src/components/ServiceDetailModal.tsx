import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, BookOpen, Lightbulb, Tags, Star } from 'lucide-react';

interface Service {
  id: string;
  title: string;
  description: string;
  url: string;
  instructions: string | null;
  examples: string | null;
  tags: string[] | null;
  categories: {
    name: string;
  };
}

interface ServiceDetailModalProps {
  service: Service | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  isOpen,
  onClose,
}) => {
  if (!service) return null;

  const hasExtendedContent = service.instructions || service.examples || (service.tags && service.tags.length > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-bold text-foreground">
                {service.title}
              </DialogTitle>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-ai-secondary text-ai-primary font-medium">
                  {service.categories.name}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.5</span>
                </div>
              </div>
            </div>
            <Button asChild>
              <a 
                href={service.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Открыть сервис
              </a>
            </Button>
          </div>
        </DialogHeader>

        <DialogDescription className="text-base leading-relaxed text-muted-foreground mt-4">
          {service.description}
        </DialogDescription>

        {hasExtendedContent && (
          <div className="mt-6">
            <Tabs defaultValue={service.instructions ? "instructions" : service.examples ? "examples" : "tags"} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                {service.instructions && (
                  <TabsTrigger value="instructions" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Инструкции
                  </TabsTrigger>
                )}
                {service.examples && (
                  <TabsTrigger value="examples" className="flex items-center gap-2">
                    <Lightbulb className="w-4 h-4" />
                    Примеры
                  </TabsTrigger>
                )}
                {service.tags && service.tags.length > 0 && (
                  <TabsTrigger value="tags" className="flex items-center gap-2">
                    <Tags className="w-4 h-4" />
                    Теги
                  </TabsTrigger>
                )}
              </TabsList>

              {service.instructions && (
                <TabsContent value="instructions" className="mt-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-ai-primary" />
                      Пошаговая инструкция
                    </h3>
                    <ScrollArea className="h-64 w-full rounded-md border p-4">
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {service.instructions}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              )}

              {service.examples && (
                <TabsContent value="examples" className="mt-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-ai-primary" />
                      Примеры применения
                    </h3>
                    <ScrollArea className="h-64 w-full rounded-md border p-4">
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {service.examples}
                      </div>
                    </ScrollArea>
                  </div>
                </TabsContent>
              )}

              {service.tags && service.tags.length > 0 && (
                <TabsContent value="tags" className="mt-4">
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Tags className="w-5 h-5 text-ai-primary" />
                      Теги и категории
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {service.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-sm">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}

        {!hasExtendedContent && (
          <div className="mt-6 p-4 bg-muted/50 rounded-lg text-center">
            <p className="text-sm text-muted-foreground">
              Для этого сервиса пока нет дополнительных инструкций и примеров использования.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Инструкции и примеры добавляются учителями при создании сервиса.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};