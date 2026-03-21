'use client';

import { useState } from 'react';
import { Modal, Box } from '@mui/material';
import {
  Close,
  AccessTime,
  LocationOn,
  Notes,
  CheckCircle,
  DeleteOutline,
  EditOutlined,
  Map,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { TodoItem } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_BG } from '../data';

dayjs.locale('ko');

interface Props {
  item: TodoItem | null;
  open: boolean;
  onClose: () => void;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const getEmbedUrl = (mapUrl: string, address: string): string => {
  if (mapUrl) {
    // Try to convert google maps share URL to embed
    if (mapUrl.includes('maps.google.com') || mapUrl.includes('google.com/maps')) {
      const url = new URL(mapUrl);
      const q = url.searchParams.get('q');
      if (q) {
        return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed&zoom=15`;
      }
    }
    // If it's already an embed URL
    if (mapUrl.includes('output=embed')) return mapUrl;
  }
  // Fallback: use address
  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&output=embed&zoom=15`;
  }
  return '';
};

const TodoDetailModal = ({ item, open, onClose, onToggleComplete, onDelete }: Props) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!item) return null;

  const embedUrl = getEmbedUrl(item.mapUrl, item.address);

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(item.id);
      setShowDeleteConfirm(false);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '95vw', sm: 520 },
          maxHeight: '90vh',
          overflowY: 'auto',
          outline: 'none',
        }}
      >
        <div className="bg-card rounded-2xl shadow-2xl overflow-hidden">
          {/* Map section */}
          {embedUrl && (
            <div className="w-full h-48 relative">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Maps"
              />
            </div>
          )}

          {/* Content */}
          <div className="p-5">
            {/* Top bar */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{
                    color: CATEGORY_COLORS[item.category],
                    backgroundColor: CATEGORY_BG[item.category],
                  }}
                >
                  {CATEGORY_LABELS[item.category]}
                </span>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-lighter transition-colors"
              >
                <Close sx={{ fontSize: 20, color: '#64748B' }} />
              </button>
            </div>

            {/* Title */}
            <h2
              className={[
                'text-xl font-bold mb-4',
                item.completed ? 'line-through text-text-secondary' : 'text-foreground',
              ].join(' ')}
            >
              {item.name}
            </h2>

            {/* Details */}
            <div className="flex flex-col gap-3">
              {/* Date & Time */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-lighter flex items-center justify-center shrink-0">
                  <AccessTime sx={{ fontSize: 17, color: '#0832A4' }} />
                </div>
                <div>
                  <p className="text-xs text-text-secondary">방문 일시</p>
                  <p className="text-sm font-medium text-foreground">
                    {dayjs(item.visitDate).format('YYYY년 M월 D일 (ddd)')} {item.visitTime}
                  </p>
                </div>
              </div>

              {/* Address */}
              {item.address && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-lighter flex items-center justify-center shrink-0">
                    <LocationOn sx={{ fontSize: 17, color: '#0832A4' }} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">주소</p>
                    <p className="text-sm font-medium text-foreground">{item.address}</p>
                  </div>
                </div>
              )}

              {/* Map URL */}
              {item.mapUrl && (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-lighter flex items-center justify-center shrink-0">
                    <Map sx={{ fontSize: 17, color: '#0832A4' }} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">지도 링크</p>
                    <a
                      href={item.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-primary hover:underline truncate block max-w-xs"
                    >
                      Google Maps에서 보기 →
                    </a>
                  </div>
                </div>
              )}

              {/* Memo */}
              {item.memo && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-lighter flex items-center justify-center shrink-0">
                    <Notes sx={{ fontSize: 17, color: '#0832A4' }} />
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">메모</p>
                    <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                      {item.memo}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-5 pt-4 border-t border-border">
              <button
                onClick={() => onToggleComplete(item.id)}
                className={[
                  'flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  item.completed
                    ? 'bg-lighter text-text-secondary hover:bg-border'
                    : 'bg-[#F0FDF4] text-[#10B981] hover:bg-[#DCFCE7]',
                ].join(' ')}
              >
                <CheckCircle sx={{ fontSize: 18 }} />
                {item.completed ? '완료 취소' : '완료 표시'}
              </button>

              <button
                onClick={handleDelete}
                className={[
                  'flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  showDeleteConfirm
                    ? 'bg-red-500 text-white'
                    : 'bg-[#FFF5F5] text-red-400 hover:bg-red-100',
                ].join(' ')}
              >
                <DeleteOutline sx={{ fontSize: 18 }} />
                {showDeleteConfirm ? '삭제 확인' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default TodoDetailModal;
