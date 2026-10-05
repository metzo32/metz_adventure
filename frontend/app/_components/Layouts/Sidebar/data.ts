import FavoriteIcon from "@mui/icons-material/Favorite";
import ChecklistIcon from "@mui/icons-material/Checklist";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PersonIcon from "@mui/icons-material/Person";


export interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
}

export const NAV_ITEMS: NavItem[] = [
    // { href: "/wishlist", label: "위시리스트", icon: FavoriteIcon },
    // { href: "/todo", label: "투두리스트", icon: ChecklistIcon },
    // { href: "/diary", label: "여행 일기", icon: MenuBookIcon },
    // { href: "/places", label: "방문 장소", icon: LocationOnIcon },
    { href: "/budget", label: "예산 관리", icon: AccountBalanceWalletIcon },
    { href: "/mypage", label: "마이페이지", icon: PersonIcon },
];