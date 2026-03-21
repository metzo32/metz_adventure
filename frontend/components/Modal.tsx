'use client';

import React from 'react';
import { Modal as MuiModal, Box } from '@mui/material';
import { Close } from '@mui/icons-material';
import { Button } from '@/components/Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  content: React.ReactNode;
  cancelButton?: string;
  confirmButton?: string;
}

const handleStopPropagation = (e: React.MouseEvent) => e.stopPropagation();

export const Modal = ({
  open,
  onClose,
  onConfirm,
  title,
  content,
  cancelButton,
  confirmButton,
}: ModalProps) => {
  const hasActions = cancelButton || confirmButton;

  return (
    <MuiModal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90vw', sm: 480 },
          maxHeight: '90vh',
          overflowY: 'auto',
          outline: 'none',
        }}
        onClick={handleStopPropagation}
      >
        <div className="bg-card rounded-2xl shadow-2xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-lighter transition-colors"
            >
              <Close sx={{ fontSize: 20, color: '#64748B' }} />
            </button>
          </div>

          {/* Content */}
          <div>{content}</div>

          {/* Actions */}
          {hasActions && (
            <div className="flex gap-2 mt-5">
              {cancelButton && (
                <Button mode="light" onClick={onClose} className="flex-1">
                  {cancelButton}
                </Button>
              )}
              {confirmButton && (
                <Button mode="full" onClick={onConfirm} className="flex-1">
                  {confirmButton}
                </Button>
              )}
            </div>
          )}
        </div>
      </Box>
    </MuiModal>
  );
};
