"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { fetchMyTrips } from "@/app/api/trips";
import { fetchLastTripId, updateLastTripId } from "@/app/api/auth";
import type { Trip } from "@/app/trips/types";

type TripContextType = {
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
};

const TripContext = createContext<TripContextType>({
  currentTrip: null,
  setCurrentTrip: () => { },
});

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [tripState, setTripState] = useState<Trip | null>(null);
  const { data: session } = useSession();
  const userId = (session?.user as { id?: string })?.id ?? "";
  const isLoggedIn = !!session;

  const { data: trips = [] } = useQuery({
    queryKey: ["trips", userId],
    queryFn: () => fetchMyTrips(userId),
    enabled: !!userId,
  });

  const { data: lastTripId } = useQuery({
    queryKey: ["last-trip-id", userId],
    queryFn: () => fetchLastTripId(userId),
    enabled: !!userId,
  });

  const persistedTrip = lastTripId != null
    ? (trips.find((t) => t.id === lastTripId) ?? null)
    : null;

  const mostRecentTrip = trips.length > 0
    ? [...trips].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
    : null;

  const currentTrip = isLoggedIn ? (tripState ?? persistedTrip ?? mostRecentTrip) : null;

  const setCurrentTrip = (trip: Trip | null) => {
    setTripState(trip);
    if (trip && userId) {
      updateLastTripId(userId, trip.id);
    }
  };

  return (
    <TripContext.Provider value={{ currentTrip, setCurrentTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
