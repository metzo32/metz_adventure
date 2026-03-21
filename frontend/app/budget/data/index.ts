import { Transaction, CategoryStat } from "../types";

export const formatKRW = (amount: number) =>
  amount.toLocaleString("ko-KR") + "원";

export const formatTHB = (amount: number) =>
  "฿" + amount.toLocaleString("th-TH");

export const TOTAL_BUDGET_KRW = 3_000_000;

export const CATEGORY_COLORS: Record<string, string> = {
  식비: "#1AB28E",
  교통: "#0832A4",
  숙박: "#F59E0B",
  쇼핑: "#EF4444",
  관광: "#8B5CF6",
  기타: "#6B7280",
};

export const CATEGORIES = ["식비", "교통", "숙박", "쇼핑", "관광", "기타"];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 1,
    category: "식비",
    description: "님만해민 레스토랑",
    date: "2026-05-01",
    amountKRW: 45_000,
    amountTHB: 1_170,
    status: "완료",
  },
  {
    id: 2,
    category: "교통",
    description: "그랩 택시",
    date: "2026-05-01",
    amountKRW: 12_000,
    amountTHB: 312,
    status: "완료",
  },
  {
    id: 3,
    category: "숙박",
    description: "호스텔 체크인 (3박)",
    date: "2026-05-02",
    amountKRW: 180_000,
    amountTHB: 4_680,
    status: "완료",
  },
  {
    id: 4,
    category: "쇼핑",
    description: "나이트 바자 마켓",
    date: "2026-05-02",
    amountKRW: 65_000,
    amountTHB: 1_690,
    status: "완료",
  },
  {
    id: 5,
    category: "관광",
    description: "도이수텝 사원 투어",
    date: "2026-05-03",
    amountKRW: 35_000,
    amountTHB: 910,
    status: "대기",
  },
  {
    id: 6,
    category: "식비",
    description: "올드타운 카페 브런치",
    date: "2026-05-03",
    amountKRW: 28_000,
    amountTHB: 728,
    status: "완료",
  },
  {
    id: 7,
    category: "교통",
    description: "쏭태우 (빨간 버스)",
    date: "2026-05-04",
    amountKRW: 8_000,
    amountTHB: 208,
    status: "완료",
  },
  {
    id: 8,
    category: "기타",
    description: "약국 구매",
    date: "2026-05-04",
    amountKRW: 15_000,
    amountTHB: 390,
    status: "취소",
  },
];

export const INITIAL_CATEGORY_STATS: CategoryStat[] = [
  { name: "식비", amountKRW: 350_000, color: "#1AB28E" },
  { name: "교통", amountKRW: 120_000, color: "#0832A4" },
  { name: "숙박", amountKRW: 600_000, color: "#F59E0B" },
  { name: "쇼핑", amountKRW: 180_000, color: "#EF4444" },
  { name: "관광", amountKRW: 100_000, color: "#8B5CF6" },
  { name: "기타", amountKRW: 50_000, color: "#6B7280" },
];
