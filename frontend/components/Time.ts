"use client"

import { useEffect, useState } from "react";

export const DEFAULT_TRAVEL_DATE = new Date("2026-05-01T00:00:00");

export interface DDay {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Times {
  kst: string;
  dest: string;
}

export type TripPhase = "before" | "during" | "after";

export interface TripTimer {
  phase: TripPhase;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const msToHMS = (ms: number) => ({
  days: Math.floor(ms / 86400000),
  hours: Math.floor((ms % 86400000) / 3600000),
  minutes: Math.floor((ms % 3600000) / 60000),
  seconds: Math.floor((ms % 60000) / 1000),
});

/** UTC 기준 오프셋(시간) 반환 */
export const getUtcOffsetHours = (timezone: string): number => {
  const now = new Date();
  const destMs = new Date(now.toLocaleString("en-US", { timeZone: timezone })).getTime();
  const utcMs = new Date(now.toLocaleString("en-US", { timeZone: "UTC" })).getTime();
  return Math.round((destMs - utcMs) / 3600000);
};

/** KST 기준 목적지 시차(시간) 반환. 예: -2, +1 */
export const getTimeDiffFromKst = (destTimezone: string): number => {
  return getUtcOffsetHours(destTimezone) - 9;
};

/**
 * 3단계 여행 타이머
 * - before : 출발일 전 → 출발일까지 카운트다운
 * - during : 출발일 ~ 도착일 → 출발일부터 카운트업
 * - after  : 도착일 이후 → 도착일부터 카운트업
 */
export function useTripTimer(startDate?: Date, endDate?: Date): TripTimer {
  const [timer, setTimer] = useState<TripTimer>({ phase: "before", days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const target = startDate ?? DEFAULT_TRAVEL_DATE;

      if (now < target) {
        // 출발 전: 카운트다운
        const ms = target.getTime() - now.getTime();
        setTimer({ phase: "before", ...msToHMS(ms) });
      } else if (!endDate || now <= endDate) {
        // 여행 중: 출발일부터 카운트업
        const ms = now.getTime() - target.getTime();
        setTimer({ phase: "during", ...msToHMS(ms) });
      } else {
        // 여행 후: 도착일부터 카운트업
        const ms = now.getTime() - endDate.getTime();
        setTimer({ phase: "after", ...msToHMS(ms) });
      }
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startDate, endDate]);

  return timer;
}

export function useDDay(targetDate: Date = DEFAULT_TRAVEL_DATE): DDay {
  const [diff, setDiff] = useState<DDay>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const ms = targetDate.getTime() - now.getTime();
      if (ms <= 0) {
        setDiff({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setDiff(msToHMS(ms));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return diff;
}

export function useTimes(destTimezone = "Asia/Bangkok"): Times {
  const [times, setTimes] = useState<Times>({ kst: "--:--:--", dest: "--:--:--" });

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
        dest: now.toLocaleTimeString("ko-KR", {
          timeZone: destTimezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      });
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [destTimezone]);

  return times;
}
