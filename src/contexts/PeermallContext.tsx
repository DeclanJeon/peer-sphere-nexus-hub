
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Peermall, PeermallContextType, PeermallCreationData } from '@/types/peermall';
import { peermallApi } from '@/services/peermall.api';

// Helper function to map API response to Peermall type
const mapApiToPeermall = (apiPeermall: any): Peermall => {
  // Map API fields to Peermall type, handling both new and legacy field names
  return {
    ...apiPeermall,
    // Map legacy fields for backward compatibility
    address: apiPeermall.url || apiPeermall.address,
    ownerName: apiPeermall.creatorName || apiPeermall.ownerName,
    image: apiPeermall.imageUrl || apiPeermall.image,
    referralCode: apiPeermall.referrerCode || apiPeermall.referralCode,
    // Ensure required fields have defaults
    description: apiPeermall.description || '',
    creatorName: apiPeermall.creatorName || apiPeermall.ownerName || '익명',
    // Map other fields as needed
  };
};

// Helper function to map PeermallCreationData to API format
const mapToApiData = (data: PeermallCreationData) => {
  // Map PeermallCreationData to API format
  const apiData: any = {
    ...data,
    // Map to API field names
    url: data.url || (data as any).address, // Handle legacy address field
    creatorName: data.creatorName || (data as any).ownerName,
    imageUrl: data.imageUrl || (data as any).image,
    referrerCode: data.referrerCode || (data as any).referralCode,
  };

  // Remove any undefined values
  Object.keys(apiData).forEach(key => apiData[key] === undefined && delete apiData[key]);
  
  return apiData;
};

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
      const peermalls = await peermallApi.getAllPeermalls();
      setPeermalls(peermalls.map(mapApiToPeermall));
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
      const peermall = await peermallApi.getPeermallByUrl(url);
      setCurrentPeermall(mapApiToPeermall(peermall));
    } catch (err: any) {
      if (err.response?.status === 404) {
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
      const newPeermall: PeermallCreationData = {
        name: data.name,
        description: data.description,
        url: data.url, // Changed from address to url to match backend
        imageUrl: data.imageUrl, // Changed from image to imageUrl to match backend
        category: data.category,
        creatorName: data.creatorName || data.ownerName || '익명',
        ownerEmail: data.ownerEmail,
        referrerCode: data.referrerCode, // Changed from referralCode to referrerCode
        // Note: status is managed by the backend and should not be set by the client
        // createdAt and updatedAt are automatically set by the backend
      };
      const apiData = mapToApiData(newPeermall);
      const response = await peermallApi.createPeermall(apiData);
      const mappedPeermall = mapApiToPeermall(response);
      setPeermalls(prev => [...prev, mappedPeermall]);
      setCurrentPeermall(mappedPeermall);
      setError(null);
      navigate(`/peermall/${mappedPeermall.url}`);
      return mappedPeermall;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '피어몰 생성 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error(err);
      throw new Error(errorMessage);
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
