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

  const createPeermall = async (data: PeermallCreationData, imageFile: File | null) => {
    setLoading(true);
    try {
      const formData = new FormData();
      
      // FormData에 텍스트 필드 추가
      // image 필드는 제외하고 추가 (파일로 따로 추가할 것이므로)
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'image' && value !== null && value !== undefined && value !== '') {
          formData.append(key, String(value));
        }
      });

      // 이미지 파일 추가
      if (imageFile) {
        formData.append('image', imageFile, imageFile.name);
        console.log('이미지 파일 추가됨:', {
          name: imageFile.name,
          size: imageFile.size,
          type: imageFile.type
        });
      }

      // FormData 내용 확인 (디버깅용)
      if (process.env.NODE_ENV === 'development') {
        console.log('FormData 내용:');
        for (let [key, value] of formData.entries()) {
          if (value instanceof File) {
            console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
          } else {
            console.log(`${key}: ${value}`);
          }
        }
      }

      const response = await peermallApi.createPeermall(formData);
      const mappedPeermall = mapApiToPeermall(response);
      
      // 상태 업데이트
      setPeermalls(prev => [...prev, mappedPeermall]);
      setCurrentPeermall(mappedPeermall);
      setError(null);
      
      // 생성된 피어몰로 이동
      navigate(`/peermall/${mappedPeermall.url}`);
      
      return mappedPeermall;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || '피어몰 생성 중 오류가 발생했습니다.';
      setError(errorMessage);
      console.error('피어몰 생성 실패:', err);
      
      // 에러 상세 정보 로깅 (개발 환경에서만)
      if (process.env.NODE_ENV === 'development') {
        console.error('에러 상세:', {
          status: err.response?.status,
          data: err.response?.data,
          headers: err.response?.headers
        });
      }
      
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
    setCurrentPeermall,
  };

  return (
    <PeermallContext.Provider value={value}>
      {children}
    </PeermallContext.Provider>
  );
};