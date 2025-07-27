import { useState, useEffect } from 'react';

interface Sponsor {
  id: number;
  name: string;
  name_en?: string;
}

const SPONSOR_STORAGE_KEY = 'selectedSponsor';

export const useSponsorSelection = () => {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 로컬 스토리지에서 선택된 스폰서 정보 확인
    const storedSponsor = localStorage.getItem(SPONSOR_STORAGE_KEY);
    if (storedSponsor) {
      try {
        const sponsor = JSON.parse(storedSponsor);
        setSelectedSponsor(sponsor);
      } catch (error) {
        console.error('Error parsing sponsor data:', error);
        localStorage.removeItem(SPONSOR_STORAGE_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const saveSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    localStorage.setItem(SPONSOR_STORAGE_KEY, JSON.stringify(sponsor));
  };

  const clearSponsor = () => {
    setSelectedSponsor(null);
    localStorage.removeItem(SPONSOR_STORAGE_KEY);
  };

  const hasSponsor = Boolean(selectedSponsor);

  return {
    selectedSponsor,
    hasSponsor,
    isLoading,
    saveSponsor,
    clearSponsor,
  };
};