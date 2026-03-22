"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FilterPanel } from "./_components/FilterPanel";
import { WishlistTable } from "./_components/WishlistTable";
import { fetchItems } from "@/app/api/wishlist";
import { PageContainer } from "@/components/PageContainer";
import { NoTripSelected } from "@/components/NoTripSelected";
import { useTrip } from "@/app/contexts/TripContext";

const WishlistPage = () => {
  const queryClient = useQueryClient();
  const { currentTrip } = useTrip();

  const { data: serverItems = [] } = useQuery({
    queryKey: ["wishlist", currentTrip?.id],
    queryFn: () => fetchItems(currentTrip!.id),
    enabled: !!currentTrip,
  });

  const [filterCategory, setFilterCategory] = useState("전체");
  const [filterStatus, setFilterStatus] = useState<"전체" | "완료" | "미완료">("전체");
  const [addCount, setAddCount] = useState(0);

  const filtered = serverItems.filter((it) => {
    if (filterCategory !== "전체" && it.category !== filterCategory) return false;
    if (filterStatus === "완료" && !it.is_done) return false;
    if (filterStatus === "미완료" && it.is_done) return false;
    return true;
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["wishlist", currentTrip?.id] });

  const handleFilterChange = (category: string, status: "전체" | "완료" | "미완료") => {
    setFilterCategory(category);
    setFilterStatus(status);
  };
  const handleAddNew = () => setAddCount((c) => c + 1);
  const handleCloseAdd = () => setAddCount(0);

  const handleAdd = invalidate;
  const handleUpdate = invalidate;
  const handleDelete = invalidate;

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-foreground mb-6">위시리스트</h1>

      {!currentTrip ? (
        <NoTripSelected />
      ) : (
        <>
          <FilterPanel
            filteredCount={filtered.length}
            onFilterChange={handleFilterChange}
            onAddNew={handleAddNew}
          />
          <WishlistTable
            tripId={currentTrip.id}
            filtered={filtered}
            addCount={addCount}
            onCloseAdd={handleCloseAdd}
            onAdd={handleAdd}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </>
      )}
    </PageContainer>
  );
};

export default WishlistPage;
