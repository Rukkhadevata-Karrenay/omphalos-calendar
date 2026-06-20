import { useEffect, useState } from 'react';

type CurrentTimeWindowTarget = {
  setInterval: (callback: () => void, delay: number) => number;
  clearInterval: (timer: number) => void;
  addEventListener: (type: 'focus', listener: () => void) => void;
  removeEventListener: (type: 'focus', listener: () => void) => void;
};

type CurrentTimeDocumentTarget = {
  hidden: boolean;
  addEventListener: (type: 'visibilitychange', listener: () => void) => void;
  removeEventListener: (type: 'visibilitychange', listener: () => void) => void;
};

type CurrentTimeSyncOptions = {
  onTick: (date: Date) => void;
  getNow?: () => Date;
  windowTarget?: CurrentTimeWindowTarget;
  documentTarget?: CurrentTimeDocumentTarget;
};

export const startCurrentTimeSync = ({
  onTick,
  getNow = () => new Date(),
  windowTarget = window,
  documentTarget = document,
}: CurrentTimeSyncOptions): (() => void) => {
  const tick = () => onTick(getNow());
  const handleVisibilityChange = () => {
    if (!documentTarget.hidden) {
      tick();
    }
  };

  tick();
  const timer = windowTarget.setInterval(tick, 1000);
  documentTarget.addEventListener('visibilitychange', handleVisibilityChange);
  windowTarget.addEventListener('focus', tick);

  return () => {
    windowTarget.clearInterval(timer);
    documentTarget.removeEventListener('visibilitychange', handleVisibilityChange);
    windowTarget.removeEventListener('focus', tick);
  };
};

export const useCurrentTime = (): Date => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => startCurrentTimeSync({ onTick: setNow }), []);

  return now;
};
