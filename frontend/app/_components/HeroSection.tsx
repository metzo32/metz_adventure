"use client";

import Link from "next/link";
import { useDDay } from "@/components/Time";
import GradBox from "./GradBox";

export default function HeroSection() {
  const dday = useDDay();

  return (
    <section className="max-w-6xl mx-auto px-6 pt-14 pb-10">
      <div className="grid lg:grid-cols-2 gap-10 items-center">
        {/* 카피 */}
        <div>
          <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 border border-blue-100">
            🌏 2026년 5월 · 치앙마이 여행
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-4">
            나만의<br />
            <span className="text-primary">치앙마이 여행</span>을<br />
            스마트하게
          </h1>
          <p className="text-slate-500 text-base mb-8 leading-relaxed">
            계획부터 현지 기록까지, 여행의 모든 순간을 한 곳에서 관리하세요.
            <br />위시리스트, 투두, 일기, 예산을 깔끔하게.
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/auth/register"
              className="bg-primary hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-all shadow-sm hover:shadow-md"
            >
              무료로 시작하기 →
            </Link>
            <Link
              href="/auth/login"
              className="text-slate-600 hover:text-slate-900 px-6 py-3 rounded-xl font-semibold text-sm border border-slate-200 hover:border-slate-300 transition-all bg-white"
            >
              로그인
            </Link>
          </div>
        </div>

        {/* D-Day 카드 */}
        <div className="flex flex-col gap-4">
          <GradBox direction="br" className="rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-medium">치앙마이까지</p>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-bold">
                D-{dday.days}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { val: dday.days, label: "일" },
                { val: dday.hours, label: "시" },
                { val: dday.minutes, label: "분" },
                { val: dday.seconds, label: "초" },
              ].map(({ val, label }) => (
                <div key={label} className="bg-white/15 rounded-xl p-3 text-center">
                  <p className="text-2xl font-bold font-mono leading-none">
                    {String(val).padStart(2, "0")}
                  </p>
                  <p className="text-blue-200 text-xs mt-1.5">{label}</p>
                </div>
              ))}
            </div>
            <p className="text-blue-200 text-xs mt-4">2026년 5월 1일 출발 기준</p>
          </GradBox>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-slate-400 text-xs mb-1">출발 → 목적지</p>
              <p className="font-bold text-slate-800 text-sm">인천 → 치앙마이</p>
              <p className="text-blue-500 text-xs mt-2 font-medium">🛫 ICN → CNX</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
              <p className="text-slate-400 text-xs mb-1">시간대 차이</p>
              <p className="font-bold text-slate-800 text-sm">−2시간</p>
              <p className="text-amber-500 text-xs mt-2 font-medium">🕐 KST → ICT</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
