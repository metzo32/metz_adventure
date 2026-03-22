import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@/components/Button";
import { AddExpenseForm, ExchangeRateData } from "../types";
import { CATEGORIES } from "../data";

interface AddExpenseModalProps {
  form: AddExpenseForm;
  exchangeRate: ExchangeRateData | null;
  currencyCode: string;
  currencyName: string;
  onClose: () => void;
  onSubmit: () => void;
  onCategory: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDescription: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmountForeign: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAutoCalcForeign: () => void;
}

export default function AddExpenseModal({
  form,
  exchangeRate,
  currencyCode,
  currencyName,
  onClose,
  onSubmit,
  onCategory,
  onDescription,
  onAmountForeign,
  onAmount,
  onAutoCalcForeign,
}: AddExpenseModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-foreground">지출 추가</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-text-secondary transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">카테고리</label>
            <select
              value={form.category}
              onChange={onCategory}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">내용</label>
            <input
              type="text"
              value={form.description}
              onChange={onDescription}
              placeholder="지출 내용을 입력하세요"
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              금액 ({currencyName}, {currencyCode})
            </label>
            <input
              type="number"
              value={form.amountForeign}
              onChange={onAmountForeign}
              placeholder={`${currencyName} 금액을 입력하세요`}
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            {exchangeRate && (
              <p className="text-xs text-text-secondary mt-1">
                현재 환율: 1 {currencyCode} ≈ {Math.round(1 / exchangeRate.rate).toLocaleString()}원
              </p>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-foreground">금액 (원)</label>
              <Button
                mode="filter"
                onClick={onAutoCalcForeign}
              >
                자동계산
              </Button>
            </div>
            <input
              type="number"
              value={form.amountKRW}
              onChange={onAmount}
              placeholder="원화 금액 (자동 계산)"
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-text-secondary hover:bg-slate-50 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            disabled={!form.description || !form.amountKRW}
            className="flex-1 py-2.5 bg-primary rounded-xl text-sm font-medium text-white hover:bg-blue-900 transition-colors disabled:opacity-50 cursor-pointer"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
