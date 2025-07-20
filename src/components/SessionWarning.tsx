// src/components/SessionWarning.tsx
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth';
import { useIdleTimer } from '@/hooks/useIdleTimer';

export const SessionWarning = () => {
  const { isAuthenticated, logout } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [countdown, setCountdown] = useState(60); // 60초 카운트다운
  
  // 25분 후 경고 표시
  const { resetTimer } = useIdleTimer({
    timeout: 25 * 60 * 1000, // 25분
    onIdle: () => setShowWarning(true),
    enabled: isAuthenticated && !showWarning
  });

  // 카운트다운
  useEffect(() => {
    if (showWarning && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showWarning && countdown === 0) {
      handleTimeout();
    }
  }, [showWarning, countdown]);

  const handleTimeout = () => {
    setShowWarning(false);
    logout();
  };

  const handleContinue = () => {
    setShowWarning(false);
    setCountdown(60);
    resetTimer();
  };

  if (!isAuthenticated || !showWarning) return null;

  return (
    <AlertDialog open={showWarning}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>세션 만료 경고</AlertDialogTitle>
          <AlertDialogDescription>
            장시간 활동이 없어 {countdown}초 후 자동으로 로그아웃됩니다.
            계속 사용하시려면 '계속하기'를 클릭해주세요.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleTimeout}>
            로그아웃
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleContinue}>
            계속하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
