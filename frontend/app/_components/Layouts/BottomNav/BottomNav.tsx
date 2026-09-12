"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChecklistIcon from "@mui/icons-material/Checklist";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";

const NAV_ITEMS = [
    { href: "/wishlist", label: "위시리스트", icon: FavoriteIcon },
    { href: "/todo", label: "투두리스트", icon: ChecklistIcon },
    { href: "/diary", label: "일기", icon: MenuBookIcon },
    { href: "/places", label: "장소", icon: LocationOnIcon },
    { href: "/budget", label: "예산", icon: AccountBalanceWalletIcon },
    { href: "/mypage", label: "마이페이지", icon: PersonIcon },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 md:hidden">
            <ul className="flex items-center h-16">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                        pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                    return (
                        <li key={item.href} className="flex-1">
                            <Link
                                href={item.href}
                                className={`
                                    flex flex-col items-center justify-center gap-0.5 py-2 w-full
                                    transition-colors duration-150
                                    ${isActive ? "text-blue-600" : "text-slate-400 hover:text-slate-600"}
                                `}
                            >
                                <Icon fontSize="small" />
                                <span className="text-[10px] font-medium leading-tight">
                                    {item.label}
                                </span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
