"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Modal } from "@/components/Modal";
import { SelectRhf } from "@/components/RHF/SelectRhf";
import { InputRhf } from "@/components/RHF/InputRhf";
import { TimePickerRhf } from "@/components/RHF/TimePickerRhf";
import { createFlight, updateFlight } from "@/app/api/mypage";
import type { AddFlightForm, Flight } from "@/app/mypage/types";

type Props = {
  open: boolean;
  onClose: () => void;
  tripId: number;
  editFlight?: Flight | null;
};

const FLIGHT_TYPE_OPTIONS = [
  { label: "가는 비행 (출발편)", value: "outbound" },
  { label: "오는 비행 (귀국편)", value: "return" },
];

const DEFAULT_VALUES: AddFlightForm = {
  type: "outbound",
  departure_place: "",
  departure_time: "",
  arrival_place: "",
  arrival_time: "",
};

const AddFlightModal = ({ open, onClose, tripId, editFlight }: Props) => {
  const queryClient = useQueryClient();
  const isEdit = !!editFlight;

  const { control, handleSubmit, reset } = useForm<AddFlightForm>({
    defaultValues: editFlight ?? DEFAULT_VALUES,
  });

  useEffect(() => {
    reset(editFlight ?? DEFAULT_VALUES);
  }, [editFlight, reset]);

  const { mutate } = useMutation({
    mutationFn: (data: AddFlightForm) =>
      isEdit
        ? updateFlight(tripId, editFlight!.id, data)
        : createFlight(tripId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights", tripId] });
      reset(DEFAULT_VALUES);
      onClose();
    },
  });

  const onSubmit = (data: AddFlightForm) => mutate(data);
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
      title={isEdit ? "항공편 수정" : "항공편 추가"}
      confirmButton={isEdit ? "저장" : "추가"}
      cancelButton="취소"
      content={
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <SelectRhf
            control={control}
            name="type"
            label="구분"
            options={FLIGHT_TYPE_OPTIONS}
            defaultValue="outbound"
            rules={{ required: "구분을 선택해주세요." }}
          />
          <div className="grid grid-cols-2 gap-3">
            <InputRhf
              control={control}
              name="departure_place"
              label="출발지"
              placeholder="예) ICN"
              rules={{ required: "출발지를 입력해주세요." }}
            />
            <TimePickerRhf
              control={control}
              name="departure_time"
              label="출발 시간"
              rules={{ required: "출발 시간을 선택해주세요." }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <InputRhf
              control={control}
              name="arrival_place"
              label="도착지"
              placeholder="예) CNX"
              rules={{ required: "도착지를 입력해주세요." }}
            />
            <TimePickerRhf
              control={control}
              name="arrival_time"
              label="도착 시간"
              rules={{ required: "도착 시간을 선택해주세요." }}
            />
          </div>
        </form>
      }
    />
  );
};

export default AddFlightModal;
