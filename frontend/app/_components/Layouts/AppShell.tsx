"use client"

import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import BottomNav from "./BottomNav";

const EXCLUDED_PATHS = ["/", "/auth/login", "/auth/register"];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const showNav = !EXCLUDED_PATHS.includes(pathname);

    if (!showNav) {
        return <>{children}</>;
    }

    return (
        <>
            <div className="flex">
                <Sidebar />
                <main className="flex-1 min-w-0 pb-16 md:pb-0">
                    {children}
                </main>
            </div>
            <BottomNav />
        </>
    );
}
