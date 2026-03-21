"use client"

import { useState } from "react";
import { usePathname } from "next/navigation";
import { LinkPreset } from "@/app/_components/Components/LinkPreset";
import { Button } from "@/components/Button";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChecklistIcon from "@mui/icons-material/Checklist";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

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
    const pathname = usePathname();

    const onToggleClick = () => handleToggle(setIsOpen);

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
                <Button
                    onClick={onToggleClick}
                    mode="nav"
                    isOpen={isOpen}
                >
                    {isOpen ? (
                        <>
                            <ChevronLeftIcon fontSize="small" className="shrink-0" />
                            <span className="text-sm font-medium whitespace-nowrap">
                                접기
                            </span>
                        </>
                    ) : (
                        <ChevronRightIcon fontSize="small" className="shrink-0" />
                    )}
                </Button>
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
