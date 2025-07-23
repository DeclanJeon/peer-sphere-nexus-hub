// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '@/lib/api/clients';
import { toast } from '@/hooks/use-toast';

// 타입 정의
interface User {
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

  const login = (sessionData: any, userData: User) => {
    localStorage.setItem(SESSION_ID_KEY, sessionData.sessionId);
    localStorage.setItem(CSRF_TOKEN_KEY, sessionData.csrfToken);
    setUser(userData);
    setIsAuthenticated(true);
    setSessionId(sessionData.sessionId);
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
