import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import SavingsIcon from "@mui/icons-material/Savings";
import BudgetCard from "../../_components/Components/BudgetCard";
import { ExchangeRateData } from "../types";
import { formatKRW } from "../data";

const BUDGET_CARDS = [
  {
    title: "총 여행 예산",
    key: "total" as const,
    Icon: AccountBalanceWalletIcon,
    bg: "bg-primary hover:bg-blue-900 transition",
    text: "text-white",
    sub: "text-blue-200",
  },
  {
    title: "현재까지 지출",
    key: "spent" as const,
    Icon: TrendingDownIcon,
    bg: "bg-white",
    text: "text-[#0F172A]",
    sub: "text--text-secondary",
  },
  {
    title: "남은 예산",
    key: "remaining" as const,
    Icon: SavingsIcon,
    bg: "bg-[#1AB28E]",
    text: "text-white",
    sub: "text-emerald-100",
  },
];

interface BudgetSummaryCardsProps {
  budgetValues: Record<string, number>;
  totalBudgetKRW: number | null;
  spentPercent: number;
  remaining: number;
  exchangeRate: ExchangeRateData | null;
  onTotalClick: () => void;
}

export default function BudgetSummaryCards({
  budgetValues,
  totalBudgetKRW,
  spentPercent,
  remaining,
  exchangeRate,
  onTotalClick,
}: BudgetSummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {BUDGET_CARDS.map(({ title, key, Icon, bg, text, sub }) => (
        <div
          key={key}
          onClick={key === "total" ? onTotalClick : undefined}
          className={key === "total" ? "cursor-pointer" : undefined}
        >
          <BudgetCard
            bgColor={bg}
            title={title}
            titleColor={sub}
            icon={
              <div className={`flex justify-center items-center p-2 rounded-full ${key === "spent" ? "bg-slate-100" : "bg-white/20"}`}>
                <Icon
                  className={key === "spent" ? "text--text-secondary" : "text-white"}
                  fontSize="small"
                />
              </div>
            }
            content={
              <>
                <p className={`text-2xl font-bold ${text}`}>
                  {key === "total" && totalBudgetKRW === null
                    ? "미정"
                    : formatKRW(budgetValues[key])}
                </p>
                {key === "total" && (
                  <p className="text-sm text-blue-200 mt-1">
                    {totalBudgetKRW !== null ? "탭하여 예산 수정" : "탭하여 예산 설정"}
                  </p>
                )}
                {key === "spent" && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text--text-secondary mb-1">
                      <span>사용률</span>
                      <span>{spentPercent.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${spentPercent}%` }}
                      />
                    </div>
                  </div>
                )}
                {key === "remaining" && (
                  <p className="text-sm text-emerald-100 mt-1">
                    {exchangeRate
                      ? `≈ ฿${Math.round(remaining * exchangeRate.rate).toLocaleString()}`
                      : "환율 로딩 중..."}
                  </p>
                )}
              </>
            }
          />
        </div>
      ))}
    </div>
  );
}
