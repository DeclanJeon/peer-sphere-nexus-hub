import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'username' | 'otp'>('username');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUsernameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'peermall') {
      setStep('otp');
      // Auto-generate OTP for demo
      const generatedOtp = '123456';
      localStorage.setItem('temp_otp', generatedOtp);
      toast({
        title: 'OTP 발급 완료',
        description: `인증번호가 발급되었습니다: ${generatedOtp}`,
      });
    } else {
      toast({
        title: '로그인 실패',
        description: 'peermall을 입력해주세요.',
        variant: 'destructive',
      });
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const storedOtp = localStorage.getItem('temp_otp');
    if (otp === storedOtp) {
      localStorage.setItem('peermall_token', 'authenticated');
      localStorage.removeItem('temp_otp');
      toast({
        title: '로그인 성공',
        description: '피어몰에 오신 것을 환영합니다!',
      });
      navigate('/dashboard');
    } else {
      toast({
        title: '인증 실패',
        description: '올바른 인증번호를 입력해주세요.',
        variant: 'destructive',
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-primary">피어몰</CardTitle>
          <CardDescription>
            {step === 'username' ? '사용자명을 입력해주세요' : '인증번호를 입력해주세요'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 'username' ? (
            <form onSubmit={handleUsernameSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">사용자명</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="peermall"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                OTP 발급
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">인증번호</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('username')}
                  className="flex-1"
                >
                  뒤로
                </Button>
                <Button type="submit" className="flex-1" disabled={loading}>
                  {loading ? '로그인 중...' : '로그인'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;