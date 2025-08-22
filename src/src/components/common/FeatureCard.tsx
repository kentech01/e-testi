import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Target, BookOpen, Users } from 'lucide-react';

interface FeatureCardProps {
  feature: {
    icon: string;
    title: string;
    description: string;
    badge: string;
  };
}

const iconMap = {
  Target,
  BookOpen,
  Users,
};

export function FeatureCard({ feature }: FeatureCardProps) {
  const Icon = iconMap[feature.icon as keyof typeof iconMap];

  return (
    <Card className="text-left hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="font-semibold">{feature.title}</h3>
              <Badge variant="secondary" className="text-xs">
                {feature.badge}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}