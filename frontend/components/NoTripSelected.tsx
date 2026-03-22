import Link from "next/link";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";

export const NoTripSelected = () => (
  <div className="flex flex-col items-center justify-center py-24 gap-4 bg-white rounded-2xl">
    <FlightTakeoffIcon sx={{ fontSize: 56, color: "#CBD5E1" }} />
    <div className="text-center">
      <p className="font-semibold text-foreground mb-1">여행을 먼저 선택해주세요</p>
      <p className="text-sm text-text-secondary">
        여행 목록에서 현재 여행을 선택하면 데이터를 볼 수 있어요.
      </p>
    </div>
    <Link href="/trips" className="text-sm text-primary font-medium hover:underline">
      여행 선택하러 가기 →
    </Link>
  </div>
);
