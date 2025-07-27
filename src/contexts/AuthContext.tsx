// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api/clients';
import { toast } from '@/hooks/use-toast';
import { SponsorSelection } from '@/components/common/SponsorSelection';
import { useSponsorSelection } from '@/hooks/useSponsorSelection';
import { peermallApi } from '@/services/peermall.api';
import sponsorApi, { Sponsor } from '@/services/sponsor.api';


// 타입 정의
export interface User {
  [x: string]: string;
  user_uid: string;
  email: string;
  name?: string;
  phone?: string;
  profile_image?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  sessionId: string | null;
  login: (sessionData: any, userData: User) => void;
  logout: () => Promise<void>;
}

// Context 생성
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// localStorage 키 상수
const SESSION_ID_KEY = 'sessionId';
const CSRF_TOKEN_KEY = 'csrfToken';

// AuthProvider 컴포넌트
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const { hasSponsor, isLoading: sponsorLoading, saveSponsor } = useSponsorSelection();
  const navigate = useNavigate();

  const logout = useCallback(async () => {
    const currentSessionId = localStorage.getItem(SESSION_ID_KEY);
    
    // 로컬 상태 및 스토리지 초기화
    setUser(null);
    setIsAuthenticated(false);
    setSessionId(null);
    localStorage.removeItem(SESSION_ID_KEY);
    localStorage.removeItem(CSRF_TOKEN_KEY);

    try {
      if (currentSessionId) {
        await apiClient.post('/users/logout', { sessionId: currentSessionId });
      }
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      toast({
        title: "로그아웃",
        description: "안전하게 로그아웃되었습니다.",
      });
      navigate('/');
    }
  }, [navigate]);

  const verifySession = useCallback(async () => {
    const storedSessionId = localStorage.getItem(SESSION_ID_KEY);
    const storedCsrfToken = localStorage.getItem(CSRF_TOKEN_KEY);

    if (!storedSessionId || !storedCsrfToken) {
      setIsLoading(false);
      return;
    }

     try {
      // CSRF 토큰도 헤더에 포함되도록 확인
      const response = await apiClient.get('/users/me', {
        headers: {
          'X-CSRF-Token': storedCsrfToken
        }
      });
       
       if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        setSessionId(storedSessionId);
        
        // 스폰서가 선택되지 않았다면 /select-sponsor 페이지로 리다이렉트
        if (!hasSponsor && !sponsorLoading) {
          navigate('/select-sponsor');
        }
      } else {
        await logout();
      }
    } catch (error) {
      console.error('Session verification failed:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  }, [logout]);
  
  useEffect(() => {
    verifySession();
  }, [verifySession]);

  const login = async (sessionData: any, userData: User) => {
    localStorage.setItem(SESSION_ID_KEY, sessionData.sessionId);
    localStorage.setItem(CSRF_TOKEN_KEY, sessionData.csrfToken);
    setUser(userData);
    setIsAuthenticated(true);
    setSessionId(sessionData.sessionId);

    // 로그인 후 스폰서 정보 다시 확인
    try {
      const sponsorData = await sponsorApi.getUserSponsor(userData.user_uid);
      if (sponsorData) {
        saveSponsor(sponsorData as unknown as Sponsor);
      } else {
        navigate('/select-sponsor');
      }
    } catch (error) {
      console.error('스폰서 정보 조회 실패:', error);
      navigate('/select-sponsor');
    }
  };

  const handleSponsorSelect = async (sponsor: any, userData: User) => {
    saveSponsor(sponsor);
    toast({
      title: "스폰서 선택 완료",
      description: `${sponsor.name}이(가) 선택되었습니다.`,
    });

    const mallInfo = await peermallApi.getPeermallByUid(userData.user_uid);
    navigate(`/home/${mallInfo.url}`); // 스폰서 선택 후 피어몰 페이지로 이동
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    sessionId,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};