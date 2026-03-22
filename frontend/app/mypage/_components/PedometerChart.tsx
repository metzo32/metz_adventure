"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DirectionsWalk, Add } from "@mui/icons-material";
import { Button } from "@/components/Button";
import dayjs from "dayjs";
import { fetchSteps } from "@/app/api/mypage";
import type { StepEntry } from "@/app/mypage/types";
import AddStepsModal from "@/app/mypage/_components/AddStepsModal";

type Props = {
  tripId: number;
};

const tooltipFormatter = (value: number) => [value.toLocaleString() + "걸음", "걸음 수"];

const PedometerChart = ({ tripId }: Props) => {
  const [addOpen, setAddOpen] = useState(false);

  const { data: steps = [] } = useQuery<StepEntry[]>({
    queryKey: ["steps", tripId],
    queryFn: () => fetchSteps(tripId),
    enabled: !!tripId,
  });

  const chartData = [...steps]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({
      date: dayjs(s.date).format("MM/DD"),
      count: s.count,
    }));

  const totalSteps = steps.reduce((sum, s) => sum + s.count, 0);

  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-lighter flex items-center justify-center">
            <DirectionsWalk sx={{ fontSize: 18, color: "#0832A4" }} />
          </div>
          <div>
            <h3 className="font-semibold text-foreground text-sm">만보기</h3>
            <p className="text-text-secondary text-xs">
              총 {totalSteps.toLocaleString()}걸음
            </p>
          </div>
        </div>
        <Button mode="light" onClick={handleAddOpen}>
          <span className="flex items-center gap-1">
            <Add sx={{ fontSize: 16 }} />
            걸음 수 추가
          </span>
        </Button>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-40 text-text-secondary text-sm">
          아직 기록된 걸음 수가 없어요
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#64748B" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip formatter={tooltipFormatter} />
            <Bar dataKey="count" fill="#0832A4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      <AddStepsModal open={addOpen} onClose={handleAddClose} tripId={tripId} />
    </div>
  );
};

export default PedometerChart;
