
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Peermall, PeermallContextType } from '@/types/peermall';
import { peermallService } from '@/lib/indexeddb';

const PeermallContext = createContext<PeermallContextType | undefined>(undefined);

export const usePeermall = () => {
  const context = useContext(PeermallContext);
  if (context === undefined) {
    throw new Error('usePeermall must be used within a PeermallProvider');
  }
  return context;
};

export const PeermallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPeermall, setCurrentPeermall] = useState<Peermall | null>(null);
  const location = useLocation();

  const isMainPeermall = !location.pathname.startsWith('/peermall/');

  useEffect(() => {
    const loadPeermall = async () => {
      if (isMainPeermall) {
        setCurrentPeermall(null);
        return;
      }

      const urlMatch = location.pathname.match(/^\/peermall\/([^\/]+)/);
      if (urlMatch) {
        const peermallUrl = decodeURIComponent(urlMatch[1]);
        try {
          const peermalls = await peermallService.getAllPeermalls();
          const peermall = peermalls.find(p => p.url === peermallUrl);
          setCurrentPeermall(peermall || null);
        } catch (error) {
          console.error('Failed to load peermall:', error);
          setCurrentPeermall(null);
        }
      }
    };

    loadPeermall();
  }, [location.pathname, isMainPeermall]);

  const value = {
    currentPeermall,
    isMainPeermall,
    setCurrentPeermall,
  };

  return (
    <PeermallContext.Provider value={value}>
      {children}
    </PeermallContext.Provider>
  );
};
