"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/Modal";
import { InputRhf } from "@/components/RHF/InputRhf";
import { acceptInviteCode } from "@/app/api/trips";
import { useTrip } from "@/app/contexts/TripContext";

type JoinForm = {
  code: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
};

export const JoinTripModal = ({ open, onClose }: Props) => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const queryClient = useQueryClient();
  const { setCurrentTrip } = useTrip();

  const { control, handleSubmit, reset, setError } = useForm<JoinForm>({
    defaultValues: { code: "" },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: JoinForm) => acceptInviteCode(userId, data.code),
    onSuccess: (joinedTrip) => {
      queryClient.invalidateQueries({ queryKey: ["trips", userId] });
      setCurrentTrip(joinedTrip);
      reset();
      onClose();
    },
    onError: (err) => {
      setError("code", { message: (err as Error).message });
    },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: JoinForm) => mutate(data);
  const handleFormSubmit = handleSubmit(onSubmit);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onConfirm={handleFormSubmit}
      title="초대 코드로 참여"
      confirmButton={isPending ? "참여 중..." : "여행 참여"}
      cancelButton="취소"
      content={
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            초대받은 코드를 입력하면 해당 여행에 참여할 수 있어요.
          </p>
          <InputRhf
            control={control}
            name="code"
            label="초대 코드"
            placeholder="예) A1B2C3D4"
            rules={{ required: "초대 코드를 입력해주세요." }}
          />
        </form>
      }
    />
  );
};
