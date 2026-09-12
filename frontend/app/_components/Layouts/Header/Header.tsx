"use client"

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useTrip } from "@/app/contexts/TripContext";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { LinkPreset } from "../../Components/LinkPreset";
import Dropdown from "./Dropdown";
import { fetchMyTrips } from "@/app/api/trips";
import { COUNTRIES } from "@/app/trips/data/constants";
import type { Trip } from "@/app/trips/types";
import HomeButton from "./HomeButton";
import TimeWidget from "./TimeWidget";
export default function Header() {
    const { data: session } = useSession();
    const userId = (session?.user as { id?: string })?.id ?? "";
    const isLoggedIn = !!session;

    const { currentTrip, setCurrentTrip } = useTrip();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const countryInfo = COUNTRIES.find((c) => c.value === currentTrip?.country);


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
    const onDropdownClose = () => setDropdownOpen(false);

    const handleSelectTrip = (trip: Trip) => {
        setCurrentTrip(trip);
        setDropdownOpen(false);
    };

    console.log("isLoggedIn", isLoggedIn)

    return (
        <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* 로고 */}
                <HomeButton />

                {/* 시간 위젯 */}
                <TimeWidget currentTrip={currentTrip} />

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
                            <Dropdown
                                trips={trips}
                                currentTrip={currentTrip}
                                onSelectTrip={handleSelectTrip}
                                onClose={onDropdownClose}
                            />
                        )}
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <LinkPreset
                            href="/auth/login"
                            mode="light"
                        >
                            로그인
                        </LinkPreset>
                    </div>
                )}
            </div>
        </header>
    )
}
