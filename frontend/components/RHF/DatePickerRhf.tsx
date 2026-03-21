"use client";

import { useState, useRef, useEffect } from "react";
import { Controller, type Control, type RegisterOptions, type ControllerRenderProps, type FieldValues } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import { ChevronLeft, ChevronRight, CalendarMonth } from "@mui/icons-material";

dayjs.locale("ko");

const WEEKDAYS = ["월", "화", "수", "목", "금", "토", "일"];

interface DatePickerRhfProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  disabled?: boolean;
}

interface InnerProps {
  field: ControllerRenderProps<FieldValues, string>;
  fieldError?: { message?: string };
  label?: string;
  name: string;
  rules?: RegisterOptions;
  disabled?: boolean;
  placeholder: string;
}

const DatePickerInner = ({ field, fieldError, label, name, rules, disabled, placeholder }: InnerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(
    field.value ? dayjs(field.value) : dayjs()
  );
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleToggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handlePrev = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const handleNext = () => setCurrentMonth((m) => m.add(1, "month"));

  const handleDateSelect = (dateStr: string) => {
    field.onChange(dateStr);
    setIsOpen(false);
  };

  const displayValue = field.value ? dayjs(field.value).format("YYYY년 M월 D일 (ddd)") : "";

  const startDow = (currentMonth.startOf("month").day() + 6) % 7;
  const daysInMonth = currentMonth.daysInMonth();
  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = dayjs().format("YYYY-MM-DD");

  return (
    <div ref={containerRef} className="flex flex-col gap-1 w-full relative">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {rules?.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <button
        type="button"
        id={name}
        onClick={handleToggle}
        disabled={disabled}
        className={[
          "w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm transition-colors",
          isOpen ? "border-primary" : "border-border",
          disabled ? "bg-slate-100 text-text-secondary cursor-not-allowed" : "bg-white hover:border-primary/50",
        ].join(" ")}
      >
        <span className={displayValue ? "text-foreground" : "text-text-secondary/40"}>
          {displayValue || placeholder}
        </span>
        <CalendarMonth sx={{ fontSize: 16, color: "#94A3B8" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-border rounded-xl shadow-lg p-3 w-64">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-foreground">
              {currentMonth.format("YYYY년 M월")}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={handlePrev}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-lighter transition-colors"
              >
                <ChevronLeft sx={{ fontSize: 16, color: "#64748B" }} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-lighter transition-colors"
              >
                <ChevronRight sx={{ fontSize: 16, color: "#64748B" }} />
              </button>
            </div>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 mb-1">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-center text-xs text-text-secondary py-0.5">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              if (!day) return <div key={`empty-${idx}`} className="aspect-square" />;

              const dateStr = currentMonth.date(day).format("YYYY-MM-DD");
              const isSelected = field.value === dateStr;
              const isToday = today === dateStr;

              return (
                <button
                  type="button"
                  key={day}
                  onClick={() => handleDateSelect(dateStr)}
                  className="flex items-center justify-center aspect-square"
                >
                  <span
                    className={[
                      "w-7 h-7 flex items-center justify-center rounded-full text-xs transition-all",
                      isSelected ? "bg-primary text-white font-semibold" : "",
                      isToday && !isSelected ? "border border-primary text-primary font-semibold" : "",
                      !isSelected && !isToday ? "hover:bg-lighter text-foreground" : "",
                    ].join(" ")}
                  >
                    {day}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {fieldError && (
        <small className="text-red-500 text-xs">{fieldError.message}</small>
      )}
    </div>
  );
};

export const DatePickerRhf = ({
  control,
  name,
  label,
  placeholder = "날짜 선택",
  rules,
  disabled,
}: DatePickerRhfProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue=""
      render={({ field, fieldState }) => (
        <DatePickerInner
          field={field}
          fieldError={fieldState.error}
          label={label}
          name={name}
          rules={rules}
          disabled={disabled}
          placeholder={placeholder}
        />
      )}
    />
  );
};
