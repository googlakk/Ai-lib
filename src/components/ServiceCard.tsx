import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, Star, ChevronDown, ChevronUp, BookOpen, Lightbulb, Tags, Eye } from "lucide-react";
import { useState } from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  category: string;
  url: string;
  rating?: number;
  featured?: boolean;
  instructions?: string | null;
  examples?: string | null;
  tags?: string[] | null;
  onShowDetails?: () => void;
}

const ServiceCard = ({ title, description, category, url, rating = 4.5, featured = false, instructions, examples, tags, onShowDetails }: ServiceCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExtendedContent = instructions || examples || (tags && tags.length > 0);

  return (
    <Card className={`group transition-all duration-300 hover:shadow-ai border-border bg-gradient-card ${featured ? 'ring-2 ring-ai-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-ai-primary transition-colors">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-ai-secondary text-ai-primary font-medium">
                {category}
              </Badge>
              {featured && (
                <Badge className="bg-success text-success-foreground">
                  Рекомендуем
                </Badge>
              )}
              {tags && tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {tags && tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{tags.length - 2}
                </Badge>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{rating}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <CardDescription className="text-muted-foreground leading-relaxed">
          {description}
        </CardDescription>

        {hasExtendedContent && (
          <div className="space-y-3">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-between text-sm text-muted-foreground hover:text-foreground"
            >
              <span>{isExpanded ? 'Скрыть детали' : 'Показать детали'}</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>

            {isExpanded && (
              <div className="space-y-4 border-t pt-4">
                {(instructions || examples) && (
                  <Tabs defaultValue={instructions ? "instructions" : "examples"} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      {instructions && (
                        <TabsTrigger value="instructions" className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Инструкции
                        </TabsTrigger>
                      )}
                      {examples && (
                        <TabsTrigger value="examples" className="flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          Примеры
                        </TabsTrigger>
                      )}
                    </TabsList>
                    
                    {instructions && (
                      <TabsContent value="instructions" className="space-y-2">
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {instructions}
                        </div>
                      </TabsContent>
                    )}
                    
                    {examples && (
                      <TabsContent value="examples" className="space-y-2">
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {examples}
                        </div>
                      </TabsContent>
                    )}
                  </Tabs>
                )}

                {tags && tags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Tags className="w-4 h-4" />
                      Теги:
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-2">
          {hasExtendedContent && onShowDetails && (
            <Button 
              variant="outline" 
              onClick={onShowDetails}
              className="w-full group-hover:bg-ai-secondary group-hover:text-ai-primary group-hover:border-ai-primary transition-all duration-300"
            >
              <Eye className="w-4 h-4 mr-2" />
              Инструкции и примеры
            </Button>
          )}
          <Button 
            variant="outline" 
            className="w-full group-hover:bg-ai-primary group-hover:text-white group-hover:border-ai-primary transition-all duration-300"
            asChild
          >
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4 mr-2" />
              Перейти к сервису
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;