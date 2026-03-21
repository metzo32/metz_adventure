"use client";

import { Controller, type Control, type RegisterOptions } from "react-hook-form";

interface ButtonsRhfProps {
  control: Control<any>;
  name: string;
  label?: string;
  options: { label: string; value: string; color?: string; backgroundColor?: string; borderColor?: string }[];
  rules?: RegisterOptions;
}

export const ButtonsRhf = ({ control, name, label, options, rules }: ButtonsRhfProps) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          {label && (
            <label htmlFor={name} className="text-sm font-medium text-foreground">
              {label}
              {rules?.required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
          <div className="flex flex-wrap gap-2">
          {options.map((option) => {
            const isSelected = field.value === option.value;

            const handleClick = () => field.onChange(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={handleClick}
                className={[
                  'px-3 py-1.5 rounded-full text-xs font-medium transition-all border',
                  isSelected ? 'border-transparent shadow-sm' : 'border-border bg-white text-text-secondary',
                ].join(' ')}
                style={
                  isSelected
                    ? {
                        color: option.color,
                        backgroundColor: option.backgroundColor,
                        borderColor: option.borderColor,
                      }
                    : {}
                }
              >
                {option.label}
              </button>
            );
          })}
          </div>
        </div>
      )}
    />
  );
};
