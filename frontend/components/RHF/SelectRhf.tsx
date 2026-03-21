"use client";

import { Controller, type Control, type RegisterOptions } from "react-hook-form";

interface SelectRhfProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  options?: { label: string; value: string | number }[];
  disabled?: boolean;
  rules?: RegisterOptions;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  valueAsNumber?: boolean;
}

const BASE_CLASS =
  "w-full border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary bg-white";

export const SelectRhf = ({
  control,
  name,
  label,
  placeholder,
  options = [],
  disabled,
  rules,
  defaultValue,
  onValueChange,
  className = "",
  valueAsNumber = false,
}: SelectRhfProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      defaultValue={defaultValue ?? ""}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
          const val = valueAsNumber ? Number(e.target.value) : e.target.value;
          field.onChange(val);
          onValueChange?.(e.target.value);
        };

        return (
          <div className={`flex flex-col gap-1 w-full ${className}`}>
            {label && (
              <label htmlFor={name} className="text-sm font-medium text-foreground">
                {label}
                {rules?.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}

            <select
              id={name}
              disabled={disabled}
              value={field.value ?? defaultValue ?? ""}
              onChange={handleChange}
              onBlur={field.onBlur}
              className={`${BASE_CLASS} ${disabled ? "bg-slate-100 text-text-secondary cursor-not-allowed" : ""}`}
            >
              {placeholder && (
                <option value="" disabled>
                  {placeholder}
                </option>
              )}
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {fieldState.error && (
              <small className="text-red-500 text-xs">{fieldState.error.message}</small>
            )}
          </div>
        );
      }}
    />
  );
};
