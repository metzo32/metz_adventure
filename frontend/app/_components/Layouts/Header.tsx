"use client"

import Link from "next/link";
import { useTimes } from "@/components/Time";
import LinkPreset from "../LinkPreset";

export default function Header() {
    const times = useTimes();

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* 로고 */}
                <div className="flex items-center gap-2.5">
                    <img src="/icons/logo_primary.svg" alt="logo" className="w-8 h-8" />
                    <span className="font-bold text-slate-800 text-base">떠나세연</span>
                </div>

                {/* 시간 위젯 */}
                <div className="hidden md:flex items-center gap-5">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                        <span className="text-slate-400 text-xs">KST</span>
                        <span className="font-mono font-semibold text-slate-700 text-sm">{times.kst}</span>
                    </div>
                    <div className="w-px h-4 bg-slate-200" />
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        <span className="text-slate-400 text-xs">치앙마이</span>
                        <span className="font-mono font-semibold text-slate-700 text-sm">{times.ict}</span>
                    </div>
                </div>

                {/* CTA 버튼 */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/auth/login"
                        className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                        로그인
                    </Link>
                    <LinkPreset
                        href="/auth/register"
                    >
                        시작하기
                    </LinkPreset>
                </div>
            </div>
        </header>
    )
}
