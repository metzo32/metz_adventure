import { ExchangeRateData } from "../budget/types";

export const fetchExchangeRate = async (): Promise<ExchangeRateData> => {
  const res = await fetch("https://api.exchangerate-api.com/v4/latest/KRW", {
    next: { revalidate: 3600 },
  });
  if (!res.ok) throw new Error("환율 정보를 가져올 수 없습니다.");
  const data = await res.json();
  return {
    rate: data.rates.THB as number,
    updatedAt: new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" }),
  };
};
