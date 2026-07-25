"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { DirectionsWalk, Add, Edit, Delete } from "@mui/icons-material";
import { Button } from "@/components/Button";
import dayjs from "dayjs";
import { fetchSteps, deleteStep } from "@/app/api/mypage";
import type { StepEntry } from "@/app/mypage/types";
import AddStepsModal from "@/app/mypage/_components/AddStepsModal";

type Props = {
  tripId: number;
};

const tooltipFormatter = (value: number | string | undefined) => [
  value != null ? Number(value).toLocaleString() + "걸음" : "-",
  "걸음 수",
];

const PedometerChart = ({ tripId }: Props) => {
  const queryClient = useQueryClient();
  const [addOpen, setAddOpen] = useState(false);
  const [editStep, setEditStep] = useState<StepEntry | null>(null);

  const { data: steps = [] } = useQuery<StepEntry[]>({
    queryKey: ["steps", tripId],
    queryFn: () => fetchSteps(tripId),
    enabled: !!tripId,
  });

  const { mutate: handleDeleteStep } = useMutation({
    mutationFn: (id: number) => deleteStep(tripId, id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["steps", tripId] }),
  });

  const chartData = [...steps]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s) => ({
      date: dayjs(s.date).format("MM/DD"),
      count: s.count,
    }));

  const totalSteps = steps.reduce((sum, s) => sum + s.count, 0);

  const sortedSteps = [...steps].sort((a, b) => b.date.localeCompare(a.date));

  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleEditOpen = (step: StepEntry) => setEditStep(step);
  const handleEditClose = () => setEditStep(null);

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

      {sortedSteps.length > 0 && (
        <div className="flex flex-col gap-2">
          {sortedSteps.map((step) => {
            const handleEdit = () => handleEditOpen(step);
            const handleDelete = () => handleDeleteStep(step.id);

            return (
              <div
                key={step.id}
                className="flex items-center justify-between border border-border rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {dayjs(step.date).format("M월 D일 (ddd)")}
                  </p>
                  <p className="text-xs text-text-secondary">{step.count.toLocaleString()}걸음{step.memo ? ` · ${step.memo}` : ""}</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleEdit}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-lighter transition-colors"
                  >
                    <Edit sx={{ fontSize: 14, color: "#64748B" }} />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Delete sx={{ fontSize: 14, color: "#EF4444" }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AddStepsModal open={addOpen} onClose={handleAddClose} tripId={tripId} />
      <AddStepsModal open={!!editStep} onClose={handleEditClose} tripId={tripId} editStep={editStep} />
    </div>
  );
};

export default PedometerChart;
