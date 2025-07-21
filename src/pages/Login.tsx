// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, KeyRound, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import apiClient from '@/lib/api/clients';

interface LocationState {
  from?: Location;
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

  // 이메일로 OTP 전송
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 테스트용 이메일인 경우 하드코딩된 OTP 사용
      if (email === 'peermall@example.com') {
        setOtpSent(true);
        setStep('otp');
        setResendTimer(180); // 3분 타이머
        toast({
          title: "인증번호 발송",
          description: "테스트용 인증번호가 발급되었습니다. (123456)",
        });
        setIsLoading(false);
        return;
      }

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
      // 테스트용 이메일인 경우 하드코딩된 OTP 검증
      if (email === 'peermall@example.com') {
        if (otp === '123456') {
          // 테스트용 사용자 데이터
          const testUser = {
            uid: 'test-user-id',
            email: 'peermall@example.com',
            name: '피어몰 관리자',
            phone: '010-1234-5678',
            profile_image: '',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };

          const testSession = {
            session_id: 'test-session-id',
            csrf_token: 'test-csrf-token',
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24시간 후
          };

          // AuthContext의 login 함수 호출
          login(testSession, testUser);
          
          // 원래 가려던 페이지로 리다이렉트
          const state = location.state as LocationState;
          const from = state?.from?.pathname || '/';
          navigate(from, { replace: true });
          setIsLoading(false);
          return;
        } else {
          setError('올바르지 않은 인증번호입니다.');
          setOtp('');
          setIsLoading(false);
          return;
        }
      }

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
              ? '이메일 주소를 입력하여 시작하세요' 
              : '이메일로 전송된 인증번호를 입력하세요'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
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
                처음이신가요? 이메일을 입력하면 자동으로 계정이 생성됩니다.
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