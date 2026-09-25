"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import AddIcon from "@mui/icons-material/Add";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { Button } from "@/components/Button";
import { PageContainer } from "@/components/PageContainer";
import { TripCard } from "./_components/TripCard";
import { CreateTripModal } from "./_components/CreateTripModal";
import { JoinTripModal } from "./_components/JoinTripModal";
import { fetchMyTrips } from "@/app/api/trips";
import { NoData, Loading } from "./_components/Fallbacks";

export default function Page() {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? "";

  const [createOpen, setCreateOpen] = useState(false);
  const [joinOpen, setJoinOpen] = useState(false);

  const { data: trips = [], isLoading } = useQuery({
    queryKey: ["trips", userId],
    queryFn: () => fetchMyTrips(userId),
    enabled: !!userId,
  });

  const handleCreateOpen = () => setCreateOpen(true);
  const handleCreateClose = () => setCreateOpen(false);
  const handleJoinOpen = () => setJoinOpen(true);
  const handleJoinClose = () => setJoinOpen(false);

  return (
    <PageContainer>
      <div className="flex flex-col md:flex-row md::items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-foreground">내 여행 목록</h1>

        <div className="flex gap-2 mt-4 md:mt-0">
          <Button onClick={handleJoinOpen} mode="light" className="flex max-md:flex-1 gap-2 items-center justify-center">
            <VpnKeyIcon sx={{ fontSize: 16 }} />
            <span>코드로 참여</span>
          </Button>

          <Button onClick={handleCreateOpen} mode="full" className="flex max-md:flex-1 gap-2 items-center justify-center">
            <AddIcon sx={{ fontSize: 16 }} />
            <span>여행 만들기</span>
          </Button>
        </div>
      </div>

      {isLoading ? (
        <Loading />
      ) : trips.length === 0 ? (
        <NoData />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}

      <CreateTripModal open={createOpen} onClose={handleCreateClose} />
      <JoinTripModal open={joinOpen} onClose={handleJoinClose} />
    </PageContainer>
  );
};

