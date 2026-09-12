"use client";

import { useSession } from "next-auth/react";
import { useTrip } from "@/app/contexts/TripContext";
import TripTimerCard from "./TripTimerCard";
import { LinkPreset } from "./LinkPreset";
import { getTimeDiffFromKst } from "@/components/Time";
import { COUNTRIES } from "@/app/trips/data/constants";

export default function HeroSection() {
  const { currentTrip } = useTrip();
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const countryInfo = COUNTRIES.find((c) => c.value === currentTrip?.country);
  const destTimezone = countryInfo?.timezone ?? "Asia/Bangkok";
  const timeDiff = currentTrip ? getTimeDiffFromKst(destTimezone) : 0;

  const destShortLabel = currentTrip
    ? currentTrip.city
      ? `${currentTrip.city}, ${currentTrip.country}`
      : currentTrip.country
    : "온세상";

  const tripTitle =
    currentTrip
      ? currentTrip.city
        ? `${currentTrip.city} 여행`
        : `${currentTrip.country} 여행`
      : "온세상 여행";

  const timeDiffLabel = !currentTrip
    ? "0시간"
    : timeDiff === 0
      ? "시차 없음"
      : `${timeDiff > 0 ? "+" : ""}${timeDiff}시간`;

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 pb-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
            다가오는<br />
            <span className="text-primary">{tripTitle}</span>을<br />
            야물딱지게
          </h1>
          <p className="text-slate-500 text-base mb-8 leading-relaxed">
            계획부터 현지 기록까지, 여행의 모든 순간을 한 곳에서 관리하세요.
            <br />위시리스트, 투두, 일기, 예산을 깔끔하게.
          </p>
          <div className="flex items-center gap-3">
            <LinkPreset href="/wishlist">
              무료로 시작하기 →
            </LinkPreset>
          </div>
        </div>

        <TripTimerCard
          currentTrip={currentTrip}
          destShortLabel={destShortLabel}
          timeDiffLabel={timeDiffLabel}
        />
      </div>
    </section>
  );
}
