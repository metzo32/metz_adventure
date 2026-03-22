"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/Modal";
import { DatePickerRhf } from "@/components/RHF/DatePickerRhf";
import { InputRhf } from "@/components/RHF/InputRhf";
import { TextareaRhf } from "@/components/RHF/TextareaRhf";
import { saveStep } from "@/app/api/mypage";
import type { AddStepsForm } from "@/app/mypage/types";

type Props = {
  open: boolean;
  onClose: () => void;
  tripId: number;
};

const DEFAULT_VALUES: AddStepsForm = { date: "", count: 0, memo: "" };

const AddStepsModal = ({ open, onClose, tripId }: Props) => {
  const queryClient = useQueryClient();
  const { control, handleSubmit, reset } = useForm<AddStepsForm>({
    defaultValues: DEFAULT_VALUES,
  });

  const { mutate } = useMutation({
    mutationFn: (data: AddStepsForm) => saveStep(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["steps", tripId] });
      reset(DEFAULT_VALUES);
      onClose();
    },
  });

  const onSubmit = (data: AddStepsForm) => mutate(data);
  const handleFormSubmit = handleSubmit(onSubmit);
  const handleClose = () => {
    reset(DEFAULT_VALUES);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onConfirm={handleFormSubmit}
      title="걸음 수 입력"
      confirmButton="저장"
      cancelButton="취소"
      content={
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <DatePickerRhf
            control={control}
            name="date"
            label="날짜"
            rules={{ required: "날짜를 선택해주세요." }}
          />
          <InputRhf
            control={control}
            name="count"
            label="걸음 수"
            mode="currency"
            placeholder="0"
            unit="걸음"
            rules={{ required: "걸음 수를 입력해주세요." }}
          />
          <TextareaRhf
            control={control}
            name="memo"
            label="메모 (선택)"
            placeholder="메모를 입력하세요"
            rows={2}
          />
        </form>
      }
    />
  );
};

export default AddStepsModal;
