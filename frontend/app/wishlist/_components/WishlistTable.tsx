"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { InputRhf } from "@/components/RHF/InputRhf";
import { SelectRhf } from "@/components/RHF/SelectRhf";
import { Button } from "@/components/Button";
import { createItem, updateItem, deleteItem } from "@/app/api/wishlist";
import { Td } from "@/components/Tags";
import { EditableRow } from "./EditableRow";
import { IsDoneToggleCell } from "./IsDoneToggleCell";
import { CATEGORY_OPTIONS, PRIORITY_OPTIONS, TABLE_COLUMNS, EMPTY_ITEM } from "../data/constants";
import type { WishItem, FormValues } from "../types";

type WishlistTableProps = {
  tripId: number;
  filtered: WishItem[];
  addCount: number;
  onCloseAdd: () => void;
  onAdd: (item: WishItem) => void;
  onUpdate: (item: WishItem) => void;
  onDelete: (id: number) => void;
};

export const WishlistTable = ({ tripId, filtered, addCount, onCloseAdd, onAdd, onUpdate, onDelete }: WishlistTableProps) => {
  const [editingId, setEditingId] = useState<number | null>(null);

  const methods = useForm<FormValues>({ defaultValues: { items: [] } });
  const { fields, append, remove } = useFieldArray({ control: methods.control, name: "items" });

  useEffect(() => {
    if (addCount > 0) {
      append({ ...EMPTY_ITEM });
    } else {
      methods.reset({ items: [] });
    }
  }, [addCount, append, methods]);

  const handleRemoveRow = (index: number) => () => remove(index);

  const onSubmitNew = async (data: FormValues) => {
    for (const item of data.items) {
      if (!item.title.trim()) continue;
      const created = await createItem({ ...item, is_done: 0 }, tripId);
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

  const getAddRowCells = (index: number) => [
    { key: "title", cell: <InputRhf control={methods.control} name={`items.${index}.title`} placeholder="항목명 입력" /> },
    { key: "category", cell: <SelectRhf control={methods.control} name={`items.${index}.category`} options={CATEGORY_OPTIONS} /> },
    { key: "priority", cell: <SelectRhf control={methods.control} name={`items.${index}.priority`} options={PRIORITY_OPTIONS} valueAsNumber /> },
    { key: "memo", cell: <InputRhf control={methods.control} name={`items.${index}.memo`} placeholder="메모" /> },
    { key: "link", cell: <InputRhf control={methods.control} name={`items.${index}.link`} placeholder="https://..." /> },
    { key: "is_done", cell: <IsDoneToggleCell control={methods.control} index={index} setValue={methods.setValue} /> },
  ];

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
              {TABLE_COLUMNS.map(({ label, className }) => (
                <th key={label} className={`py-3 px-4 text-left font-medium ${className}`}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {addCount > 0 &&
              fields.map((field, index) => (
                <tr key={field.id} className="border-b border-border bg-white">
                  {getAddRowCells(index).map(({ key, cell }) => (
                    <Td key={key}>{cell}</Td>
                  ))}
                  <Td>
                    <button onClick={handleRemoveRow(index)} className="text-red-400 hover:text-red-600 text-xs">
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
