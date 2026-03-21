"use client";

import { useState, useRef, useEffect } from "react";
import { Controller, type Control, type RegisterOptions, type ControllerRenderProps, type FieldValues } from "react-hook-form";
import { AccessTime } from "@mui/icons-material";

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"));
const MINUTES = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, "0"));

interface TimePickerRhfProps {
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

const TimePickerInner = ({ field, fieldError, label, name, rules, disabled, placeholder }: InnerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLDivElement>(null);
  const minuteListRef = useRef<HTMLDivElement>(null);

  const [selectedHour, selectedMinute] = field.value
    ? (field.value as string).split(":")
    : ["", ""];

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const scrollToSelected = (ref: React.RefObject<HTMLDivElement | null>, value: string, items: string[]) => {
      if (!ref.current || !value) return;
      const idx = items.indexOf(value);
      if (idx !== -1) {
        ref.current.scrollTop = idx * 36 - 36;
      }
    };

    setTimeout(() => {
      scrollToSelected(hourListRef, selectedHour, HOURS);
      scrollToSelected(minuteListRef, selectedMinute, MINUTES);
    }, 0);
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) setIsOpen((prev) => !prev);
  };

  const handleSelect = (type: "hour" | "minute", value: string) => {
    const newHour = type === "hour" ? value : (selectedHour || "12");
    const newMinute = type === "minute" ? value : (selectedMinute || "00");
    field.onChange(`${newHour}:${newMinute}`);
  };

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
        <span className={field.value ? "text-foreground" : "text-text-secondary/40"}>
          {field.value || placeholder}
        </span>
        <AccessTime sx={{ fontSize: 16, color: "#94A3B8" }} />
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 left-0 z-50 bg-white border border-border rounded-xl shadow-lg overflow-hidden w-36">
          {/* Column headers */}
          <div className="grid grid-cols-2 border-b border-border">
            <span className="text-center text-xs text-text-secondary py-2 font-medium">시</span>
            <span className="text-center text-xs text-text-secondary py-2 font-medium border-l border-border">분</span>
          </div>

          {/* Scroll columns */}
          <div className="grid grid-cols-2 h-48">
            {/* Hour column */}
            <div ref={hourListRef} className="overflow-y-auto">
              {HOURS.map((h) => {
                const isSelected = selectedHour === h;

                const handleHourClick = () => handleSelect("hour", h);

                return (
                  <button
                    key={h}
                    type="button"
                    onClick={handleHourClick}
                    className={[
                      "w-full h-9 text-sm transition-colors",
                      isSelected ? "bg-primary text-white font-semibold" : "hover:bg-lighter text-foreground",
                    ].join(" ")}
                  >
                    {h}
                  </button>
                );
              })}
            </div>

            {/* Minute column */}
            <div ref={minuteListRef} className="overflow-y-auto border-l border-border">
              {MINUTES.map((m) => {
                const isSelected = selectedMinute === m;

                const handleMinuteClick = () => handleSelect("minute", m);

                return (
                  <button
                    key={m}
                    type="button"
                    onClick={handleMinuteClick}
                    className={[
                      "w-full h-9 text-sm transition-colors",
                      isSelected ? "bg-primary text-white font-semibold" : "hover:bg-lighter text-foreground",
                    ].join(" ")}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {fieldError && (
        <small className="text-red-500 text-xs">{fieldError.message}</small>
      )}
    </div>
  );
};

export const TimePickerRhf = ({
  control,
  name,
  label,
  placeholder = "시간 선택",
  rules,
  disabled,
}: TimePickerRhfProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue=""
      render={({ field, fieldState }) => (
        <TimePickerInner
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
