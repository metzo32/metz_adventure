"use client";

import { createContext, useContext, useState } from "react";
import { useSession } from "next-auth/react";
import type { Trip } from "@/app/trips/types";

type TripContextType = {
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
};

const TripContext = createContext<TripContextType>({
  currentTrip: null,
  setCurrentTrip: () => { },
});

const loadTripFromStorage = (): Trip | null => {
  if (typeof window === "undefined") return null;
  const saved = localStorage.getItem("currentTrip");
  if (!saved) return null;
  try {
    return JSON.parse(saved);
  } catch {
    localStorage.removeItem("currentTrip");
    return null;
  }
};

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [tripState, setTripState] = useState<Trip | null>(loadTripFromStorage);
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const currentTrip = isLoggedIn ? tripState : null;

  const setCurrentTrip = (trip: Trip | null) => {
    setTripState(trip);
    if (trip) {
      localStorage.setItem("currentTrip", JSON.stringify(trip));
    } else {
      localStorage.removeItem("currentTrip");
    }
  };

  return (
    <TripContext.Provider value={{ currentTrip, setCurrentTrip }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => useContext(TripContext);
