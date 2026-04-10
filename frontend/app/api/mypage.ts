import type { PastTrip, StepEntry, Flight, AddFlightForm, AddStepsForm } from "@/app/mypage/types";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/mypage`;
const TRIPS_API = `${process.env.NEXT_PUBLIC_API_URL}/api/trips`;

const tripHeaders = (tripId: number) => ({
  "Content-Type": "application/json",
  "x-trip-id": String(tripId),
});

const userHeaders = (userId: string) => ({
  "Content-Type": "application/json",
  "x-user-id": userId,
});

export const calcDurationMinutes = (dep: string, arr: string): number => {
  const [dh, dm] = dep.split(":").map(Number);
  const [ah, am] = arr.split(":").map(Number);
  const diff = ah * 60 + am - (dh * 60 + dm);
  return diff < 0 ? diff + 24 * 60 : diff;
};

export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}시간 ${m}분` : `${h}시간`;
};

export const fetchPastTrips = async (userId: string): Promise<PastTrip[]> => {
  const res = await fetch(`${API}/past-trips`, { headers: userHeaders(userId) });
  if (!res.ok) throw new Error("지난 여행 목록을 불러오지 못했습니다.");
  return res.json();
};

export const saveTripMemo = async (userId: string, tripId: number, memo: string): Promise<void> => {
  const res = await fetch(`${TRIPS_API}/${tripId}/memo`, {
    method: "PUT",
    headers: { ...userHeaders(userId) },
    body: JSON.stringify({ memo }),
  });
  if (!res.ok) throw new Error("메모 저장에 실패했습니다.");
};

export const fetchSteps = async (tripId: number): Promise<StepEntry[]> => {
  const res = await fetch(`${API}/steps`, { headers: tripHeaders(tripId) });
  if (!res.ok) throw new Error("걸음 수 데이터를 불러오지 못했습니다.");
  return res.json();
};

export const saveStep = async (tripId: number, data: AddStepsForm): Promise<StepEntry> => {
  const res = await fetch(`${API}/steps`, {
    method: "POST",
    headers: tripHeaders(tripId),
    body: JSON.stringify({ date: data.date, count: data.count, memo: data.memo }),
  });
  if (!res.ok) throw new Error("걸음 수 저장에 실패했습니다.");
  return res.json();
};

export const updateStep = async (tripId: number, id: number, data: AddStepsForm): Promise<StepEntry> => {
  const res = await fetch(`${API}/steps/${id}`, {
    method: "PUT",
    headers: tripHeaders(tripId),
    body: JSON.stringify({ date: data.date, count: data.count, memo: data.memo }),
  });
  if (!res.ok) throw new Error("걸음 수 수정에 실패했습니다.");
  return res.json();
};

export const deleteStep = async (tripId: number, id: number): Promise<void> => {
  await fetch(`${API}/steps/${id}`, {
    method: "DELETE",
    headers: tripHeaders(tripId),
  });
};

export const fetchFlights = async (tripId: number): Promise<Flight[]> => {
  const res = await fetch(`${API}/flights`, { headers: tripHeaders(tripId) });
  if (!res.ok) throw new Error("항공편 정보를 불러오지 못했습니다.");
  return res.json();
};

export const createFlight = async (tripId: number, data: AddFlightForm): Promise<Flight> => {
  const res = await fetch(`${API}/flights`, {
    method: "POST",
    headers: tripHeaders(tripId),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("항공편 추가에 실패했습니다.");
  return res.json();
};

export const updateFlight = async (tripId: number, id: number, data: AddFlightForm): Promise<Flight> => {
  const res = await fetch(`${API}/flights/${id}`, {
    method: "PUT",
    headers: tripHeaders(tripId),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("항공편 수정에 실패했습니다.");
  return res.json();
};

export const deleteFlight = async (tripId: number, id: number): Promise<void> => {
  await fetch(`${API}/flights/${id}`, {
    method: "DELETE",
    headers: tripHeaders(tripId),
  });
};
