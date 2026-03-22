import type { Transaction, ExchangeRateData } from "@/app/budget/types";

const API = `${process.env.NEXT_PUBLIC_API_URL}/api/budget`;

const tripHeaders = (tripId: number) => ({
  "Content-Type": "application/json",
  "x-trip-id": String(tripId),
});

const mapExpense = (row: Record<string, unknown>): Transaction => ({
  id: row.id as number,
  category: row.category as string,
  description: (row.memo as string) ?? "",
  date: (row.date as string) ?? "",
  amountKRW: (row.amount_krw as number) ?? 0,
  amountTHB: (row.amount_thb as number) ?? 0,
  status: "완료" as const,
});

export const fetchExpenses = async (tripId: number): Promise<Transaction[]> => {
  const res = await fetch(`${API}/expenses`, { headers: tripHeaders(tripId) });
  if (!res.ok) throw new Error("지출 내역을 불러오지 못했습니다.");
  const rows = await res.json();
  return rows.map(mapExpense);
};

export const createExpense = async (
  tripId: number,
  data: { category: string; description: string; amountKRW: number; amountTHB: number; date: string }
): Promise<Transaction> => {
  const res = await fetch(`${API}/expenses`, {
    method: "POST",
    headers: tripHeaders(tripId),
    body: JSON.stringify({
      category: data.category,
      memo: data.description,
      amount_krw: data.amountKRW,
      amount_thb: data.amountTHB,
      date: data.date,
    }),
  });
  if (!res.ok) throw new Error("지출 추가에 실패했습니다.");
  return mapExpense(await res.json());
};

export const deleteExpense = async (id: number): Promise<void> => {
  await fetch(`${API}/expenses/${id}`, { method: "DELETE" });
};

export const fetchExchangeRate = async (currencyCode = "THB"): Promise<ExchangeRateData> => {
  const res = await fetch("https://api.exchangerate-api.com/v4/latest/KRW", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("환율 정보를 가져올 수 없습니다.");
  const data = await res.json();
  return {
    rate: (data.rates[currencyCode] as number) ?? 0,
    updatedAt: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
  };
};
