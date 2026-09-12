"use client";

import { useMemo } from "react";
import { useTripTimer } from "@/components/Time";
import GradBox from "./GradBox";
import dayjs from "dayjs";
import type { Trip } from "@/app/trips/types";

const PHASE_CONFIG = {
  before: { labelSuffix: " 출발까지" },
  during: { labelSuffix: " 도착한지" },
  after: { labelSuffix: " 다녀온지" },
};

type Props = {
  currentTrip: Trip | null;
  destShortLabel: string;
  timeDiffLabel: string;
};

export default function TripTimerCard({ currentTrip, destShortLabel, timeDiffLabel }: Props) {
  const startDate = useMemo(
    () => (currentTrip?.start_date ? new Date(`${currentTrip.start_date}T00:00:00`) : undefined),
    [currentTrip]
  );
  const endDate = useMemo(
    () => (currentTrip?.end_date ? new Date(`${currentTrip.end_date}T00:00:00`) : undefined),
    [currentTrip]
  );

  const timer = useTripTimer(startDate, endDate);

  const phaseConfig = PHASE_CONFIG[timer.phase];

  const timerLabel =
    timer.phase === "before"
      ? `${destShortLabel}${phaseConfig.labelSuffix}`
      : `${currentTrip?.country ?? destShortLabel}${phaseConfig.labelSuffix}`;

  const badgeText = timer.phase === "before" ? `D-${timer.days}` : `D+${timer.days}`;

  const footerLabel = (() => {
    if (!currentTrip) return "";
    if (timer.phase === "before") {
      const date = currentTrip.start_date
        ? dayjs(currentTrip.start_date).format("YYYY년 M월 D일")
        : "";
      return date ? `${date} 출발 기준` : "";
    }
    if (timer.phase === "during") {
      const date = currentTrip.start_date
        ? dayjs(currentTrip.start_date).format("YYYY년 M월 D일")
        : "";
      return date ? `${date} 도착 기준` : "";
    }
    const date = currentTrip.end_date
      ? dayjs(currentTrip.end_date).format("YYYY년 M월 D일")
      : "";
    return date ? `${date} 귀국 기준` : "";
  })();

  const timerValues =
    timer.phase === "after"
      ? [{ val: timer.days, label: "일" }]
      : [
        { val: timer.days, label: "일" },
        { val: timer.hours, label: "시" },
        { val: timer.minutes, label: "분" },
        { val: timer.seconds, label: "초" },
      ];

  return (
    <div className="flex flex-col gap-4">
      <GradBox direction="br" className="rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-medium">{timerLabel}</p>
          {currentTrip && (
            <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">
              {badgeText}
            </span>
          )}
        </div>
        {currentTrip ? (
          <div className={`grid gap-3 ${timerValues.length === 1 ? "grid-cols-1" : "grid-cols-4"}`}>
            {timerValues.map(({ val, label }) => (
              <div key={label} className="bg-white/15 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold font-mono leading-none">
                  {String(val).padStart(2, "0")}
                </p>
                <p className="text-blue-200 text-xs mt-1.5">{label}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/15 rounded-xl p-5 text-center">
            <p className="text-white/80 text-sm">여행을 등록하고 D-Day를 확인하세요</p>
          </div>
        )}
        {footerLabel && <p className="text-blue-200 text-xs mt-4">{footerLabel}</p>}
      </GradBox>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-400 text-xs mb-1">출발 → 목적지</p>
          <p className="font-bold text-slate-800 text-sm">인천 → {destShortLabel}</p>
          <p className="text-blue-500 text-xs mt-2 font-medium">🛫 ICN</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-400 text-xs mb-1">시차</p>
          <p className="font-bold text-slate-800 text-sm">{timeDiffLabel}</p>
          <p className="text-amber-500 text-xs mt-2 font-medium">🕐 KST 기준</p>
        </div>
      </div>
    </div>
  );
}
