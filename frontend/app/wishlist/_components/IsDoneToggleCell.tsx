"use client";

import { useWatch } from "react-hook-form";
import type { Control, UseFormSetValue } from "react-hook-form";
import type { FormValues } from "../types";

type IsDoneToggleCellProps = {
  control: Control<FormValues>;
  index: number;
  setValue: UseFormSetValue<FormValues>;
};

export const IsDoneToggleCell = ({ control, index, setValue }: IsDoneToggleCellProps) => {
  const isDone = useWatch({ control, name: `items.${index}.is_done` });

  const handleToggle = () => setValue(`items.${index}.is_done`, isDone ? 0 : 1);

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-16 px-3 py-1 rounded-full text-xs font-semibold transition ${
        isDone ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
      }`}
    >
      {isDone ? "완료" : "미완료"}
    </button>
  );
};
