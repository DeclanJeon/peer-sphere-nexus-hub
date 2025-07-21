
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Peermall, PeermallContextType, PeermallCreationData } from '@/types/peermall';
import { peermallService } from '@/lib/indexeddb/peermallService';

const PeermallContext = createContext<PeermallContextType | undefined>(undefined);

export const usePeermall = () => {
  const context = useContext(PeermallContext);
  if (context === undefined) {
    throw new Error('usePeermall must be used within a PeermallProvider');
  }
  return context;
};

export const PeermallProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [peermalls, setPeermalls] = useState<Peermall[]>([]);
  const [currentPeermall, setCurrentPeermall] = useState<Peermall | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isMainPeermall = !location.pathname.startsWith('/peermall/');

  const fetchPeermalls = useCallback(async () => {
    setLoading(true);
    try {
      const peermalls = await peermallService.getAllPeermalls();
      setPeermalls(peermalls);
      setError(null);
    } catch (err) {
      setError('피어몰 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPeermallByUrl = useCallback(async (address: string) => {
    setLoading(true);
    setError(null);
    setCurrentPeermall(null);
    try {
      const allPeermalls = await peermallService.getAllPeermalls();
      const peermall = allPeermalls.find(p => p.address === address);
      
      if (peermall) {
        setCurrentPeermall(peermall);
      } else {
        setError('404');
      }
    } catch (err: any) {
      setError('피어몰 정보를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createPeermall = async (data: PeermallCreationData) => {
    setLoading(true);
    try {
      const peermallData = { ...data, status: 'active' as const };
      const newPeermall = await peermallService.createPeermall(peermallData);
      setPeermalls(prev => [...prev, newPeermall]);
      setCurrentPeermall(newPeermall);
      setError(null);
      navigate(`/peermall/${newPeermall.address}`);
      return newPeermall;
    } catch (err: any) {
      const errorMessage = err.message || '피어몰 생성 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlMatch = location.pathname.match(/^\/peermall\/([^\/]+)/);
    if (urlMatch) {
      const peermallAddress = decodeURIComponent(urlMatch[1]);
      fetchPeermallByUrl(peermallAddress);
    } else {
      setCurrentPeermall(null);
    }
  }, [location.pathname, fetchPeermallByUrl]);

  const value = {
    peermalls,
    currentPeermall,
    loading,
    error,
    isMainPeermall,
    fetchPeermalls,
    fetchPeermallByUrl,
    createPeermall,
    setCurrentPeermall, // This might still be needed for other purposes
  };

  return (
    <PeermallContext.Provider value={value}>
      {children}
    </PeermallContext.Provider>
  );
};
