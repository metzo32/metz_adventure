import { useTimes } from '@/components/Time'
import type { Trip } from "@/app/trips/types";

interface Props {
    currentTrip: Trip | null;
    isLoggedIn: boolean;
}

export default function TimeWidget({ currentTrip, isLoggedIn }: Props) {
    const times = useTimes();

    const destLabel = currentTrip
        ? (currentTrip.city ? `${currentTrip.city}, ${currentTrip.country}` : currentTrip.country)
        : "온세상";

    return (
        <div className={`flex items-center gap-5`}>
            <div className="flex items-center gap-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                <span className="text-slate-400 text-xs">KST</span>
                <span className="font-semibold text-slate-700 text-sm">{times.kst}</span>
            </div>
            {currentTrip && (
                <>
                    <div className="w-px h-4 bg-slate-200" />
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                        <span className="text-slate-400 text-xs">{destLabel}</span>
                        <span className="font-semibold text-slate-700 text-sm">{times.dest}</span>
                    </div>
                </>
            )}
        </div>
    )
}
