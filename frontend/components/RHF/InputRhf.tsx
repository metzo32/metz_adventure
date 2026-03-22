"use client";

import { Controller, type Control, type RegisterOptions } from "react-hook-form";

const onlyNumbersRegex = /[^0-9]/g;
const phoneFilterRegex = /[^0-9-]/g;

interface InputRhfProps {
  control: Control<any>;
  name: string;
  label?: string;
  type?: "text" | "date" | "time" | "password";
  mode?: "text" | "currency" | "phone";
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean;
  rules?: RegisterOptions;
  unit?: string;
  hint?: string;
  maxLength?: number;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const BASE_CLASS =
  "w-full border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary";

export const InputRhf = ({
  control,
  name,
  label,
  type = "text",
  mode = "text",
  placeholder,
  className = "",
  disabled,
  readOnly,
  rules,
  unit,
  hint,
  maxLength = 50,
  onChange,
  onBlur,
  onKeyDown,
}: InputRhfProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field, fieldState }) => {
        const sanitize = (raw: string) => {
          if (mode === "currency") {
            const onlyNums = raw.replace(onlyNumbersRegex, "");
            const noLeadingZero = onlyNums.replace(/^0+/, "") || "0";
            return Number(noLeadingZero).toLocaleString("ko-KR");
          }

          if (mode === "phone") {
            let filtered = raw.replace(phoneFilterRegex, "");
            filtered = filtered.replace(/-{2,}/g, "-");
            return filtered.slice(0, maxLength);
          }

          return maxLength ? raw.slice(0, maxLength) : raw;
        };

        const displayValue = (() => {
          if (mode === "currency" && field.value !== "" && field.value != null) {
            const num =
              typeof field.value === "number"
                ? field.value
                : Number(String(field.value).replace(/,/g, "")) || 0;
            return num.toLocaleString("ko-KR");
          }
          return field.value ?? "";
        })();

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (type === "date" || type === "time" || type === "password") {
            field.onChange(e.target.value);
            onChange?.(e.target.value);
            return;
          }
          const formatted = sanitize(e.target.value);

          if (mode === "currency") {
            const numericValue = Number(formatted.replace(/,/g, "")) || 0;
            field.onChange(numericValue);
            onChange?.(String(numericValue));
          } else {
            field.onChange(formatted);
            onChange?.(formatted);
          }
        };

        const handleBlur = () => {
          field.onBlur();
          onBlur?.();
        };

        return (
          <div className={`flex flex-col gap-1 w-full ${className}`}>
            {label && (
              <label htmlFor={name} className="text-sm font-medium text-foreground">
                {label}
                {rules?.required && (
                  <span className="text-red-500 ml-0.5">*</span>
                )}
              </label>
            )}

            <div className="flex items-center gap-1">
              <input
                id={name}
                type={type}
                inputMode={mode === "currency" || mode === "phone" ? "numeric" : "text"}
                placeholder={readOnly ? "" : placeholder}
                disabled={disabled}
                readOnly={readOnly}
                value={displayValue}
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={onKeyDown}
                className={`${BASE_CLASS} ${mode === "currency" ? "text-right" : ""} ${disabled ? "bg-slate-100 text-text-secondary cursor-not-allowed" : ""}`}
              />
              {unit && (
                <span className="text-sm text-text-secondary whitespace-nowrap">{unit}</span>
              )}
            </div>

            {hint && <p className="text-xs text-text-secondary/60">{hint}</p>}

            {fieldState.error && (
              <small className="text-red-500 text-xs">{fieldState.error.message}</small>
            )}
          </div>
        );
      }}
    />
  );
};
