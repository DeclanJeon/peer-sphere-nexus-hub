// src/pages/Login.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Mail, KeyRound, AlertCircle } from 'lucide-react';
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
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [rateLimitRetryAfter, setRateLimitRetryAfter] = useState<number | null>(null);
  
  // 계정 잠금 관련 state 추가
  const [accountLocked, setAccountLocked] = useState<{
    isLocked: boolean;
    remainingMinutes: number;
    unlockTime: string;
  } | null>(null);

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      const state = location.state as LocationState | null;
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

  // Rate limit 타이머
  useEffect(() => {
    if (rateLimitRetryAfter && rateLimitRetryAfter > 0) {
      const timer = setTimeout(() => {
        setRateLimitRetryAfter(prev => prev ? prev - 1 : null);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (rateLimitRetryAfter === 0) {
      setRateLimitRetryAfter(null);
      setError('');
    }
  }, [rateLimitRetryAfter]);

  // 계정 잠금 타이머
  useEffect(() => {
    if (accountLocked && accountLocked.remainingMinutes > 0) {
      const timer = setInterval(() => {
        const now = new Date();
        const unlockTime = new Date(accountLocked.unlockTime);
        const remainingMs = unlockTime.getTime() - now.getTime();
        
        if (remainingMs <= 0) {
          setAccountLocked(null);
          setError('');
        } else {
          const remainingMinutes = Math.ceil(remainingMs / (1000 * 60));
          setAccountLocked(prev => prev ? { ...prev, remainingMinutes } : null);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [accountLocked]);

  // 디바이스 정보 수집
  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent;
    const platform = navigator.platform;
    const language = navigator.language;
    
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
    setRemainingAttempts(null);
    setAccountLocked(null);

    try {
      // 테스트용 이메일인 경우
      if (email === 'peermall@example.com') {
        setOtpSent(true);
        setStep('otp');
        setResendTimer(180);
        setRemainingAttempts(5); // 기본 시도 횟수
        toast({
          title: "인증번호 발송",
          description: "테스트용 인증번호가 발급되었습니다. (123456)",
        });
        setIsLoading(false);
        return;
      }

      const deviceInfo = getDeviceInfo();
      
      const response = await apiClient.post('/users/login', {
        email,
        step: 'send-otp',
        deviceInfo
      });

      if (response.data.success) {
        setOtpSent(true);
        setStep('otp');
        setResendTimer(180);
        setRemainingAttempts(5); // 기본 시도 횟수
        toast({
          title: "인증번호 발송",
          description: "이메일로 인증번호가 발송되었습니다.",
        });
      }
    } catch (error: any) {
      console.error('OTP 발송 오류:', error);
      
      // 계정 잠금 에러 처리
      if (error.response?.status === 423) {
        const data = error.response.data;
        setAccountLocked({
          isLocked: true,
          remainingMinutes: data.remainingMinutes,
          unlockTime: data.unlockTime,
        });
        setError(data.message);
      }
      // Rate limit 에러 처리
      else if (error.response?.status === 429) {
        const retryAfter = error.response.data.retryAfter || 60;
        setRateLimitRetryAfter(retryAfter);
        setError(`너무 많은 요청입니다. ${retryAfter}초 후에 다시 시도해주세요.`);
      } else {
        setError(error.response?.data?.message || '인증번호 발송에 실패했습니다.');
      }
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
      
      const response = await apiClient.post('/users/login', {
        email,
        otp,
        step: 'verify-otp',
        deviceInfo
      });

      if (response.data.success) {
        const { session, user, isNewUser } = response.data.data;
        
        login(session, user);

        toast({
          title: "로그인 완료",
          description: "성공적으로 로그인되었습니다.",
        });

        // 신규 사용자인 경우 스폰서 선택 다이얼로그 표시
        if (isNewUser) {
          // AuthContext에서 스폰서 선택 다이얼로그를 표시하도록 상태 업데이트
          // 이 로직은 AuthContext에서 처리되므로 추가 작업 없음
        } else {
          // 기존 사용자는 바로 피어몰 페이지로 이동
          navigate(`/home/${response.data.data.peermall.url}`);
        }
      }
    } catch (error: any) {
      console.error('OTP 검증 오류:', error);
      
      // Rate limit 에러 처리
      if (error.response?.status === 429) {
        const retryAfter = error.response.data.retryAfter || 60;
        setRateLimitRetryAfter(retryAfter);
        setError(`너무 많은 시도입니다. ${retryAfter}초 후에 다시 시도해주세요.`);
        setOtp('');
      } 
      // OTP 검증 실패 처리
      else if (error.response?.data?.code === 'OTP_INVALID') {
        const remaining = error.response.data.remainingAttempts;
        setRemainingAttempts(remaining);
        setError(error.response.data.message);
        setOtp('');
        
        // 남은 시도 횟수가 적을 때 경고
        if (remaining <= 2) {
          toast({
            title: "주의",
            description: `남은 시도 횟수: ${remaining}번`,
            variant: 'destructive',
          });
        }
      }
      // OTP 만료 또는 기타 에러
      else {
        setError(error.response?.data?.message || '로그인에 실패했습니다.');
        if (error.response?.data?.code === 'OTP_EXPIRED' || 
            error.response?.data?.code === 'OTP_MAX_ATTEMPTS') {
          setOtp('');
          setRemainingAttempts(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  // OTP 재전송
  const handleResendOTP = async () => {
    setError('');
    setIsLoading(true);
    setRemainingAttempts(null);

    try {
      const deviceInfo = getDeviceInfo();
      
      const response = await apiClient.post('/users/login/resend-otp', {
        email,
        deviceInfo,
        purpose: 'login'
      });

      if (response.data.success) {
        setResendTimer(180);
        setOtp('');
        setRemainingAttempts(5); // 재전송 시 시도 횟수 초기화
        
        toast({
          title: "인증번호 재발송",
          description: "새로운 인증번호가 이메일로 발송되었습니다.",
          variant: 'default',
          duration: 5000
        });
      }
    } catch (error: any) {
      console.error('OTP 재전송 오류:', error);
      
      const errorMessage = error.response?.data?.message || '인증번호 재발송에 실패했습니다.';
      setError(errorMessage);
      
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
                ? '이메일 주소를 입력하세요' 
                : '이메일로 전송된 인증번호를 입력하세요'}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 계정 잠금 경고 */}
            {accountLocked && accountLocked.isLocked && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-1">
                    <p>계정이 일시적으로 잠겼습니다.</p>
                    <p className="font-semibold">
                      {accountLocked.remainingMinutes}분 후에 다시 시도해주세요.
                    </p>
                    <p className="text-xs">
                      잠금 해제 시간: {new Date(accountLocked.unlockTime).toLocaleTimeString('ko-KR')}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Rate limit 경고 */}
            {rateLimitRetryAfter && rateLimitRetryAfter > 0 && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  잠시 후 다시 시도해주세요. ({rateLimitRetryAfter}초 남음)
                </AlertDescription>
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
                      disabled={isLoading || rateLimitRetryAfter !== null || (accountLocked?.isLocked ?? false)}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || !email || rateLimitRetryAfter !== null || (accountLocked?.isLocked ?? false)}
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

                {/* 계정 잠금 시 추가 안내 */}
                {accountLocked?.isLocked && (
                  <div className="text-center text-sm text-muted-foreground mt-4">
                    <p>로그인 시도가 여러 번 실패하여 보안을 위해 계정이 일시적으로 잠겼습니다.</p>
                    <p>잠시 후 다시 시도해주세요.</p>
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="otp">인증번호</Label>
                    {remainingAttempts !== null && (
                      <span className={`text-sm ${remainingAttempts <= 2 ? 'text-destructive' : 'text-muted-foreground'}`}>
                        남은 시도: {remainingAttempts}번
                      </span>
                    )}
                  </div>
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
                      disabled={isLoading || rateLimitRetryAfter !== null}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || otp.length !== 6 || rateLimitRetryAfter !== null}
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
                    {resendTimer > 0 && (
                      <span className="text-sm text-muted-foreground">
                        인증번호 유효시간: {Math.floor(resendTimer / 60)}:{(resendTimer % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                    
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      onClick={handleResendOTP}
                      disabled={isLoading || rateLimitRetryAfter !== null}
                      className="text-sm text-primary"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          처리 중...
                        </>
                      ) : (
                        '인증번호 재전송'
                      )}
                    </Button>
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
                      setRemainingAttempts(null);
                      setRateLimitRetryAfter(null);
                      setAccountLocked(null);
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