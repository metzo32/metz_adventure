"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import ShareIcon from "@mui/icons-material/Share";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Button } from "@/components/Button";
import { InviteCodeModal } from "./InviteCodeModal";
import { DeleteTripModal } from "./DeleteTripModal";
import { useTrip } from "@/app/contexts/TripContext";
import { deleteTrip } from "@/app/api/trips";
import type { Trip } from "@/app/trips/types";
import dayjs from "dayjs";

type Props = {
  trip: Trip;
};

export const TripCard = ({ trip }: Props) => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const { currentTrip, setCurrentTrip } = useTrip();
  const queryClient = useQueryClient();

  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isActive = currentTrip?.id === trip.id;
  const isOwner = String(trip.owner_id) === userId;

  const { mutate: handleDelete, isPending: isDeleting } = useMutation({
    mutationFn: () => deleteTrip(userId, trip.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips", userId] });
      if (currentTrip?.id === trip.id) setCurrentTrip(null);
      setDeleteOpen(false);
    },
  });

  const handleSelectTrip = () => setCurrentTrip(trip);
  const handleInviteOpen = () => setInviteOpen(true);
  const handleInviteClose = () => setInviteOpen(false);
  const handleDeleteOpen = () => setDeleteOpen(true);
  const handleDeleteClose = () => setDeleteOpen(false);
  const handleDeleteConfirm = () => handleDelete();


  return (
    <>
      <div
        className={`bg-card rounded-xl border p-5 flex flex-col gap-4 transition-all ${isActive ? "border-primary shadow-md" : "border-border hover:border-primary/40"
          }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {isActive && (
                <CheckCircleIcon fontSize="small" className="text-primary shrink-0" />
              )}
              <h3 className="font-semibold text-foreground truncate">{trip.name}</h3>
            </div>

            <p className="text-sm text-text-secondary line-clamp-2">{trip.description || "-"}</p>
          </div>
          {isOwner && (
            <button
              onClick={handleDeleteOpen}
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-lighter transition-colors text-text-secondary hover:text-red-500"
            >
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </button>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-text-secondary">
          <span className="flex items-center gap-1">
            <PersonIcon sx={{ fontSize: 14 }} />
            {trip.owner_name}
          </span>
          <span className="flex items-center gap-1">
            <PeopleIcon sx={{ fontSize: 14 }} />
            멤버 {trip.member_count}명
          </span>
          <span className="ml-auto">{dayjs(trip.created_at).format("YYYY.MM.DD")}</span>
        </div>

        <div className="flex gap-2">
          {!isActive && (
            <Button onClick={handleSelectTrip} mode="full" className="flex-1">
              현재 여행으로 설정
            </Button>
          )}
          {isActive && (
            <div className="flex-1 flex items-center justify-center text-sm font-medium text-primary">
              현재 여행
            </div>
          )}
          <Button onClick={handleInviteOpen} mode="light" className="flex items-center gap-2">
            <ShareIcon sx={{ fontSize: 16 }} />
            <span>초대</span>
          </Button>
        </div>
      </div>

      <InviteCodeModal open={inviteOpen} onClose={handleInviteClose} trip={trip} />
      <DeleteTripModal
        open={deleteOpen}
        trip={trip}
        isPending={isDeleting}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
};
