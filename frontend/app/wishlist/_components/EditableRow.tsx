"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { SelectRhf } from "@/components/RHF/SelectRhf";
import { Td } from "@/components/Tags";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, PRIORITIES } from "../data/constants";
import type { WishItem } from "../types";

export type EditableRowProps = {
  item: WishItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (item: WishItem) => void;
  onCancel: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

export const EditableRow = ({ item, isEditing, onEdit, onSave, onCancel, onToggle, onDelete }: EditableRowProps) => {
  const [draft, setDraft] = useState<WishItem>(item);

  const { control, getValues: getDraftValues } = useForm({
    defaultValues: { category: item.category, priority: item.priority },
  });

  const p = PRIORITIES[item.priority] ?? PRIORITIES[2];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft({ ...draft, title: e.target.value });

  const handleMemoChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft({ ...draft, memo: e.target.value });

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDraft({ ...draft, link: e.target.value });

  const handleSave = () => {
    const { category, priority } = getDraftValues();
    onSave({ ...draft, category, priority: Number(priority) });
  };

  if (isEditing) {
    return (
      <tr className="border-b border-border bg-lighter">
        <Td>
          <input
            value={draft.title}
            onChange={handleTitleChange}
            className="w-full border border-border rounded-lg px-2 py-1 text-[11px] md:text-sm outline-none focus:border-primary"
          />
        </Td>
        <Td>
          <SelectRhf control={control} name="category" options={CATEGORY_OPTIONS} />
        </Td>
        <Td>
          <SelectRhf control={control} name="priority" options={PRIORITY_OPTIONS} valueAsNumber />
        </Td>
        <Td>
          <input
            value={draft.memo}
            onChange={handleMemoChange}
            className="w-full border border-border rounded-lg px-2 py-1 text-[11px] md:text-sm outline-none focus:border-primary"
          />
        </Td>
        <Td>
          <input
            value={draft.link}
            onChange={handleLinkChange}
            className="w-full border border-border rounded-lg px-2 py-1 text-[11px] md:text-sm outline-none focus:border-primary"
          />
        </Td>
        <td className="py-2 px-4 text-[10px] md:text-xs text-text-secondary whitespace-nowrap">{item.is_done ? "완료" : "미완료"}</td>
        <td className="py-3 px-4 text-center">
          <div className="flex gap-2">
            <button onClick={handleSave} className="text-primary text-[10px] md:text-xs font-semibold hover:underline">
              저장
            </button>
            <button onClick={onCancel} className="text-text-secondary text-[10px] md:text-xs hover:underline">
              취소
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className={`border-b border-border hover:bg-gray-50 transition ${item.is_done ? "opacity-50" : ""}`}>
      <td className="py-3 px-4">
        <span className={`font-semibold ${item.is_done ? "line-through text-text-secondary" : "text-foreground"}`}>
          {item.title}
        </span>
      </td>
      <td className="py-3 px-4 text-text-secondary">{item.category}</td>
      <td className="py-3 px-4">
        <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold whitespace-nowrap ${p.color}`}>{p.label}</span>
      </td>
      <td className="py-3 px-4 text-text-secondary max-w-[140px] truncate">{item.memo || "-"}</td>
      <td className="py-3 px-4">
        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-[10px] md:text-xs truncate max-w-[100px] block"
          >
            {item.link}
          </a>
        ) : (
          <span className="text-text-secondary">-</span>
        )}
      </td>
      <td className="py-3 px-4">
        <button
          onClick={onToggle}
          className={`w-16 px-3 py-1 rounded-full text-[10px] md:text-xs font-semibold transition ${item.is_done ? "bg-green-100 text-green-600 hover:bg-green-200" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
        >
          {item.is_done ? "완료" : "미완료"}
        </button>
      </td>
      <td className="py-3 px-4 text-center">
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-text-secondary text-[10px] md:text-xs hover:underline">
            수정
          </button>
          <button onClick={onDelete} className="text-red-400 hover:text-red-600 text-[10px] md:text-xs">
            삭제
          </button>
        </div>
      </td>
    </tr>
  );
};
