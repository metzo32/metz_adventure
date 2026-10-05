"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useTrip } from "@/app/contexts/TripContext";
import { fetchMyTrips } from "@/app/api/trips";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import type { Trip } from "@/app/trips/types";

type Props = {
    fullWidth?: boolean;
    isOpen?: boolean;
};

const DropDownTripListButton = ({ fullWidth = false, isOpen = true }: Props) => {
    const { data: session } = useSession();
    const userId = (session?.user as { id?: string })?.id ?? "";

    const { currentTrip, setCurrentTrip } = useTrip();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

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
    const handleSelectTrip = (trip: Trip) => () => {
        setCurrentTrip(trip);
        setDropdownOpen(false);
    };

    const buttonClassName = fullWidth
        ? "w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-lighter hover:bg-blue-100 transition-colors"
        : "flex items-center gap-2 px-3 py-2 rounded-lg bg-lighter hover:bg-blue-100 transition-colors";

    const dropdownClassName = fullWidth
        ? "absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto"
        : "absolute top-full right-0 mt-1 w-52 bg-white border border-border rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto";

    return (
        isOpen ? (
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={onDropdownToggle}
                    className={buttonClassName}
                >
                    {fullWidth ? (
                        <div className="flex items-center gap-2 min-w-0">
                            <FlightTakeoffIcon sx={{ fontSize: 16 }} className="text-primary shrink-0" />
                            <span className="text-sm font-medium text-foreground truncate">
                                {currentTrip?.name ?? "여행 선택"}
                            </span>
                        </div>
                    ) : (
                        <>
                            <FlightTakeoffIcon sx={{ fontSize: 16 }} className="text-primary shrink-0" />
                            <span className="text-sm font-medium text-foreground max-w-36 truncate">
                                {currentTrip?.name ?? "여행 선택"}
                            </span>
                        </>
                    )}
                    <ExpandMoreIcon
                        sx={{ fontSize: 16 }}
                        className={`text-text-secondary shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                    />
                </button>

                {dropdownOpen && (
                    <div className={dropdownClassName}>
                        {trips.length === 0 ? (
                            <p className="px-3 py-2 text-xs text-text-secondary">참여한 여행이 없어요</p>
                        ) : (
                            trips.map((trip) => (
                                <button
                                    key={trip.id}
                                    onClick={handleSelectTrip(trip)}
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
                                onClick={onDropdownClose}
                                className="block px-3 py-2 text-sm text-primary hover:bg-lighter transition-colors font-medium"
                            >
                                여행 관리 →
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        ) : (
            <Link href="/trips" className="flex justify-center py-2" title="여행 관리">
                <FlightTakeoffIcon sx={{ fontSize: 20 }} className="text-primary" />
            </Link>
        )
    );
};

export default DropDownTripListButton;
