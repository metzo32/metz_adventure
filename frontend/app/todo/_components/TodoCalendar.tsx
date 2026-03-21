'use client';

import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ko';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

dayjs.locale('ko');

interface Props {
  currentMonth: Dayjs;
  selectedDate: string | null;
  itemDates: string[];
  onMonthChange: (month: Dayjs) => void;
  onDateSelect: (date: string) => void;
}

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일'];

const TodoCalendar = ({ currentMonth, selectedDate, itemDates, onMonthChange, onDateSelect }: Props) => {
  const today = dayjs().format('YYYY-MM-DD');

  const startOfMonth = currentMonth.startOf('month');
  const endOfMonth = currentMonth.endOf('month');

  // 0=Sun ... 6=Sat → convert to Mon-first: Mon=0 ... Sun=6
  const startDow = (startOfMonth.day() + 6) % 7;
  const daysInMonth = endOfMonth.date();

  const calendarCells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to full weeks
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const handlePrev = () => onMonthChange(currentMonth.subtract(1, 'month'));
  const handleNext = () => onMonthChange(currentMonth.add(1, 'month'));

  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-semibold text-foreground">
          <span className="text-primary">{currentMonth.format('YYYY년 M월')}</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handlePrev}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-lighter transition-colors"
          >
            <ChevronLeft sx={{ fontSize: 18, color: '#64748B' }} />
          </button>
          <button
            onClick={handleNext}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-lighter transition-colors"
          >
            <ChevronRight sx={{ fontSize: 18, color: '#64748B' }} />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-text-secondary py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarCells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />;
          }

          const dateStr = currentMonth.date(day).format('YYYY-MM-DD');
          const isSelected = selectedDate === dateStr;
          const isToday = today === dateStr;
          const hasItems = itemDates.includes(dateStr);
          const isSat = idx % 7 === 6;
          const isSun = false; // Mon-first: col0=Mon, col6=Sun

          return (
            <button
              key={day}
              onClick={() => onDateSelect(dateStr)}
              className="flex flex-col items-center justify-center aspect-square rounded-full transition-all"
            >
              <span
                className={[
                  'w-7 h-7 flex items-center justify-center rounded-full text-sm transition-all',
                  isSelected ? 'bg-primary text-white font-semibold' : '',
                  isToday && !isSelected ? 'border border-primary text-primary font-semibold' : '',
                  !isSelected && !isToday ? 'text-foreground hover:bg-lighter' : '',
                  isSat && !isSelected ? 'text-blue-400' : '',
                ].join(' ')}
              >
                {day}
              </span>
              {hasItems && (
                <span
                  className={[
                    'w-1 h-1 rounded-full mt-0.5',
                    isSelected ? 'bg-white' : 'bg-primary',
                  ].join(' ')}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TodoCalendar;
