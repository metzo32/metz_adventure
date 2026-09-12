import Link from "next/link";
import CheckIcon from "@mui/icons-material/Check";
import type { Trip } from "@/app/trips/types";

type Props = {
    trips: Trip[];
    currentTrip: Trip | null;
    onSelectTrip: (trip: Trip) => void;
    onClose: () => void;
};

const Dropdown = ({ trips, currentTrip, onSelectTrip, onClose }: Props) => {
    const handleSelect = (trip: Trip) => () => onSelectTrip(trip);

    return (
        <div className="absolute top-full right-0 mt-1 w-52 bg-white border border-border rounded-lg shadow-lg z-50 max-h-52 overflow-y-auto">
            {trips.length === 0 ? (
                <p className="px-3 py-2 text-xs text-text-secondary">참여한 여행이 없어요</p>
            ) : (
                trips.map((trip) => (
                    <button
                        key={trip.id}
                        onClick={handleSelect(trip)}
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
                    onClick={onClose}
                    className="block px-3 py-2 text-sm text-primary hover:bg-lighter transition-colors font-medium"
                >
                    여행 관리 →
                </Link>
            </div>
        </div>
    );
};

export default Dropdown;
