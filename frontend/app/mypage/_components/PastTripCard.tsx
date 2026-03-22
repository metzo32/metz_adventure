"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LocationOn, CalendarToday, AccountBalanceWallet } from "@mui/icons-material";
import { Button } from "@/components/Button";
import { TextareaRhf } from "@/components/RHF/TextareaRhf";
import dayjs from "dayjs";
import { saveTripMemo } from "@/app/api/mypage";
import type { PastTrip } from "@/app/mypage/types";

type Props = {
  trip: PastTrip;
  userId: string;
};

type MemoForm = {
  memo: string;
};

const PastTripCard = ({ trip, userId }: Props) => {
  const queryClient = useQueryClient();

  const { control, handleSubmit, reset } = useForm<MemoForm>({
    defaultValues: { memo: trip.memo ?? "" },
  });

  useEffect(() => {
    reset({ memo: trip.memo ?? "" });
  }, [trip.memo, reset]);

  const { mutate: saveMemo, isPending } = useMutation({
    mutationFn: (memo: string) => saveTripMemo(userId, trip.id, memo),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pastTrips", userId] }),
  });

  const onSubmit = (data: MemoForm) => saveMemo(data.memo);
  const handleSave = handleSubmit(onSubmit);

  const dateRange = [
    trip.start_date ? dayjs(trip.start_date).format("YYYY.MM.DD") : "",
    trip.end_date ? dayjs(trip.end_date).format("YYYY.MM.DD") : "",
  ]
    .filter(Boolean)
    .join(" ~ ");

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold text-foreground text-base">{trip.name}</h3>
          <div className="flex items-center gap-3 flex-wrap">
            {(trip.country || trip.city) && (
              <span className="flex items-center gap-1 text-text-secondary text-xs">
                <LocationOn sx={{ fontSize: 14 }} />
                {[trip.country, trip.city].filter(Boolean).join(" · ")}
              </span>
            )}
            {dateRange && (
              <span className="flex items-center gap-1 text-text-secondary text-xs">
                <CalendarToday sx={{ fontSize: 14 }} />
                {dateRange}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-lighter rounded-xl px-3 py-2 shrink-0">
          <AccountBalanceWallet sx={{ fontSize: 15, color: "#0832A4" }} />
          <span className="text-primary font-semibold text-sm">
            {trip.total_expense_krw.toLocaleString()}원
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <TextareaRhf
          control={control}
          name="memo"
          label="여행 메모"
          placeholder="이 여행에 대한 메모를 남겨보세요..."
          rows={3}
        />
        <div className="flex justify-end">
          <Button mode="full" onClick={handleSave}>
            {isPending ? "저장 중..." : "저장"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PastTripCard;
