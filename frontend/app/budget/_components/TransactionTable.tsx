import CloseIcon from "@mui/icons-material/Close";
import { Transaction } from "../types";
import { CATEGORY_COLORS, formatKRW, formatTHB } from "../data";
import { Td } from "@/components/Tags";

const STATUS_STYLES: Record<string, string> = {
  완료: "bg-emerald-100 text-emerald-700",
  대기: "bg-amber-100 text-amber-700",
  취소: "bg-red-100 text-red-600",
};

const TABLE_HEADERS = ["카테고리", "내용", "날짜", "상태", "금액 (KRW)", "금액 (THB)"];

const makeHandleDelete = (onDelete: (id: number) => void, id: number) => () =>
  onDelete(id);

interface TransactionTableProps {
  transactions: Transaction[];
  onDelete: (id: number) => void;
}

export default function TransactionTable({ transactions, onDelete }: TransactionTableProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">최근 지출 내역</h2>
        <span className="text-xs text-text-secondary">총 {transactions.length}건</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              {TABLE_HEADERS.map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-xs font-medium text-text-secondary whitespace-nowrap"
                >
                  {header}
                </th>
              ))}
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="border-t border-border hover:bg-slate-50 transition-colors"
              >
                <Td className="py-3">
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-medium text-white"
                    style={{ backgroundColor: CATEGORY_COLORS[tx.category] }}
                  >
                    {tx.category}
                  </span>
                </Td>
                <Td className="py-3 text-foreground font-medium">{tx.description}</Td>
                <Td className="py-3 text-text-secondary">{tx.date}</Td>
                <Td className="py-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[tx.status]}`}
                  >
                    • {tx.status}
                  </span>
                </Td>
                <Td className="py-3 font-semibold text-foreground">
                  -{formatKRW(tx.amountKRW)}
                </Td>
                <Td className="py-3 text-text-secondary">
                  -{formatTHB(tx.amountTHB)}
                </Td>
                <Td className="py-3">
                  <button
                    onClick={makeHandleDelete(onDelete, tx.id)}
                    className="text-text-secondary hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <CloseIcon fontSize="small" />
                  </button>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
