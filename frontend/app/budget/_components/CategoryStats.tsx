"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { CategoryStat } from "../types";
import { formatKRW } from "../data";

interface CategoryStatsProps {
  categoryStats: CategoryStat[];
  totalSpent: number;
}

const EMPTY_DATA = [{ value: 1 }];
const EMPTY_COLOR = "#E5E7EB";

export default function CategoryStats({ categoryStats, totalSpent }: CategoryStatsProps) {
  const isEmpty = categoryStats.length === 0 || totalSpent === 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="text-base font-semibold text-forground mb-4">카테고리별 통계</h2>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            {isEmpty ? (
              <Pie
                data={EMPTY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="value"
                paddingAngle={0}
                isAnimationActive={false}
              >
                <Cell fill={EMPTY_COLOR} />
              </Pie>
            ) : (
              <Pie
                data={categoryStats}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                dataKey="amountKRW"
                nameKey="name"
                paddingAngle={3}
              >
                {categoryStats.map((stat, index) => (
                  <Cell key={index} fill={stat.color} />
                ))}
              </Pie>
            )}
            {!isEmpty && (
              <Tooltip
                formatter={(value) => [formatKRW(Number(value)), "지출"]}
              />
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 mt-2">
        {categoryStats
          .sort((a, b) => b.amountKRW - a.amountKRW)
          .map((stat) => {
            const pct = totalSpent > 0
              ? Math.round((stat.amountKRW / totalSpent) * 100)
              : 0;
            return (
              <div key={stat.name} className="flex items-center gap-3">
                <div
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: stat.color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-xs font-medium text-forground">{stat.name}</span>
                    <span className="text-xs text-[#64748B]">{pct}%</span>
                  </div>
                  <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: stat.color }}
                    />
                  </div>
                </div>
                <span className="text-xs font-semibold text-forground whitespace-nowrap">
                  {(stat.amountKRW / 10000).toFixed(0)}만원
                </span>
              </div>
            );
          })}
      </div>

      <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex justify-between items-center">
        <span className="text-sm text-[#64748B]">총 지출</span>
        <span className="text-sm font-bold text-[#0832A4]">{formatKRW(totalSpent)}</span>
      </div>
    </div>
  );
}
