'use client';

import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { ChevronRight, Add, CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import { TodoItem } from '../types';
import { CATEGORY_LABELS, CATEGORY_COLORS, CATEGORY_BG } from '../data';
import { Button } from '@/components/Button';

dayjs.locale('ko');

interface Props {
  selectedDate: string | null;
  items: TodoItem[];
  allItems: TodoItem[];
  onItemClick: (item: TodoItem) => void;
  onAddClick: () => void;
  onToggleComplete: (id: string) => void;
}

const TodoList = ({ selectedDate, items, allItems, onItemClick, onAddClick, onToggleComplete }: Props) => {
  const sorted = [...items].sort((a, b) => a.visitTime.localeCompare(b.visitTime));

  const upcomingItems = allItems
    .filter((item) => !item.completed && item.visitDate >= dayjs().format('YYYY-MM-DD'))
    .sort((a, b) => {
      const dateCompare = a.visitDate.localeCompare(b.visitDate);
      if (dateCompare !== 0) return dateCompare;
      return a.visitTime.localeCompare(b.visitTime);
    })
    .slice(0, 3);

  const handleToggle = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onToggleComplete(id);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">
            {selectedDate
              ? dayjs(selectedDate).format('M월 D일 (ddd)')
              : '날짜를 선택하세요'}
          </h2>
          {selectedDate && (
            <p className="text-sm text-text-secondary mt-0.5">
              {sorted.length > 0 ? `${sorted.length}개의 일정` : '등록된 일정이 없습니다'}
            </p>
          )}
        </div>
        <Button onClick={onAddClick}>
          <Add sx={{ fontSize: 18 }} />
          일정 추가
        </Button>
      </div>

      {/* Selected date items */}
      {selectedDate && (
        <div className="flex flex-col gap-3">
          {sorted.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-8 text-center">
              <p className="text-text-secondary text-sm">이 날 등록된 일정이 없습니다.</p>
              <Button onClick={onAddClick}>
                + 일정 추가하기
              </Button>
            </div>
          ) : (
            sorted.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item)}
                className="w-full bg-card rounded-2xl border border-border p-4 text-left hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-3">
                  {/* Toggle complete */}
                  <button
                    onClick={(e) => handleToggle(e, item.id)}
                    className="mt-0.5 shrink-0"
                  >
                    {item.completed ? (
                      <CheckCircle sx={{ fontSize: 22, color: '#1AB28E' }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ fontSize: 22, color: '#CBD5E1' }} />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-medium px-2 py-0.5 rounded-full"
                        style={{
                          color: CATEGORY_COLORS[item.category],
                          backgroundColor: CATEGORY_BG[item.category],
                        }}
                      >
                        {CATEGORY_LABELS[item.category]}
                      </span>
                      <span className="text-xs text-text-secondary">{item.visitTime}</span>
                    </div>
                    <p
                      className={[
                        'font-semibold text-sm truncate',
                        item.completed ? 'line-through text-text-secondary' : 'text-foreground',
                      ].join(' ')}
                    >
                      {item.name}
                    </p>
                    {item.address && (
                      <p className="text-xs text-text-secondary mt-0.5 truncate">{item.address}</p>
                    )}
                    {item.memo && (
                      <p className="text-xs text-text-secondary/70 mt-1 truncate">{item.memo}</p>
                    )}
                  </div>

                  {/* Arrow */}
                  <ChevronRight
                    sx={{ fontSize: 20, color: '#CBD5E1' }}
                    className="shrink-0 mt-0.5 group-hover:text-primary transition-colors"
                  />
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {!selectedDate && upcomingItems.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-5">
          <h3 className="text-sm font-semibold text-text-secondary mb-3">다가오는 일정</h3>
          <div className="flex flex-col gap-2">
            {upcomingItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onItemClick(item)}
                className="flex items-start gap-3 py-2 text-left hover:bg-lighter rounded-xl px-2 transition-colors"
              >
                <span
                  className="w-1.5 h-1.5 rounded-full mt-2 shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[item.category] }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                  <p className="text-xs text-text-secondary">
                    {dayjs(item.visitDate).format('M월 D일')} {item.visitTime}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {!selectedDate && (
        <div className="bg-lighter rounded-2xl p-6 text-center border border-border border-dashed">
          <p className="text-text-secondary text-sm">좌측 달력에서 날짜를 선택하면</p>
          <p className="text-text-secondary text-sm">해당 날짜의 일정을 확인할 수 있습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TodoList;
