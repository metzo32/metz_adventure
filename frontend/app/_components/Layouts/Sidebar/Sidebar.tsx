"use client";

import { useState } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import DropDownTripListButton from "../Shared/DropDownTripListButton";
import MenuLi from "./components/MenuLi";
import ToggleButton from "./components/ToggleButton";
import { NAV_ITEMS, NavItem } from "./data";

const handleToggle = (setIsOpen: React.Dispatch<React.SetStateAction<boolean>>) => {
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
                bg-white border-r border-border
                transition-all duration-300 ease-in-out shrink-0
                ${isOpen ? "w-56" : "w-16"}
            `}
        >
            {/* 접기/펼치기 버튼 */}
            <ToggleButton onToggleClick={onToggleClick} isOpen={isOpen} />

            {/* 여행 선택기 */}
            <div className="px-2 py-3 border-b border-border">
                <DropDownTripListButton fullWidth isOpen={isOpen} />
            </div>

            {/* 네비게이션 메뉴 */}
            <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
                <ul className="flex flex-col gap-1 px-2">
                    {NAV_ITEMS.map((item: NavItem) => {
                        const isActive =
                            pathname === item.href || pathname.startsWith(item.href + "/");

                        return (
                            <MenuLi
                                key={item.href}
                                item={item}
                                icon={item.icon}
                                isOpen={isOpen}
                                isActive={isActive}
                            />
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
