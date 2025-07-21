// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, KeyRound } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import apiClient from '@/lib/api/clients';

// 구글 OAuth 관련 타입 정의 (단순화)
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
        oauth2: {
          initCodeClient: (config: any) => any;
        };
      };
    };
  }
}

interface LocationState {
  from?: Location;
}

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [googleLoaded, setGoogleLoaded] = useState(false);

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as LocationState;
      const from = state?.from?.pathname || '/';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // OTP 재전송 타이머
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // 구글 OAuth 스크립트 로드 및 초기화 (단순화)
  useEffect(() => {
    const loadGoogleScript = () => {
      // 기존 스크립트가 있다면 제거
      const existingScript = document.querySelector('script[src*="gsi/client"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Google Identity Services 스크립트만 로드
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        initializeGoogle();
      };
      script.onerror = () => {
        console.error('Google Identity Services 스크립트 로드 실패');
        setError('구글 로그인 서비스를 불러올 수 없습니다.');
      };
      document.head.appendChild(script);
    };

    const initializeGoogle = () => {
      if (window.google && import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        try {
          window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          setGoogleLoaded(true);
        } catch (error) {
          console.error('Google Identity Services 초기화 실패:', error);
          setError('구글 로그인 초기화에 실패했습니다.');
        }
      } else {
        console.error('Google Client ID가 설정되지 않았습니다.');
      }
    };

    if (!window.google) {
      loadGoogleScript();
    } else {
      initializeGoogle();
    }

    // 클린업
    return () => {
      const scripts = document.querySelectorAll('script[src*="gsi/client"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, []);

  // 구글 로그인 버튼 렌더링
  useEffect(() => {
    if (googleLoaded && window.google && step === 'email') {
      const googleButtonElement = document.getElementById('google-signin-button');
      if (googleButtonElement) {
        // 기존 버튼 내용 제거
        googleButtonElement.innerHTML = '';
        
        try {
          window.google.accounts.id.renderButton(googleButtonElement, {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
          });
        } catch (error) {
          console.error('구글 버튼 렌더링 실패:', error);
          // 폴백 버튼 생성
          googleButtonElement.innerHTML = `
            <button type="button" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50" onclick="window.handleGoogleLoginFallback()">
              <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google로 로그인
            </button>
          `;
          
          // 폴백 핸들러 등록
          (window as any).handleGoogleLoginFallback = () => {
            setError('구글 로그인 기능을 사용할 수 없습니다. 이메일 로그인을 이용해주세요.');
          };
        }
      }
    }
  }, [googleLoaded, step]);

  // 디바이스 정보 수집
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    
    // 간단한 디바이스 타입 판별
    let deviceType = 'desktop';
    if (/Mobile|Android|iPhone/i.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      deviceType = 'tablet';
    }

    return {
      userAgent,
      platform,
      language,
      deviceType,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  };

  // 구글 로그인 응답 처리
  const handleGoogleResponse = async (response: GoogleCredentialResponse) => {
    if (!response.credential) {
      setError('구글 로그인에 실패했습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const deviceInfo = getDeviceInfo();
      
      const apiResponse = await apiClient.post('/api/v1/users/google-login', {
        idToken: response.credential,
        deviceInfo
      });

      if (apiResponse.data.success) {
        const { session, user } = apiResponse.data.data;
        
        // AuthContext의 login 함수 호출
        login(session, user);
        
        // 사용자 피드백
        if (user.isNewUser) {
          toast({
            title: "환영합니다!",
            description: "PeerMall에 성공적으로 가입되었습니다.",
            duration: 5000
          });

          // 드라이브 권한 요청 (단순화된 버전)
          setTimeout(() => {
            requestGoogleDrivePermission();
          }, 2000);
        } else {
          toast({
            title: "로그인 완료",
            description: "구글 계정으로 로그인되었습니다.",
            duration: 3000
          });
        }
        
        // 원래 가려던 페이지로 리다이렉트
        const state = location.state as LocationState;
        const from = state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      const errorMessage = error.response?.data?.message || '구글 로그인에 실패했습니다.';
      setError(errorMessage);
      toast({
        title: "로그인 실패",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 구글 드라이브 권한 요청 (단순화된 버전)
  const requestGoogleDrivePermission = async () => {
    try {
      // 단순한 확인 다이얼로그로 대체
      const requestPermission = window.confirm(
        "구글 드라이브의 문서를 게시판에 쉽게 가져오시겠습니까?\n(선택사항이며, 나중에도 설정할 수 있습니다)"
      );

      if (requestPermission && window.google?.accounts?.oauth2) {
        // Google Identity Services의 OAuth2 Code Client 사용
        const client = window.google.accounts.oauth2.initCodeClient({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          scope: 'https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/documents.readonly',
          callback: async (response: any) => {
            if (response.code) {
              try {
                // 백엔드에 인증 코드 전송
                await apiClient.post('/api/v1/users/google-drive-token', {
                  authCode: response.code
                });
                
                toast({
                  title: "구글 드라이브 연동 완료",
                  description: "이제 드라이브의 문서를 게시판에 가져올 수 있습니다.",
                  duration: 5000
                });
              } catch (error) {
                console.error('드라이브 토큰 저장 실패:', error);
              }
            }
          },
        });
        
        // 권한 요청 시작
        client.requestCode();
      }
    } catch (error) {
      console.error('Drive permission request failed:', error);
      // 드라이브 권한 실패는 치명적이지 않으므로 조용히 처리
    }
  };

  // 나머지 함수들 (handleSendOTP, handleVerifyOTP, handleResendOTP)은 동일...
  // 이메일로 OTP 전송
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const deviceInfo = getDeviceInfo();
      
      const response = await apiClient.post('/api/v1/users/login', {
        email,
        step: 'send-otp',
        deviceInfo
      });

      if (response.data.success) {
        setOtpSent(true);
        setStep('otp');
        setResendTimer(180); // 3분 타이머
        toast({
          title: "인증번호 발송",
          description: "이메일로 인증번호가 발송되었습니다.",
        });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || '인증번호 발송에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP 검증 및 로그인
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const deviceInfo = getDeviceInfo();
      
      const response = await apiClient.post('/api/v1/users/login', {
        email,
        otp,
        step: 'verify-otp',
        deviceInfo
      });

      if (response.data.success) {
        const { session, user } = response.data.data;
        
        // AuthContext의 login 함수 호출
        login(session, user);
        
        toast({
          title: "로그인 완료",
          description: "성공적으로 로그인되었습니다.",
        });
        
        // 원래 가려던 페이지로 리다이렉트
        const state = location.state as LocationState;
        const from = state?.from?.pathname || '/';
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      setError(error.response?.data?.message || '로그인에 실패했습니다.');
      
      // OTP 만료 또는 잘못된 OTP인 경우
      if (error.response?.status === 401) {
        setOtp('');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // OTP 재전송
  const handleResendOTP = async () => {
    if (resendTimer > 0) return;
    
    setError('');
    setIsLoading(true);

    try {
      const deviceInfo = getDeviceInfo();
      
      // 백엔드의 resend-otp 엔드포인트 호출
      const response = await apiClient.post('/api/v1/users/resend-otp', {
        email,
        deviceInfo,
        purpose: 'login' // 로그인 목적임을 명시
      });

      if (response.data.success) {
        // 재전송 성공 시 타이머 초기화 (3분)
        setResendTimer(180);
        // OTP 입력 필드 초기화
        setOtp('');
        
        // 성공 토스트 메시지 표시
        toast({
          title: "인증번호 재발송",
          description: "새로운 인증번호가 이메일로 발송되었습니다. 3분 내에 입력해주세요.",
          variant: 'default',
          duration: 5000 // 5초간 표시
        });
      }
    } catch (error: any) {
      console.error('OTP 재전송 오류:', error);
      
      // 에러 메시지 설정
      const errorMessage = error.response?.data?.message || '인증번호 재발송에 실패했습니다. 잠시 후 다시 시도해주세요.';
      setError(errorMessage);
      
      // 에러 토스트 메시지 표시
      toast({
        title: "인증번호 발송 실패",
        description: errorMessage,
        variant: 'destructive',
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Logo */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-primary">PeerMall</a>
          </div>
        </div>
      </header>

      {/* Login Form */}
      <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <h1 className="text-3xl font-bold text-primary">PeerMall</h1>
            </div>
            <CardTitle className="text-2xl font-bold text-center">
              {step === 'email' ? '로그인' : '인증번호 확인'}
            </CardTitle>
            <CardDescription className="text-center">
              {step === 'email' 
                ? '이메일 주소를 입력하거나 구글 계정으로 로그인하세요' 
                : '이메일로 전송된 인증번호를 입력하세요'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 'email' && (
              <>
                {/* 구글 로그인 버튼 */}
                <div className="mb-6">
                  <div 
                    id="google-signin-button" 
                    className="w-full flex justify-center"
                    style={{ minHeight: '44px' }}
                  >
                    {!googleLoaded && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        className="w-full"
                        disabled
                      >
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        구글 로그인 로딩 중...
                      </Button>
                    )}
                  </div>
                </div>

                {/* 구분선 */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      또는 이메일로 로그인
                    </span>
                  </div>
                </div>
              </>
            )}

            {step === 'email' ? (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !email}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      처리 중...
                    </>
                  ) : (
                    '인증번호 받기'
                  )}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">인증번호</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="otp"
                      type="text"
                      placeholder="6자리 인증번호"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="pl-10"
                      maxLength={6}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      확인 중...
                    </>
                  ) : (
                    '로그인'
                  )}
                </Button>

                <div className="text-center">
                  <div className="flex flex-col items-center space-y-2">
                    <Button
                      type="button"
                      variant={resendTimer > 0 ? 'outline' : 'link'}
                      size="sm"
                      onClick={handleResendOTP}
                      disabled={resendTimer > 0 || isLoading}
                      className={`text-sm ${resendTimer > 0 ? 'text-muted-foreground' : 'text-primary'}`}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          처리 중...
                        </>
                      ) : resendTimer > 0 ? (
                        `재전송 가능 (${Math.floor(resendTimer / 60)}:${(resendTimer % 60).toString().padStart(2, '0')})`
                      ) : (
                        '인증번호 재전송'
                      )}
                    </Button>
                    {resendTimer > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {Math.ceil(resendTimer / 60)}분 후에 재발송이 가능합니다
                      </p>
                    )}
                  </div>
                </div>
              </form>
            )}
          </CardContent>

          <CardFooter>
            <div className="text-sm text-center w-full text-muted-foreground">
              {step === 'email' ? (
                <>
                  처음이신가요? 이메일을 입력하거나 구글 로그인하면 자동으로 계정이 생성됩니다.
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => {
                      setStep('email');
                      setOtp('');
                      setError('');
                    }}
                    className="text-sm p-0"
                  >
                    뒤로가기
                  </Button>
                </>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;