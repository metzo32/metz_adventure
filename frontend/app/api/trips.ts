import type { Trip, InviteCode } from "@/app/trips/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const headers = (userId: string) => ({
  "Content-Type": "application/json",
  "x-user-id": userId,
});

export const fetchMyTrips = async (userId: string): Promise<Trip[]> => {
  const res = await fetch(`${API_URL}/api/trips`, { headers: headers(userId) });
  if (!res.ok) throw new Error("여행 목록을 불러오지 못했습니다.");
  return res.json();
};

export const createTrip = async (
  userId: string,
  payload: { name: string; description: string; country: string; city: string; start_date: string; end_date: string }
): Promise<Trip> => {
  const res = await fetch(`${API_URL}/api/trips`, {
    method: "POST",
    headers: headers(userId),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "여행 생성에 실패했습니다.");
  }
  return res.json();
};

export const generateInviteCode = async (
  userId: string,
  tripId: number
): Promise<InviteCode> => {
  const res = await fetch(`${API_URL}/api/trips/${tripId}/invite`, {
    method: "POST",
    headers: headers(userId),
  });
  if (!res.ok) throw new Error("초대 코드 생성에 실패했습니다.");
  return res.json();
};

export const deleteTrip = async (userId: string, tripId: number): Promise<void> => {
  const res = await fetch(`${API_URL}/api/trips/${tripId}`, {
    method: "DELETE",
    headers: headers(userId),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "여행 삭제에 실패했습니다.");
  }
};

export const acceptInviteCode = async (
  userId: string,
  code: string
): Promise<Trip> => {
  const res = await fetch(`${API_URL}/api/trips/invite/accept`, {
    method: "POST",
    headers: headers(userId),
    body: JSON.stringify({ code }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "초대 코드 사용에 실패했습니다.");
  }
  return res.json();
};
