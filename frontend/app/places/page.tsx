"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PageContainer } from "@/components/PageContainer";
import { Button } from "@/components/Button";
import { Modal } from "@/components/Modal";
import { PlaceCard } from "./_components/PlaceCard";
import { PlaceFilterPanel } from "./_components/PlaceFilterPanel";
import { PlaceFormModal } from "./_components/PlaceFormModal";

import { fetchPlaces, deletePlace } from "@/app/api/places";
import type { Place } from "./types";

const PlacesPage = () => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const queryClient = useQueryClient();

  const { data: places = [] } = useQuery({
    queryKey: ["places", userId],
    queryFn: () => fetchPlaces(userId),
    enabled: !!userId,
  });

  const [filterTag, setFilterTag] = useState("전체");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPlace, setEditPlace] = useState<Place | null>(null);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["places", userId] });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePlace(id, userId),
    onSuccess: () => {
      invalidate();
      setSelectedPlace(null);
    },
  });

  const filtered = places.filter((p) => filterTag === "전체" || p.tag === filterTag);

  const handleCardClick = (place: Place) => setSelectedPlace(place);
  const handleDetailClose = () => setSelectedPlace(null);
  const handleAddNew = () => {
    setEditPlace(null);
    setIsFormOpen(true);
  };
  const handleEdit = () => {
    setEditPlace(selectedPlace);
    setSelectedPlace(null);
    setIsFormOpen(true);
  };
  const handleDelete = () => {
    if (selectedPlace) deleteMutation.mutate(selectedPlace.id);
  };
  const handleFormClose = () => setIsFormOpen(false);
  const handleFormSuccess = invalidate;
  const handleFilterChange = (tag: string) => setFilterTag(tag);

  const detailContent = selectedPlace ? (
    <div>
      {selectedPlace.imageUrl && (
        <div
          className="w-full h-52 rounded-xl mb-4 bg-cover bg-center"
          style={{ backgroundImage: `url(${selectedPlace.imageUrl})` }}
        />
      )}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-white bg-primary px-2.5 py-1 rounded-full">
          {selectedPlace.tag}
        </span>
        <span className="text-foreground font-bold text-base">
          ★ {selectedPlace.rating.toFixed(1)}
        </span>
      </div>
      <p className="text-text-secondary text-sm leading-relaxed">
        {selectedPlace.memo || "메모 없음"}
      </p>
      <div className="flex gap-2 mt-5">
        <Button mode="light" onClick={handleEdit} className="flex-1">수정</Button>
        <Button mode="full" onClick={handleDelete} className="flex-1">삭제</Button>
      </div>
    </div>
  ) : null;

  return (
    <PageContainer>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">방문 장소</h1>
        <Button mode="full" onClick={handleAddNew}>+ 장소 추가</Button>
      </div>

      <div className="mb-6">
        <PlaceFilterPanel activeTag={filterTag} onFilter={handleFilterChange} />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center text-text-secondary py-24 text-sm">
          등록된 장소가 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((place) => (
            <PlaceCard key={place.id} place={place} onClick={handleCardClick} />
          ))}
        </div>
      )}

      {selectedPlace && (
        <Modal
          open={!!selectedPlace}
          onClose={handleDetailClose}
          onConfirm={handleDetailClose}
          title={selectedPlace.title}
          content={detailContent}
        />
      )}

      <PlaceFormModal
        open={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        editPlace={editPlace}
        userId={userId}
      />
    </PageContainer>
  );
};

export default PlacesPage;
