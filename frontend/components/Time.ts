"use client"

import { useEffect, useState } from "react";

export const TRAVEL_DATE = new Date("2026-05-01T00:00:00");

export interface DDay {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Times {
  kst: string;
  ict: string;
}

export function useDDay(): DDay {
  const [diff, setDiff] = useState<DDay>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const ms = TRAVEL_DATE.getTime() - now.getTime();
      if (ms <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setDiff({
        days: Math.floor(ms / 86400000),
        hours: Math.floor((ms % 86400000) / 3600000),
        minutes: Math.floor((ms % 3600000) / 60000),
        seconds: Math.floor((ms % 60000) / 1000),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return diff;
}

export function useTimes(): Times {
  const [times, setTimes] = useState<Times>({ kst: "--:--:--", ict: "--:--:--" });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTimes({
        kst: now.toLocaleTimeString("ko-KR", {
          timeZone: "Asia/Seoul",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
        ict: now.toLocaleTimeString("ko-KR", {
          timeZone: "Asia/Bangkok",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return times;
}
