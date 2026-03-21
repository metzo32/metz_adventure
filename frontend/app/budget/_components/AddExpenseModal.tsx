import CloseIcon from "@mui/icons-material/Close";
import { AddExpenseForm, ExchangeRateData } from "../types";
import { CATEGORIES } from "../data";

interface AddExpenseModalProps {
  form: AddExpenseForm;
  exchangeRate: ExchangeRateData | null;
  onClose: () => void;
  onSubmit: () => void;
  onCategory: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onDescription: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAmount: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function AddExpenseModal({
  form,
  exchangeRate,
  onClose,
  onSubmit,
  onCategory,
  onDescription,
  onAmount,
}: AddExpenseModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-[#0F172A]">지출 추가</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-[#64748B] transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">카테고리</label>
            <select
              value={form.category}
              onChange={onCategory}
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0832A4] bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">내용</label>
            <input
              type="text"
              value={form.description}
              onChange={onDescription}
              placeholder="지출 내용을 입력하세요"
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0832A4]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F172A] mb-1.5">금액 (원)</label>
            <input
              type="number"
              value={form.amountKRW}
              onChange={onAmount}
              placeholder="금액을 입력하세요"
              className="w-full border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#0832A4]"
            />
            {form.amountKRW && exchangeRate && !isNaN(parseInt(form.amountKRW)) && (
              <p className="text-xs text-[#1AB28E] mt-1">
                ≈ ฿{Math.round(parseInt(form.amountKRW) * exchangeRate.rate).toLocaleString()} THB
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 border border-[#E2E8F0] rounded-xl text-sm font-medium text-[#64748B] hover:bg-slate-50 transition-colors cursor-pointer"
          >
            취소
          </button>
          <button
            onClick={onSubmit}
            disabled={!form.description || !form.amountKRW}
            className="flex-1 py-2.5 bg-[#0832A4] rounded-xl text-sm font-medium text-white hover:bg-blue-900 transition-colors disabled:opacity-50 cursor-pointer"
          >
            추가하기
          </button>
        </div>
      </div>
    </div>
  );
}
