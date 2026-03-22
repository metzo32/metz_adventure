'use client';

import { Modal } from '@/components/Modal';

interface DeleteConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}

export const DeleteConfirmModal = ({ open, onClose, onDelete }: DeleteConfirmModalProps) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      onConfirm={onDelete}
      title="삭제 확인"
      content={<p className="text-sm text-foreground">삭제하시겠습니까?</p>}
      cancelButton="취소"
      confirmButton="삭제"
    />
  );
};
