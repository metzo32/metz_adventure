"use client";

import { createContext, useContext, useState, useEffect } from "react";
import type { Trip } from "@/app/trips/types";

type TripContextType = {
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip | null) => void;
};

const TripContext = createContext<TripContextType>({
  currentTrip: null,
  setCurrentTrip: () => {},
});

export const TripProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentTrip, setCurrentTripState] = useState<Trip | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("currentTrip");
    if (saved) {
      try {
        setCurrentTripState(JSON.parse(saved));
      } catch {
        localStorage.removeItem("currentTrip");
      }
    }
  }, []);

  const setCurrentTrip = (trip: Trip | null) => {
    setCurrentTripState(trip);
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
