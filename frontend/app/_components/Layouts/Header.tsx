"use client"

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import { useTimes } from "@/components/Time";
import { LinkPreset } from "../Components/LinkPreset";
import { useTrip } from "@/app/contexts/TripContext";
import { fetchMyTrips } from "@/app/api/trips";
import { COUNTRIES } from "@/app/trips/data/constants";
import type { Trip } from "@/app/trips/types";

export default function Header() {
    const { data: session } = useSession();
    const userId = (session?.user as { id?: string })?.id ?? "";
    const isLoggedIn = !!session;

    const { currentTrip, setCurrentTrip } = useTrip();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const countryInfo = COUNTRIES.find((c) => c.value === currentTrip?.country);
    const destTimezone = countryInfo?.timezone ?? "Asia/Bangkok";
    const destLabel = currentTrip
        ? (currentTrip.city ? `${currentTrip.city}, ${currentTrip.country}` : currentTrip.country)
        : "치앙마이";

    const times = useTimes(destTimezone);

    const { data: trips = [] } = useQuery({
        queryKey: ["trips", userId],
        queryFn: () => fetchMyTrips(userId),
        enabled: !!userId,
    });

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const onDropdownToggle = () => setDropdownOpen((prev) => !prev);

    const handleSelectTrip = (trip: Trip) => {
        setCurrentTrip(trip);
        setDropdownOpen(false);
    };

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* 로고 */}
                <Link href="/" className="flex items-center gap-2.5">
                    <img src="/icons/logo_primary.svg" alt="logo" className="w-8 h-8" />
                    <span className="font-bold text-slate-800 text-base">떠나세연</span>
                </Link>

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
                        <span className="text-slate-400 text-xs">{destLabel}</span>
                        <span className="font-mono font-semibold text-slate-700 text-sm">{times.dest}</span>
                    </div>
                </div>

                {/* 우측: 로그인 전 → 버튼 / 로그인 후 → 여행 선택 드롭다운 */}
                {isLoggedIn ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={onDropdownToggle}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-lighter hover:bg-blue-100 transition-colors"
                        >
                            <FlightTakeoffIcon sx={{ fontSize: 16 }} className="text-primary shrink-0" />
                            <span className="text-sm font-medium text-foreground max-w-36 truncate">
                                {currentTrip?.name ?? "여행 선택"}
                            </span>
                            <ExpandMoreIcon
                                sx={{ fontSize: 16 }}
                                className={`text-text-secondary shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-border rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
                                {trips.length === 0 ? (
                                    <p className="px-3 py-2 text-xs text-text-secondary">참여한 여행이 없어요</p>
                                ) : (
                                    trips.map((trip) => (
                                        <button
                                            key={trip.id}
                                            onClick={() => handleSelectTrip(trip)}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-lighter transition-colors flex items-center justify-between gap-2"
                                        >
                                            <span className="truncate">{trip.name}</span>
                                            {currentTrip?.id === trip.id && (
                                                <CheckIcon sx={{ fontSize: 14 }} className="text-primary shrink-0" />
                                            )}
                                        </button>
                                    ))
                                )}
                                <div className="border-t border-border">
                                    <Link
                                        href="/trips"
                                        onClick={() => setDropdownOpen(false)}
                                        className="block px-3 py-2 text-sm text-primary hover:bg-lighter transition-colors font-medium"
                                    >
                                        여행 관리 →
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/auth/login"
                            className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                        >
                            로그인
                        </Link>
                        <LinkPreset href="/auth/register">
                            시작하기
                        </LinkPreset>
                    </div>
                )}
            </div>
        </header>
    )
}
