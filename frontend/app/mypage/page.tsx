"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { useTrip } from "@/app/contexts/TripContext";
import { PageContainer } from "@/components/PageContainer";
import { NoTripSelected } from "@/components/NoTripSelected";
import ProfileCard from "@/app/mypage/_components/ProfileCard";
import PedometerChart from "@/app/mypage/_components/PedometerChart";
import FlightScheduleSection from "@/app/mypage/_components/FlightScheduleSection";
import PastTripCard from "@/app/mypage/_components/PastTripCard";
import { fetchPastTrips } from "@/app/api/mypage";
import type { PastTrip } from "@/app/mypage/types";

const MyPage = () => {
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const { currentTrip } = useTrip();

  const { data: pastTrips = [], isLoading } = useQuery<PastTrip[]>({
    queryKey: ["pastTrips", userId],
    queryFn: () => fetchPastTrips(userId),
    enabled: !!userId,
  });

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">마이페이지</h1>
          <p className="text-text-secondary text-sm mt-1">내 여행 기록을 한눈에 확인하세요</p>
        </div>

        <ProfileCard />

        {currentTrip ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PedometerChart tripId={currentTrip.id} />
            <FlightScheduleSection tripId={currentTrip.id} />
          </div>
        ) : (
          <NoTripSelected />
        )}

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">지난 여행</h2>
          {isLoading ? (
            <p className="text-text-secondary text-sm text-center py-8">불러오는 중...</p>
          ) : pastTrips.length === 0 ? (
            <p className="text-text-secondary text-sm text-center py-8">
              아직 종료된 여행이 없어요.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              {pastTrips.map((trip) => (
                <PastTripCard key={trip.id} trip={trip} userId={userId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
};

export default MyPage;
