"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/Modal";
import { InputRhf } from "@/components/RHF/InputRhf";
import { SelectRhf } from "@/components/RHF/SelectRhf";
import { TextareaRhf } from "@/components/RHF/TextareaRhf";
import { DatePickerRhf } from "@/components/RHF/DatePickerRhf";
import { createTrip } from "@/app/api/trips";
import { useTrip } from "@/app/contexts/TripContext";
import { COUNTRIES } from "@/app/trips/data/constants";

type CreateTripForm = {
  name: string;
  description: string;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export const CreateTripModal = ({ open, onClose }: Props) => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const queryClient = useQueryClient();
  const { setCurrentTrip } = useTrip();

  const { control, handleSubmit, reset } = useForm<CreateTripForm>({
    defaultValues: { name: "", description: "", country: "", city: "", start_date: "", end_date: "" },
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: CreateTripForm) => createTrip(userId, data),
    onSuccess: (newTrip) => {
      queryClient.invalidateQueries({ queryKey: ["trips", userId] });
      setCurrentTrip(newTrip);
      reset();
      onClose();
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CreateTripForm) => mutate(data);
  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onConfirm={handleFormSubmit}
      title="새 여행 만들기"
      confirmButton={isPending ? "생성 중..." : "여행 만들기"}
      cancelButton="취소"
      content={
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <InputRhf
            control={control}
            name="name"
            label="여행 이름"
            placeholder="예) 치앙마이 여행 2025"
            maxLength={20}
            rules={{ required: "여행 이름을 입력해주세요." }}
          />
          <TextareaRhf
            control={control}
            name="description"
            label="설명"
            placeholder="여행에 대한 간단한 소개를 입력해주세요. (선택)"
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <SelectRhf
              control={control}
              name="country"
              label="국가"
              placeholder="국가 선택"
              options={COUNTRIES}
              rules={{ required: "국가를 선택해주세요." }}
            />
            <InputRhf
              control={control}
              name="city"
              label="도시"
              placeholder="예) 치앙마이 (선택)"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <DatePickerRhf
              control={control}
              name="start_date"
              label="여행 시작일"
              placeholder="시작일 선택"
            />
            <DatePickerRhf
              control={control}
              name="end_date"
              label="여행 종료일"
              placeholder="종료일 선택"
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs">{(error as Error).message}</p>
          )}
        </form>
      }
    />
  );
};
