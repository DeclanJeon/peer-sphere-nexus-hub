// src/components/sponsor/SponsorCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sponsor } from '@/types/sponsor';
import { Check } from 'lucide-react';

interface SponsorCardProps {
  sponsor: Sponsor;
  isSelected: boolean;
  onSelect: (sponsor: Sponsor) => void;
}

const SponsorCard = ({ sponsor, isSelected, onSelect }: SponsorCardProps) => {
  return (
    <Card 
      className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
        isSelected 
          ? 'ring-2 ring-primary shadow-md bg-primary/5' 
          : 'hover:shadow-md'
      }`}
      onClick={() => onSelect(sponsor)}
    >
      <CardContent className="p-6">
        {isSelected && (
          <div className="absolute top-3 right-3">
            <div className="bg-primary text-primary-foreground rounded-full p-1">
              <Check className="h-4 w-4" />
            </div>
          </div>
        )}
        
        <div className="flex flex-col items-center text-center space-y-4">
          {sponsor.logoUrl ? (
            <img 
              src={sponsor.logoUrl} 
              alt={sponsor.name}
              className="h-16 w-auto object-contain"
            />
          ) : (
            <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground text-sm font-medium">
                {sponsor.name.charAt(0)}
              </span>
            </div>
          )}
          
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{sponsor.name}</h3>
            {sponsor.name_en && (
              <p className="text-sm text-muted-foreground">{sponsor.name_en}</p>
            )}
          </div>
          
          {sponsor.description && (
            <p className="text-sm text-muted-foreground text-center">
              {sponsor.description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SponsorCard;