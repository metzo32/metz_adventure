"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, useWatch, FormProvider, Control, UseFormSetValue } from "react-hook-form";
import { InputRhf } from "@/components/RHF/InputRhf";
import { SelectRhf } from "@/components/RHF/SelectRhf";
import { Button } from "@/components/Button";
import { createItem, updateItem, deleteItem } from "@/app/api/wishlist";
import { Td } from "@/components/Tags";
import type { WishItem, FormValues } from "../types";

const CATEGORIES = ["전체", "음식", "카페", "관광", "쇼핑", "숙소", "기타"];
const CATEGORY_OPTIONS = CATEGORIES.filter((c) => c !== "전체").map((c) => ({ label: c, value: c }));
const TABLE_HEADERS = ["항목명", "카테고리", "우선순위", "메모", "링크", "상태", "Action"];
const PRIORITY_OPTIONS = [
  { value: 1, label: "낮음" },
  { value: 2, label: "보통" },
  { value: 3, label: "높음" },
];
const PRIORITIES: Record<number, { label: string; color: string }> = {
  1: { label: "낮음", color: "bg-blue-100 text-blue-600" },
  2: { label: "보통", color: "bg-yellow-100 text-yellow-600" },
  3: { label: "높음", color: "bg-red-100 text-red-600" },
};
const EMPTY_ITEM: Omit<WishItem, "id"> = {
  title: "",
  category: "기타",
  memo: "",
  link: "",
  priority: 2,
  is_done: 0,
};

type WishlistTableProps = {
  filtered: WishItem[];
  addCount: number;
  onCloseAdd: () => void;
  onAdd: (item: WishItem) => void;
  onUpdate: (item: WishItem) => void;
  onDelete: (id: number) => void;
};

export const WishlistTable = ({
  filtered,
  addCount,
  onCloseAdd,
  onAdd,
  onUpdate,
  onDelete,
}: WishlistTableProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  const methods = useForm<FormValues>({ defaultValues: { items: [] } });
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: "items" });

  useEffect(() => {
    if (addCount > 0) {
      append({ ...EMPTY_ITEM });
    } else {
      methods.reset({ items: [] });
    }
  }, [addCount]);

  const handleRemoveRow = (index: number) => () => remove(index);

  const onSubmitNew = async (data: FormValues) => {
    for (const item of data.items) {
      if (!item.title.trim()) continue;
      const created = await createItem({ ...item, is_done: 0 });
      onAdd(created);
    }
    onCloseAdd();
  };

  const handleEditSave = async (item: WishItem) => {
    const updated = await updateItem(item.id!, item);
    onUpdate(updated);
    setEditingId(null);
  };

  const handleToggleDone = async (item: WishItem) => {
    const updated = await updateItem(item.id!, { is_done: item.is_done ? 0 : 1 });
    onUpdate(updated);
  };

  const handleDelete = async (id: number) => {
    await deleteItem(id);
    onDelete(id);
  };

  const handleEditItem = (id: number) => () => setEditingId(id);
  const handleCancelEdit = () => setEditingId(null);
  const handleToggleItem = (item: WishItem) => () => handleToggleDone(item);
  const handleDeleteItem = (id: number) => () => handleDelete(id);

  return (
    <FormProvider {...methods}>
      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-text-secondary text-xs">
              {TABLE_HEADERS.map((h) => (
                <th key={h} className="py-3 px-4 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {addCount > 0 &&
              fields.map((field, index) => (
                <tr key={field.id} className="border-b border-border bg-white">
                  <Td>
                    <InputRhf
                      control={methods.control}
                      name={`items.${index}.title`}
                      placeholder="항목명 입력"
                    />
                  </Td>
                  <Td>
                    <SelectRhf
                      control={methods.control}
                      name={`items.${index}.category`}
                      options={CATEGORY_OPTIONS}
                    />
                  </Td>
                  <Td>
                    <SelectRhf
                      control={methods.control}
                      name={`items.${index}.priority`}
                      options={PRIORITY_OPTIONS}
                      valueAsNumber
                    />
                  </Td>
                  <Td>
                    <InputRhf
                      control={methods.control}
                      name={`items.${index}.memo`}
                      placeholder="메모"
                    />
                  </Td>
                  <Td>
                    <InputRhf
                      control={methods.control}
                      name={`items.${index}.link`}
                      placeholder="https://..."
                    />
                  </Td>
                  <Td>
                    <IsDoneToggleCell control={methods.control} index={index} setValue={methods.setValue} />
                  </Td>
                  <Td>
                    <button
                      onClick={handleRemoveRow(index)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      삭제
                    </button>
                  </Td>
                </tr>
              ))}

            {addCount > 0 && (
              <tr className="bg-lighter">
                <Td colSpan={7}>
                  <div className="flex justify-end">
                    <Button onClick={methods.handleSubmit(onSubmitNew)}>저장</Button>
                  </div>
                </Td>
              </tr>
            )}

            {filtered.length === 0 && addCount === 0 && (
              <tr>
                <td colSpan={7} className="py-12 text-center text-text-secondary text-sm">
                  항목이 없습니다. 새 항목을 추가해보세요!
                </td>
              </tr>
            )}

            {filtered.map((item) => (
              <EditableRow
                key={item.id}
                item={item}
                isEditing={editingId === item.id}
                onEdit={handleEditItem(item.id!)}
                onSave={handleEditSave}
                onCancel={handleCancelEdit}
                onToggle={handleToggleItem(item)}
                onDelete={handleDeleteItem(item.id!)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </FormProvider>
  );
};

/* ── 인라인 편집 가능한 행 컴포넌트 ── */
type EditableRowProps = {
  item: WishItem;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (item: WishItem) => void;
  onCancel: () => void;
  onToggle: () => void;
  onDelete: () => void;
};

const EditableRow = ({ item, isEditing, onEdit, onSave, onCancel, onToggle, onDelete }: EditableRowProps) => {
  const [draft, setDraft] = useState<WishItem>(item);

  const { control: draftControl, reset: resetDraft, getValues: getDraftValues } = useForm({
    defaultValues: { category: item.category, priority: item.priority },
  });

  useEffect(() => {
    setDraft(item);
    resetDraft({ category: item.category, priority: item.priority });
  }, [item]);

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
            className="w-full border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary"
          />
        </Td>
        <Td>
          <SelectRhf
            control={draftControl}
            name="category"
            options={CATEGORY_OPTIONS}
          />
        </Td>
        <Td>
          <SelectRhf
            control={draftControl}
            name="priority"
            options={PRIORITY_OPTIONS}
            valueAsNumber
          />
        </Td>
        <Td>
          <input
            value={draft.memo}
            onChange={handleMemoChange}
            className="w-full border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary"
          />
        </Td>
        <Td>
          <input
            value={draft.link}
            onChange={handleLinkChange}
            className="w-full border border-border rounded-lg px-2 py-1 text-sm outline-none focus:border-primary"
          />
        </Td>
        <td className="py-2 px-4 text-xs text-text-secondary">{item.is_done ? "완료" : "미완료"}</td>
        <td className="py-2 px-4 flex gap-2">
          <button onClick={handleSave} className="text-primary text-xs font-semibold hover:underline">
            저장
          </button>
          <button onClick={onCancel} className="text-text-secondary text-xs hover:underline">
            취소
          </button>
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
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${p.color}`}>
          {p.label}
        </span>
      </td>
      <td className="py-3 px-4 text-text-secondary max-w-[140px] truncate">{item.memo || "-"}</td>
      <td className="py-3 px-4">
        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline text-xs truncate max-w-[100px] block"
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
          className={`w-16 px-3 py-1 rounded-full text-xs font-semibold transition ${item.is_done
            ? "bg-green-100 text-green-600 hover:bg-green-200"
            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
            }`}
        >
          {item.is_done ? "완료" : "미완료"}
        </button>
      </td>
      <td className="py-3 px-4">
        <button onClick={onEdit} className="text-text-secondary text-xs hover:underline mr-2">
          수정
        </button>
        <button onClick={onDelete} className="text-red-400 hover:text-red-600 text-xs">
          삭제
        </button>
      </td>
    </tr>
  );
};

/* ── 추가 행 완료 토글 셀 ── */
const IsDoneToggleCell = ({
  control,
  index,
  setValue,
}: {
  control: Control<FormValues>;
  index: number;
  setValue: UseFormSetValue<FormValues>;
}) => {
  const isDone = useWatch({ control, name: `items.${index}.is_done` });

  const handleToggle = () => setValue(`items.${index}.is_done`, isDone ? 0 : 1);

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`w-16 px-3 py-1 rounded-full text-xs font-semibold transition ${isDone
        ? "bg-green-100 text-green-600 hover:bg-green-200"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
        }`}
    >
      {isDone ? "완료" : "미완료"}
    </button>
  );
};
