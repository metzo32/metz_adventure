"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Controller, type Control, type RegisterOptions, type ControllerRenderProps, type FieldValues } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ko";
import { ChevronLeft, ChevronRight, CalendarMonth } from "@mui/icons-material";

dayjs.locale("ko");

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface DatePickerRhfProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  rules?: RegisterOptions;
  disabled?: boolean;
  disabledDate?: (dateStr: string) => boolean;
}

interface InnerProps {
  field: ControllerRenderProps<FieldValues, string>;
  fieldError?: { message?: string };
  label?: string;
  name: string;
  rules?: RegisterOptions;
  disabled?: boolean;
  placeholder: string;
  disabledDate?: (dateStr: string) => boolean;
}

const DatePickerInner = ({ field, fieldError, label, name, rules, disabled, placeholder, disabledDate }: InnerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(
    field.value ? dayjs(field.value) : dayjs()
  );
  const [calendarStyle, setCalendarStyle] = useState({ top: 0, left: 0, width: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  const updateCalendarPosition = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setCalendarStyle({ top: rect.bottom + 4, left: rect.left, width: rect.width });
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideContainer = containerRef.current?.contains(target);
      const insideCalendar = calendarRef.current?.contains(target);
      if (!insideContainer && !insideCalendar) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    updateCalendarPosition();
    window.addEventListener("scroll", updateCalendarPosition, true);
    window.addEventListener("resize", updateCalendarPosition);
    return () => {
      window.removeEventListener("scroll", updateCalendarPosition, true);
      window.removeEventListener("resize", updateCalendarPosition);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      if (!isOpen) updateCalendarPosition();
      setIsOpen((prev) => !prev);
    }
  };

  const handlePrev = () => setCurrentMonth((m) => m.subtract(1, "month"));
  const handleNext = () => setCurrentMonth((m) => m.add(1, "month"));

  const handleDateSelect = (dateStr: string) => {
    field.onChange(dateStr);
    setIsOpen(false);
  };

  const displayValue = field.value ? dayjs(field.value).format("YYYY년 M월 D일 (ddd)") : "";

  const startDow = currentMonth.startOf("month").day();
  const daysInMonth = currentMonth.daysInMonth();
  const cells: (number | null)[] = [
    ...Array(startDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const today = dayjs().format("YYYY-MM-DD");

  const calendar = isOpen && (
    <div
      ref={calendarRef}
      style={{ position: "fixed", top: calendarStyle.top, left: calendarStyle.left, zIndex: 9999 }}
      className="bg-white border border-border rounded-xl shadow-lg p-3 w-64"
    >
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
        {WEEKDAYS.map((d, i) => (
          <div key={d} className={`text-center text-xs py-0.5 ${i === 0 ? "text-red-400" : "text-text-secondary"}`}>
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
          const isDateDisabled = disabledDate ? disabledDate(dateStr) : false;
          const isSunday = idx % 7 === 0;

          return (
            <button
              type="button"
              key={day}
              onClick={() => !isDateDisabled && handleDateSelect(dateStr)}
              disabled={isDateDisabled}
              className="flex items-center justify-center aspect-square"
            >
              <span
                className={[
                  "w-7 h-7 flex items-center justify-center rounded-full text-xs transition-all",
                  isDateDisabled ? "text-text-secondary/30 cursor-not-allowed" : "",
                  isSelected && !isDateDisabled ? "bg-primary text-white font-semibold" : "",
                  isToday && !isSelected && !isDateDisabled ? "border border-primary text-primary font-semibold" : "",
                  !isSelected && !isToday && !isDateDisabled && isSunday ? "hover:bg-lighter text-red-400" : "",
                  !isSelected && !isToday && !isDateDisabled && !isSunday ? "hover:bg-lighter text-foreground" : "",
                ].join(" ")}
              >
                {day}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-foreground">
          {label}
          {rules?.required && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}

      <button
        ref={buttonRef}
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

      {typeof window !== "undefined" && createPortal(calendar, document.body)}

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
  disabledDate,
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
          disabledDate={disabledDate}
        />
      )}
    />
  );
};
