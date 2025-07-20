import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface PeermallHeroSectionProps {
  name: string;
  description: string;
  imageUrl?: string;
}

const PeermallHeroSection = ({ name, description, imageUrl }: PeermallHeroSectionProps) => {
  return (
    <section className="relative h-96 bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=500&fit=crop'}
          alt="Hero"
          className="w-full h-full object-cover opacity-40"
        />
      </div>
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center justify-center">
        <div className="text-white text-center max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {name}
          </h1>
          <p className="text-xl mb-8 text-gray-300/90">
            {description}
          </p>
          <Button size="lg" variant="secondary" className="px-8 py-3">
            <Plus className="h-5 w-5 mr-2" />
            둘러보기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PeermallHeroSection;