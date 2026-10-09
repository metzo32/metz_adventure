const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type RegisterPayload = {
  email: string;
  password: string;
  name: string;
};

export const registerUser = async (payload: RegisterPayload) => {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "회원가입에 실패했습니다.");
  }

  return res.json();
};

export const fetchLastTripId = async (userId: string): Promise<number | null> => {
  const res = await fetch(`${API_URL}/api/auth/me`, {
    headers: { "x-user-id": userId },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.last_trip_id ?? null;
};

export const updateLastTripId = async (userId: string, tripId: number): Promise<void> => {
  await fetch(`${API_URL}/api/auth/last-trip`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", "x-user-id": userId },
    body: JSON.stringify({ tripId }),
  });
};
