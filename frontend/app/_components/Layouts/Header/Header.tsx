"use client"

import { useSession } from "next-auth/react";
import { useTrip } from "@/app/contexts/TripContext";
import { LinkPreset } from "../../Components/LinkPreset";
import HomeButton from "./HomeButton";
import TimeWidget from "./TimeWidget";
import DropDownTripListButton from "../Shared/DropDownTripListButton";

export default function Header() {
    const { data: session } = useSession();
    const isLoggedIn = !!session;

    const { currentTrip } = useTrip();

    console.log("isLoggedIn", isLoggedIn)

    return (
        <header className="bg-white border-b border-border sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* 로고 */}
                <HomeButton />

                {/* 시간 위젯 */}
                <TimeWidget currentTrip={currentTrip} />

                {isLoggedIn ? (
                    <DropDownTripListButton />
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
