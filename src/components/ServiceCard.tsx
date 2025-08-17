import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Star } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  category: string;
  url: string;
  rating?: number;
  featured?: boolean;
}

const ServiceCard = ({ title, description, category, url, rating = 4.5, featured = false }: ServiceCardProps) => {
  return (
    <Card className={`group cursor-pointer transition-all duration-300 hover:shadow-ai hover:scale-105 border-border bg-gradient-card ${featured ? 'ring-2 ring-ai-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-semibold text-foreground group-hover:text-ai-primary transition-colors">
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-ai-secondary text-ai-primary font-medium">
                {category}
              </Badge>
              {featured && (
                <Badge className="bg-success text-success-foreground">
                  Рекомендуем
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
      </CardContent>
    </Card>
  );
};

export default ServiceCard;