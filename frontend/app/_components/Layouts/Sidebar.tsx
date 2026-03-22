"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { LinkPreset } from "@/app/_components/Components/LinkPreset";
import { Button } from "@/components/Button";
import { useTrip } from "@/app/contexts/TripContext";
import { fetchMyTrips } from "@/app/api/trips";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChecklistIcon from "@mui/icons-material/Checklist";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CheckIcon from "@mui/icons-material/Check";
import type { Trip } from "@/app/trips/types";

const NAV_ITEMS = [
    { href: "/wishlist", label: "위시리스트", icon: FavoriteIcon },
    { href: "/todo", label: "투두리스트", icon: ChecklistIcon },
    { href: "/diary", label: "여행 일기", icon: MenuBookIcon },
    { href: "/places", label: "방문 장소", icon: LocationOnIcon },
    { href: "/budget", label: "예산 관리", icon: AccountBalanceWalletIcon },
    { href: "/mypage", label: "마이페이지", icon: PersonIcon },
];

const handleToggle = (
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
) => {
    setIsOpen((prev) => !prev);
};

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    const { data: session } = useSession();
    const userId = (session?.user as { id?: string })?.id ?? "";

    const { currentTrip, setCurrentTrip } = useTrip();

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

    const onToggleClick = () => handleToggle(setIsOpen);
    const onDropdownToggle = () => setDropdownOpen((prev) => !prev);

    const handleSelectTrip = (trip: Trip) => {
        setCurrentTrip(trip);
        setDropdownOpen(false);
    };

    return (
        <aside
            className={`
                hidden md:flex flex-col
                sticky top-16 h-[calc(100vh-4rem)]
                bg-white border-r border-slate-200
                transition-all duration-300 ease-in-out shrink-0
                ${isOpen ? "w-56" : "w-16"}
            `}
        >
            {/* 접기/펼치기 버튼 */}
            <div className="py-3 px-2 border-b border-slate-200">
                <Button onClick={onToggleClick} mode="nav" isOpen={isOpen}>
                    {isOpen ? (
                        <>
                            <ChevronLeftIcon fontSize="small" className="shrink-0" />
                            <span className="text-sm font-medium whitespace-nowrap">접기</span>
                        </>
                    ) : (
                        <ChevronRightIcon fontSize="small" className="shrink-0" />
                    )}
                </Button>
            </div>

            {/* 여행 선택기 */}
            <div className="px-2 py-3 border-b border-slate-200">
                {isOpen ? (
                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={onDropdownToggle}
                            className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-lighter hover:bg-blue-100 transition-colors"
                        >
                            <div className="flex items-center gap-2 min-w-0">
                                <FlightTakeoffIcon sx={{ fontSize: 16 }} className="text-primary shrink-0" />
                                <span className="text-sm font-medium text-foreground truncate">
                                    {currentTrip?.name ?? "여행 선택"}
                                </span>
                            </div>
                            <ExpandMoreIcon
                                sx={{ fontSize: 16 }}
                                className={`text-text-secondary shrink-0 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                            />
                        </button>

                        {dropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
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
                    <Link
                        href="/trips"
                        className="flex justify-center py-2"
                        title="여행 관리"
                    >
                        <FlightTakeoffIcon sx={{ fontSize: 20 }} className="text-primary" />
                    </Link>
                )}
            </div>

            {/* 네비게이션 메뉴 */}
            <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
                <ul className="flex flex-col gap-1 px-2">
                    {NAV_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isActive =
                            pathname === item.href ||
                            pathname.startsWith(item.href + "/");

                        return (
                            <li key={item.href}>
                                <LinkPreset
                                    href={item.href}
                                    mode="nav"
                                    isOpen={isOpen}
                                    isActive={isActive}
                                    title={!isOpen ? item.label : undefined}
                                >
                                    <Icon
                                        fontSize="small"
                                        className={`shrink-0 ${isActive ? "text-blue-600" : "text-slate-500 group-hover:text-slate-700"}`}
                                    />
                                    {isOpen && (
                                        <span className="text-sm font-medium truncate whitespace-nowrap">
                                            {item.label}
                                        </span>
                                    )}
                                </LinkPreset>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
