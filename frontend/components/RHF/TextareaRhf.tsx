"use client";

import { Controller, type Control, type RegisterOptions } from "react-hook-form";

interface TextareaRhfProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  rows?: number;
  className?: string;
  disabled?: boolean;
  rules?: RegisterOptions;
  hint?: string;
  onChange?: (value: string) => void;
}

const BASE_CLASS =
  "w-full border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary resize-none";

export const TextareaRhf = ({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  className = "",
  disabled,
  rules,
  hint,
  onChange,
}: TextareaRhfProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue=""
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
          field.onChange(e.target.value);
          onChange?.(e.target.value);
        };

        return (
          <div className={`flex flex-col gap-1 w-full ${className}`}>
            {label && (
              <label htmlFor={name} className="text-sm font-medium text-foreground">
                {label}
                {rules?.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}

            <textarea
              id={name}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              value={field.value ?? ""}
              onChange={handleChange}
              onBlur={field.onBlur}
              className={`${BASE_CLASS} ${disabled ? "bg-slate-100 text-text-secondary cursor-not-allowed" : ""}`}
            />

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
