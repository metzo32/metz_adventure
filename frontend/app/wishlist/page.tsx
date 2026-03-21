"use client";

import { useState, useEffect } from "react";
import { FilterPanel } from "./_components/FilterPanel";
import { WishlistTable } from "./_components/WishlistTable";
import { fetchItems } from "@/app/api/wishlist";
import type { WishItem } from "./types";

const WishlistPage = () => {
  const [serverItems, setServerItems] = useState<WishItem[]>([]);
  const [filterCategory, setFilterCategory] = useState("전체");
  const [filterStatus, setFilterStatus] = useState<"전체" | "완료" | "미완료">("전체");
  const [addCount, setAddCount] = useState(0);

  useEffect(() => {
    fetchItems().then(setServerItems).catch(console.error);
  }, []);

  const filtered = serverItems.filter((it) => {
    if (filterCategory !== "전체" && it.category !== filterCategory) return false;
    if (filterStatus === "완료" && !it.is_done) return false;
    if (filterStatus === "미완료" && it.is_done) return false;
    return true;
  });

  const handleFilterChange = (category: string, status: "전체" | "완료" | "미완료") => {
    setFilterCategory(category);
    setFilterStatus(status);
  };
  const handleAddNew = () => setAddCount((c) => c + 1);
  const handleCloseAdd = () => setAddCount(0);

  const handleAdd = (item: WishItem) => setServerItems((prev) => [item, ...prev]);
  const handleUpdate = (updated: WishItem) =>
    setServerItems((prev) => prev.map((it) => (it.id === updated.id ? updated : it)));
  const handleDelete = (id: number) =>
    setServerItems((prev) => prev.filter((it) => it.id !== id));

  return (
    <div className="min-h-screen bg-background px-8 py-8 font-sans overflow-hidden">
      <h1 className="text-2xl font-bold text-foreground mb-6">위시리스트</h1>

      <FilterPanel
        filteredCount={filtered.length}
        onFilterChange={handleFilterChange}
        onAddNew={handleAddNew}
      />

      <WishlistTable
        filtered={filtered}
        addCount={addCount}
        onCloseAdd={handleCloseAdd}
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default WishlistPage;
