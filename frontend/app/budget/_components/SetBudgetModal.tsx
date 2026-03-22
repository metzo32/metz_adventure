import CloseIcon from "@mui/icons-material/Close";
import { formatKRW } from "../data";

interface SetBudgetModalProps {
  budgetInput: string;
  memberCount: number;
  onClose: () => void;
  onSave: () => void;
  onBudgetInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SetBudgetModal({
  budgetInput,
  memberCount,
  onClose,
  onSave,
  onBudgetInput,
}: SetBudgetModalProps) {
  const parsed = parseInt(budgetInput.replace(/,/g, ""), 10);
  const perPerson =
    !isNaN(parsed) && parsed > 0 && memberCount > 0
      ? Math.round(parsed / memberCount)
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-bold text-foreground">총 예산 설정</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 text-text-secondary transition-colors cursor-pointer"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              총 여행 예산 (원)
            </label>
            <input
              type="number"
              value={budgetInput}
              onChange={onBudgetInput}
              placeholder="금액을 입력하지 않으면 미정으로 저장됩니다"
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-text-secondary">1인당 예산</span>
            <span className="px-3 py-1 rounded-full bg-blue-50 text-primary text-sm font-medium">
              {perPerson !== null ? formatKRW(perPerson) : "미정"}
            </span>
            <span className="text-xs text-text-secondary">({memberCount}명 기준)</span>
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
            onClick={onSave}
            className="flex-1 py-2.5 bg-primary rounded-xl text-sm font-medium text-white hover:bg-blue-900 transition-colors cursor-pointer"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
