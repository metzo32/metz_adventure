"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { generateInviteCode } from "@/app/api/trips";
import type { InviteCode, Trip } from "@/app/trips/types";
import dayjs from "dayjs";

type Props = {
  open: boolean;
  onClose: () => void;
  trip: Trip;
};

export const InviteCodeModal = ({ open, onClose, trip }: Props) => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const [inviteCode, setInviteCode] = useState<InviteCode | null>(null);
  const [copied, setCopied] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => generateInviteCode(userId, trip.id),
    onSuccess: (data) => setInviteCode(data),
  });

  const handleGenerateClick = () => mutate();

  const handleCopyClick = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    setInviteCode(null);
    setCopied(false);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onConfirm={handleClose}
      title="초대 코드"
      // confirmButton="닫기"
      content={
        <div className="flex flex-col gap-4">
          <p className="text-sm text-text-secondary">
            <span className="font-medium text-foreground">{trip.name}</span>에 초대할 코드를
            생성합니다. <br /> 코드는 24시간 동안 유효합니다.
          </p>

          {inviteCode ? (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 bg-lighter rounded-lg px-4 py-3">
                <span className="flex-1 font-mono text-2xl font-bold text-primary tracking-widest text-center">
                  {inviteCode.code}
                </span>
                <button
                  onClick={handleCopyClick}
                  className="p-1.5 rounded-md hover:bg-blue-100 transition-colors"
                >
                  {copied ? (
                    <CheckIcon fontSize="small" className="text-light" />
                  ) : (
                    <ContentCopyIcon fontSize="small" className="text-text-secondary" />
                  )}
                </button>
              </div>
              <p className="text-xs text-text-secondary text-center">
                만료: {dayjs(inviteCode.expires_at).format("YYYY.MM.DD HH:mm")}
              </p>
              <Button onClick={handleGenerateClick} mode="light">
                새 코드 생성
              </Button>
            </div>
          ) : (
            <Button onClick={handleGenerateClick} mode="full">
              {isPending ? "생성 중..." : "초대 코드 생성"}
            </Button>
          )}
        </div>
      }
    />
  );
};
