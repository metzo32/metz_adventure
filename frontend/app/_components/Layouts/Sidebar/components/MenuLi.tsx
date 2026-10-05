import { LinkPreset } from "@/app/_components/Components/LinkPreset";
import { NavItem } from "../data";

interface MenuLiProps {
    item: NavItem;
    isOpen: boolean;
    icon: React.ElementType;
    isActive: boolean;
}
export default function MenuLi({ item, isOpen, icon: Icon, isActive }: MenuLiProps) {
    return (
        <li>
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
    )
}
