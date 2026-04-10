"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTrip } from "@/app/contexts/TripContext";
import { FlightTakeoff, FlightLand, Add, Edit, Delete, AccessTime } from "@mui/icons-material";
import { Button } from "@/components/Button";
import { fetchFlights, deleteFlight, calcDurationMinutes, formatDuration } from "@/app/api/mypage";
import { getTimeDiffFromKst } from "@/components/Time";
import AddFlightModal from "@/app/mypage/_components/AddFlightModal";
import { COUNTRIES } from "@/app/trips/data/constants";
import type { Flight } from "@/app/mypage/types";

type Props = {
  tripId: number;
};

const FLIGHT_TYPE_LABELS: Record<string, string> = {
  outbound: "가는 비행",
  return: "오는 비행",
};

const FlightScheduleSection = ({ tripId }: Props) => {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editFlight, setEditFlight] = useState<Flight | null>(null);

  const { currentTrip } = useTrip();
  const countryInfo = COUNTRIES.find((c) => c.value === currentTrip?.country);
  const destTimezone = countryInfo?.timezone ?? "Asia/Bangkok";
  const timeDiff = currentTrip ? getTimeDiffFromKst(destTimezone) : 0;

  const { data: flights = [] } = useQuery<Flight[]>({
    queryKey: ["flights", tripId],
    queryFn: () => fetchFlights(tripId),
    enabled: !!tripId,
  });

  const { mutate: handleDeleteFlight } = useMutation({
    mutationFn: (id: number) => deleteFlight(tripId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flights", tripId] }),
  });

  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleEditOpen = (flight: Flight) => setEditFlight(flight);
  const handleEditClose = () => setEditFlight(null);
  const handleDelete = (id: number) => handleDeleteFlight(id);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-lighter flex items-center justify-center">
            <FlightTakeoff sx={{ fontSize: 18, color: "#0832A4" }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">비행 시간표</h3>
            <p className="text-text-secondary text-xs">현재 여행 항공편</p>
          </div>
        </div>
        <Button mode="light" onClick={handleAddOpen}>
          <span className="flex items-center gap-1">
            <Add sx={{ fontSize: 16 }} />
            항공편 추가
          </span>
        </Button>
      </div>

      {flights.length === 0 ? (
        <div className="flex items-center justify-center h-32 text-text-secondary text-sm">
          등록된 항공편이 없어요
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {flights.map((flight) => {
            const rawDuration = calcDurationMinutes(flight.departure_time, flight.arrival_time);
            const durationMin = flight.type === "outbound"
              ? rawDuration - timeDiff * 60
              : rawDuration + timeDiff * 60;
            const isOutbound = flight.type === "outbound";
            const handleEdit = () => handleEditOpen(flight);
            const handleDeleteClick = () => handleDelete(flight.id);

            return (
              <div
                key={flight.id}
                className="border border-border rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${isOutbound
                        ? "bg-lighter text-primary"
                        : "bg-green-50 text-green-600"
                      }`}
                  >
                    {isOutbound ? (
                      <FlightTakeoff sx={{ fontSize: 12, mr: 0.5 }} />
                    ) : (
                      <FlightLand sx={{ fontSize: 12, mr: 0.5 }} />
                    )}
                    {FLIGHT_TYPE_LABELS[flight.type]}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={handleEdit}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-lighter transition-colors"
                    >
                      <Edit sx={{ fontSize: 14, color: "#64748B" }} />
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Delete sx={{ fontSize: 14, color: "#EF4444" }} />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{flight.departure_time}</p>
                    <p className="text-xs text-text-secondary">{flight.departure_place}</p>
                  </div>

                  <div className="flex-1 flex flex-col items-center px-3 gap-1">
                    <div className="flex items-center gap-1 text-text-secondary">
                      <AccessTime sx={{ fontSize: 12 }} />
                      <span className="text-xs">{formatDuration(durationMin)}</span>
                    </div>
                    <div className="w-full flex items-center gap-1">
                      <div className="h-px flex-1 bg-border" />
                      <FlightTakeoff sx={{ fontSize: 12, color: "#94A3B8" }} />
                      <div className="h-px flex-1 bg-border" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold text-foreground">{flight.arrival_time}</p>
                    <p className="text-xs text-text-secondary">{flight.arrival_place}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddFlightModal open={addOpen} onClose={handleAddClose} tripId={tripId} />
      <AddFlightModal open={!!editFlight} onClose={handleEditClose} tripId={tripId} editFlight={editFlight} />
    </div>
  );
};

export default FlightScheduleSection;
