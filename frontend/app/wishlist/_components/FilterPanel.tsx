"use client";

import { useState } from "react";
import { Button } from "@/components/Button";

const CATEGORIES = ["전체", "음식", "카페", "관광", "쇼핑", "숙소", "기타"];
const STATUS_OPTIONS = ["전체", "완료", "미완료"] as const;

type FilterStatus = (typeof STATUS_OPTIONS)[number];

type FilterPanelProps = {
  filteredCount: number;
  onFilterChange: (category: string, status: FilterStatus) => void;
  onAddNew: () => void;
};

export const FilterPanel = ({ filteredCount, onFilterChange, onAddNew }: FilterPanelProps) => {
  const [filterCategory, setFilterCategory] = useState("전체");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("전체");

  const handleCategoryFilter = (c: string) => {
    setFilterCategory(c);
    onFilterChange(c, filterStatus);
  };

  const handleStatusFilter = (s: FilterStatus) => {
    setFilterStatus(s);
    onFilterChange(filterCategory, s);
  };

  return (
    <div className="mb-4 p-4 bg-white rounded-2xl border border-border flex justify-between items-center">

      <div className="flex flex-wrap gap-8">
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-2">카테고리</p>
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((c) => (
              <Button
                key={c}
                mode="filter"
                isActive={filterCategory === c}
                onClick={() => handleCategoryFilter(c)}
              >
                {c}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-text-secondary mb-2">상태</p>
          <div className="flex gap-2">
            {STATUS_OPTIONS.map((s) => (
              <Button
                key={s}
                mode="filter"
                isActive={filterStatus === s}
                onClick={() => handleStatusFilter(s)}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <span className="text-sm text-text-secondary flex items-center gap-1">
          총
          <span className="font-semibold text-foreground">{filteredCount}</span>
          건
        </span>
        <Button onClick={onAddNew} className="whitespace-nowrap">추가하기 +</Button>
      </div>
    </div>
  );
};
