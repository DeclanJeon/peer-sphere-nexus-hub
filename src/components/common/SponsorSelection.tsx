import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Star } from 'lucide-react';
import { getSponsors, selectSponsor, Sponsor, UserData } from '@/services/sponsor.api';

interface SponsorSelectionProps {
  open: boolean;
  onSponsorSelect: (sponsor: Sponsor, userData: UserData) => void;
  userData: UserData;
}

export const SponsorSelection: React.FC<SponsorSelectionProps> = ({
  open,
  onSponsorSelect,
  userData,
}) => {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSponsors = async () => {
      try {
        const fetchedSponsors = await getSponsors();
        setSponsors(fetchedSponsors);
      } catch (err) {
        setError('Failed to load sponsors.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSponsors();
  }, []);

  const handleSponsorClick = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
  };

  const handleConfirm = async () => {
    if (selectedSponsor && userData) {
      try {
        await selectSponsor(selectedSponsor, userData);
        onSponsorSelect(selectedSponsor, userData);
      } catch (err) {
        setError('Failed to select sponsor.');
        console.error(err);
      }
    }
  };

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              스폰서를 선택해주세요
            </DialogTitle>
            <p className="text-center text-muted-foreground mt-2">
              피어몰 서비스를 이용하기 위해 스폰서를 선택해야 합니다.
            </p>
          </DialogHeader>
          <div className="text-center py-8">Loading sponsors...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              스폰서를 선택해주세요
            </DialogTitle>
            <p className="text-center text-muted-foreground mt-2">
              피어몰 서비스를 이용하기 위해 스폰서를 선택해야 합니다.
            </p>
          </DialogHeader>
          <div className="text-center py-8 text-red-500">{error}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            스폰서를 선택해주세요
          </DialogTitle>
          <p className="text-center text-muted-foreground mt-2">
            피어몰 서비스를 이용하기 위해 스폰서를 선택해야 합니다.
          </p>
        </DialogHeader>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
          {sponsors.map((sponsor) => (
            <Card
              key={sponsor.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedSponsor?.id === sponsor.id
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:bg-accent/50'
              }`}
              onClick={() => handleSponsorClick(sponsor)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <h3 className="font-semibold text-sm">{sponsor.name}</h3>
                    </div>
                    {sponsor.name_en && (
                      <p className="text-xs text-muted-foreground">{sponsor.name_en}</p>
                    )}
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Premium Partner
                    </Badge>
                  </div>
                  {selectedSponsor?.id === sponsor.id && (
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-6">
          <Button
            onClick={handleConfirm}
            disabled={!selectedSponsor}
            size="lg"
            className="min-w-[200px]"
          >
            {selectedSponsor ? `${selectedSponsor.name} 선택` : '스폰서를 선택해주세요'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};