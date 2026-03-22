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
