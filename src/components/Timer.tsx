import { useEffect, useRef, useState } from 'react';

interface TimerProps {
  running: boolean;
  onStop: (ms: number) => void;
  reset: boolean;
}

export default function Timer({ running, onStop, reset }: TimerProps) {
  const [ms, setMs] = useState(0);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reset) {
      setMs(0);
      startRef.current = null;
    }
  }, [reset]);

  useEffect(() => {
    if (running) {
      startRef.current = performance.now() - ms;
      const tick = () => {
        setMs(performance.now() - (startRef.current ?? 0));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (startRef.current !== null && ms > 0) {
        onStop(ms);
      }
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [running]);

  const formatTime = (ms: number) => {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const centis = Math.floor((ms % 1000) / 10);
    return `${min > 0 ? min + ':' : ''}${String(sec).padStart(2, '0')}.${String(centis).padStart(2, '0')}`;
  };

  return (
    <div className={`timer ${running ? 'timer-running' : ''}`}>
      {formatTime(ms)}
    </div>
  );
}
