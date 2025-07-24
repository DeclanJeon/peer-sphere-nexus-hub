// src/lib/api/clients.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from '@/hooks/use-toast';

// API 베이스 URL 설정
export const API_BASE_URL =
  process.env.VITE_API_URL || 'http://localhost:9393';

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 갱신 중복 방지를 위한 플래그와 프로미스
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// 토큰 갱신 구독자 추가
const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

// 토큰 갱신 완료 후 구독자들에게 알림
const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

// Request 인터셉터
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const sessionId = localStorage.getItem('sessionId');
    const csrfToken = localStorage.getItem('csrfToken');

    if (sessionId && csrfToken && config.headers) {
      config.headers.Authorization = `Bearer ${sessionId}`;
      config.headers['X-CSRF-Token'] = csrfToken;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // 401 에러이고 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // 세션 만료 처리
      localStorage.removeItem('sessionId');
      localStorage.removeItem('csrfToken');
      window.location.href = '/login';

      toast({
        title: '세션 만료',
        description: '다시 로그인해주세요.',
        variant: 'destructive',
      });

      return Promise.reject(error);
    }

    // 기타 에러 처리
    if (error.response?.status === 403) {
      toast({
        title: '권한 없음',
        description: '해당 작업을 수행할 권한이 없습니다.',
        variant: 'destructive',
      });
    } else if (error.response?.status === 500) {
      toast({
        title: '서버 오류',
        description: '서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.',
        variant: 'destructive',
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;
