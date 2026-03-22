export type TransactionStatus = "완료" | "대기" | "취소";

export type Transaction = {
  id: number;
  category: string;
  description: string;
  date: string;
  amountKRW: number;
  amountTHB: number;
  status: TransactionStatus;
};

export type CategoryStat = {
  name: string;
  amountKRW: number;
  color: string;
};

export type ExchangeRateData = {
  rate: number;
  updatedAt: string;
};

export type AddExpenseForm = {
  category: string;
  description: string;
  amountForeign: string;
  amountKRW: string;
};
