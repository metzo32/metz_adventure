"use client";

import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { Modal } from "@/components/Modal";
import type { Trip } from "@/app/trips/types";

type Props = {
  open: boolean;
  trip: Trip;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export const DeleteTripModal = ({ open, trip, isPending, onClose, onConfirm }: Props) => {
  const hasMembers = trip.member_count > 1;

  const content = hasMembers ? (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
        <WarningAmberIcon sx={{ fontSize: 20, color: "#D97706" }} />
        <p className="text-sm text-amber-800 font-medium">
          이 여행에는 본인 외 {trip.member_count - 1}명의 멤버가 있습니다.
        </p>
      </div>
      <p className="text-sm text-text-secondary">
        여행을 삭제하면 모든 멤버가 여행에서 제외되고,{" "}
        <span className="font-semibold text-foreground">위시리스트·투두·예산 등 모든 공유 데이터</span>가
        영구적으로 삭제됩니다.
      </p>
      <p className="text-sm text-text-secondary">정말 삭제하시겠습니까?</p>
    </div>
  ) : (
    <p className="text-sm text-text-secondary">
      <span className="font-semibold text-foreground">"{trip.name}"</span> 여행을 삭제하면 위시리스트·투두·예산 등
      모든 데이터가 영구적으로 삭제됩니다. 계속하시겠습니까?
    </p>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="여행 삭제"
      content={content}
      cancelButton="취소"
      confirmButton={isPending ? "삭제 중..." : "삭제"}
    />
  );
};
