import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { Mail, Lock, Loader2 } from 'lucide-react';
import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:9393';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // WebGL 정보 가져오기
  const getWebGLVendor = (): string => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl && gl instanceof WebGLRenderingContext) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          // 상수 값 직접 사용
          const UNMASKED_VENDOR_WEBGL = 0x9245;
          return gl.getParameter(UNMASKED_VENDOR_WEBGL) as string || 'unknown';
        }
      }
    } catch (e) {
      console.error('WebGL vendor detection failed:', e);
    }
    return 'unknown';
  };

  const getWebGLRenderer = (): string => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      
      if (gl && gl instanceof WebGLRenderingContext) {
        const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          // 상수 값 직접 사용
          const UNMASKED_RENDERER_WEBGL = 0x9246;
          return gl.getParameter(UNMASKED_RENDERER_WEBGL) as string || 'unknown';
        }
      }
    } catch (e) {
      console.error('WebGL renderer detection failed:', e);
    }
    return 'unknown';
  };

  // 디바이스 정보 수집 함수
  const getDeviceInfo = () => {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform || 'unknown',
      webglVendor: getWebGLVendor(),
      webglRenderer: getWebGLRenderer(),
    };
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: '이메일 필요',
        description: '이메일 주소를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Sending OTP request to:', `${API_BASE_URL}/api/v1/users/login`);
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/login`,
        {
          email,
          step: 'send-otp',
          deviceInfo: getDeviceInfo(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('OTP Response:', response.data);

      if (response.data.success) {
        setStep('otp');
        toast({
          title: 'OTP 발급 완료',
          description: response.data.message || '인증 코드가 이메일로 발송되었습니다.',
        });
      }
    } catch (error) {
      console.error('OTP Request Error:', error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const errorMessage = error.response.data?.message || '서버 오류가 발생했습니다.';
          const errorCode = error.response.data?.code;
          
          toast({
            title: '오류',
            description: errorMessage,
            variant: 'destructive',
          });

          if (error.response.status === 429 || errorCode === 'RATE_LIMIT_EXCEEDED') {
            const retryAfter = error.response.data?.retryAfter || 60;
            toast({
              title: '요청 제한',
              description: `${retryAfter}초 후에 다시 시도해주세요.`,
              variant: 'destructive',
            });
          }
        } else if (error.request) {
          toast({
            title: '네트워크 오류',
            description: '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: '오류',
            description: '요청 처리 중 오류가 발생했습니다.',
            variant: 'destructive',
          });
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      toast({
        title: '인증번호 오류',
        description: '6자리 인증번호를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      console.log('Verifying OTP...');
      
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/login`,
        {
          email,
          otpCode: otp,
          step: 'verify-otp',
          deviceInfo: getDeviceInfo(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      console.log('Login Response:', response.data);

      if (response.data.success) {
        if (response.data.session?.csrfToken) {
          localStorage.setItem('csrfToken', response.data.session.csrfToken);
        }

        toast({
          title: '로그인 성공',
          description: response.data.message || '환영합니다!',
        });
        
        navigate('/');
      }
    } catch (error) {
      console.error('Login Error:', error);
      
      if (axios.isAxiosError(error) && error.response) {
        const errorMessage = error.response.data?.message || '인증에 실패했습니다.';
        const errorCode = error.response.data?.code;
        
        toast({
          title: '인증 실패',
          description: errorMessage,
          variant: 'destructive',
        });

        if (errorCode === 'OTP_EXPIRED') {
          setStep('email');
          setOtp('');
        } else if (errorCode === 'ACCOUNT_LOCKED') {
          const lockedUntil = error.response.data?.lockedUntil;
          if (lockedUntil) {
            const lockTime = new Date(lockedUntil).toLocaleTimeString();
            toast({
              title: '계정 잠금',
              description: `계정이 ${lockTime}까지 잠겼습니다.`,
              variant: 'destructive',
            });
          }
        }
      } else {
        toast({
          title: '로그인 실패',
          description: '네트워크 오류가 발생했습니다.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // OTP 재발송 - 수정된 버전
  const handleResendOtp = async () => {
    setOtp('');
    // FormEvent 생성 대신 직접 함수 호출
    if (!email) {
      toast({
        title: '이메일 필요',
        description: '이메일 주소를 입력해주세요.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/login`,
        {
          email,
          step: 'send-otp',
          deviceInfo: getDeviceInfo(),
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast({
          title: 'OTP 재발급 완료',
          description: '새로운 인증 코드가 이메일로 발송되었습니다.',
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        toast({
          title: '재발송 실패',
          description: error.response.data?.message || 'OTP 재발송에 실패했습니다.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-xl border border-indigo-200 transition-all duration-300 hover:shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-3xl font-bold">
            P
          </div>
          <CardTitle className="text-3xl font-bold text-primary">피어몰 로그인</CardTitle>
          <CardDescription className="text-muted-foreground">
            {step === 'email' ? '이메일을 입력하고 OTP를 요청하세요' : '이메일로 전송된 인증번호를 입력하세요'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'email' ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>이메일 주소</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="peermall@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90 transition-colors" 
                disabled={loading || !email}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                {loading ? 'OTP 요청 중...' : 'OTP 발급 요청'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="otp" className="flex items-center space-x-2">
                    <Lock className="w-4 h-4 text-primary" />
                    <span>인증번호 (OTP)</span>
                  </Label>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="text-sm text-primary hover:underline"
                    disabled={loading}
                  >
                    재발송
                  </button>
                </div>
                <Input
                  id="otp"
                  type="text"
                  placeholder="6자리 숫자"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={loading}
                  maxLength={6}
                  className="transition-all duration-200 focus:ring-2 focus:ring-primary text-center text-lg tracking-widest font-mono"
                />
                <p className="text-xs text-muted-foreground">
                  인증번호는 3분간 유효합니다
                </p>
              </div>
              <div className="flex space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBackToEmail}
                  disabled={loading}
                  className="flex-1 hover:bg-accent/10 transition-colors"
                >
                  뒤로
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-primary hover:bg-primary/90 transition-colors" 
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {loading ? '로그인 중...' : '로그인'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter className="text-center text-sm text-muted-foreground">
          보안 강화된 OTP 로그인
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
