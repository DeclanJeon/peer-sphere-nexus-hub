// src/hooks/useIdleTimer.ts
import { useEffect, useRef, useCallback } from 'react';

interface UseIdleTimerProps {
  timeout: number; // 밀리초 단위
  onIdle: () => void;
  enabled?: boolean;
}

export const useIdleTimer = ({
  timeout,
  onIdle,
  enabled = true,
}: UseIdleTimerProps) => {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const resetTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    if (enabled) {
      timeoutIdRef.current = setTimeout(() => {
        onIdle();
      }, timeout);
    }
  }, [timeout, onIdle, enabled]);

  useEffect(() => {
    if (!enabled) {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      return;
    }

    // 사용자 활동 감지 이벤트
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'focus',
    ];

    const handleActivity = () => {
      resetTimer();
    };

    // 이벤트 리스너 등록
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // 초기 타이머 시작
    resetTimer();

    // 클린업
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, [resetTimer, enabled]);

  return {
    lastActivity: lastActivityRef.current,
    resetTimer,
  };
};