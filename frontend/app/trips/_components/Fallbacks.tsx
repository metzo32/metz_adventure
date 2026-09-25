import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export function NoData() {
    return (
        <div className="text-center py-16 flex flex-col items-center gap-3 bg-white rounded-2xl">
            <FlightTakeoffIcon sx={{ fontSize: 48, color: "#CBD5E1" }} />
            <p className="text-text-secondary text-sm">아직 참여한 여행이 없어요.</p>
            <p className="text-text-secondary text-xs">새 여행을 만들거나 초대 코드로 참여해 보세요!</p>
        </div>
    )
}

export function Loading() {
    return (
        <div className="text-center py-16 text-text-secondary text-sm">불러오는 중...</div>
    )
}