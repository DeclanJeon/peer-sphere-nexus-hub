
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Peermall, PeermallContextType, PeermallCreationData } from '@/types/peermall';
import apiClient from '@/lib/api/clients';

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
      const response = await apiClient.get('/api/v1/peermalls');
      if (response.data.success) {
        setPeermalls(response.data.data);
      }
      setError(null);
    } catch (err) {
      setError('피어몰 목록을 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPeermallByUrl = useCallback(async (url: string) => {
    setLoading(true);
    setError(null);
    setCurrentPeermall(null);
    try {
      const response = await apiClient.get(`/api/v1/peermalls/${url}`);

      if (response.data.success) {
        setCurrentPeermall(response.data.data);
      } else {
        // API 응답은 성공했으나, success 플래그가 false인 경우
        setError('404'); 
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('404');
      } else {
        setError('피어몰 정보를 불러오는데 실패했습니다.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const createPeermall = async (data: PeermallCreationData) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/api/v1/peermalls', data);
      if (response.data.success) {
        const newPeermall = response.data.data;
        setPeermalls(prev => [...prev, newPeermall]);
        setCurrentPeermall(newPeermall);
        setError(null);
        navigate(`/peermall/${newPeermall.url}`);
        return newPeermall;
      } else {
        throw new Error(response.data.message || '피어몰 생성에 실패했습니다.');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || '피어몰 생성 중 오류가 발생했습니다.';
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
      const peermallUrl = decodeURIComponent(urlMatch[1]);
      fetchPeermallByUrl(peermallUrl);
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
