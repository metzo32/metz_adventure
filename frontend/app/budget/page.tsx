"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useTrip } from "@/app/contexts/TripContext";
import { fetchExpenses, createExpense, deleteExpense, fetchExchangeRate } from "../api/budget";
import { TOTAL_BUDGET_KRW, CATEGORIES, CATEGORY_COLORS } from "./data";
import type { AddExpenseForm } from "./types";
import BudgetSummaryCards from "./_components/BudgetSummaryCards";
import QuickActions from "./_components/QuickActions";
import TransactionTable from "./_components/TransactionTable";
import ExchangeRateCard from "./_components/ExchangeRateCard";
import CategoryStats from "./_components/CategoryStats";
import AddExpenseModal from "./_components/AddExpenseModal";
import { PageContainer } from "@/components/PageContainer";
import { NoTripSelected } from "@/components/NoTripSelected";
import { COUNTRIES } from "@/app/trips/data/constants";

const DEFAULT_FORM: AddExpenseForm = {
  category: "식비",
  description: "",
  amountKRW: "",
};

export default function BudgetPage() {
  const { currentTrip } = useTrip();
  const tripId = currentTrip?.id;
  const queryClient = useQueryClient();

  const { data: transactions = [] } = useQuery({
    queryKey: ["expenses", tripId],
    queryFn: () => fetchExpenses(tripId!),
    enabled: !!tripId,
  });

  const countryInfo = COUNTRIES.find((c) => c.value === currentTrip?.country);
  const currencyCode = countryInfo?.currency ?? "THB";
  const currencyName = countryInfo?.currencyName ?? "바트";

  const { data: exchangeRate, isLoading: rateLoading, error: rateError, refetch: refetchRate } = useQuery({
    queryKey: ["exchangeRate", currencyCode],
    queryFn: () => fetchExchangeRate(currencyCode),
    staleTime: 1000 * 60 * 60,
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["expenses", tripId] });

  const createMutation = useMutation({
    mutationFn: (data: Parameters<typeof createExpense>[1]) => createExpense(tripId!, data),
    onSuccess: invalidate,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteExpense,
    onSuccess: invalidate,
  });

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<AddExpenseForm>(DEFAULT_FORM);

  const totalSpent = useMemo(
    () => transactions.filter((t) => t.status === "완료").reduce((sum, t) => sum + t.amountKRW, 0),
    [transactions]
  );
  const remaining = TOTAL_BUDGET_KRW - totalSpent;
  const spentPercent = Math.min((totalSpent / TOTAL_BUDGET_KRW) * 100, 100);

  const categoryStats = useMemo(
    () =>
      CATEGORIES.map((name) => ({
        name,
        color: CATEGORY_COLORS[name] ?? "#6B7280",
        amountKRW: transactions
          .filter((t) => t.category === name && t.status === "완료")
          .reduce((sum, t) => sum + t.amountKRW, 0),
      })),
    [transactions]
  );

  const budgetValues = { total: TOTAL_BUDGET_KRW, spent: totalSpent, remaining };

  const handleRefreshRate = () => refetchRate();

  const handleOpenModal = () => {
    setForm(DEFAULT_FORM);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleQuickAction = (key: string) => {
    if (key === "add") {
      handleOpenModal();
      return;
    }
    const categoryMap: Record<string, string> = {
      transport: "교통",
      food: "식비",
      shopping: "쇼핑",
      tour: "관광",
    };
    setForm({ ...DEFAULT_FORM, category: categoryMap[key] ?? "기타" });
    setShowModal(true);
  };

  const handleFormCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, category: e.target.value }));
  };

  const handleFormDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, description: e.target.value }));
  };

  const handleFormAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, amountKRW: e.target.value }));
  };

  const handleSubmitExpense = () => {
    const amountKRW = parseInt(form.amountKRW.replace(/,/g, ""), 10);
    if (!form.description.trim() || isNaN(amountKRW) || amountKRW <= 0) return;

    const rate = exchangeRate?.rate ?? 0.026;
    const amountTHB = Math.round(amountKRW * rate);

    createMutation.mutate({
      category: form.category,
      description: form.description,
      amountKRW,
      amountTHB,
      date: new Date().toISOString().split("T")[0],
    });
    setShowModal(false);
  };

  const handleDeleteTransaction = (id: number) => deleteMutation.mutate(id);

  if (!currentTrip) {
    return (
      <PageContainer>
        <h1 className="text-2xl font-bold text-foreground mb-6">예산 관리</h1>
        <NoTripSelected />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">예산 관리</h1>
          <p className="text-text-secondary text-sm mt-1">치앙마이 여행 예산을 한눈에 확인하세요</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <BudgetSummaryCards
              budgetValues={budgetValues}
              spentPercent={spentPercent}
              remaining={remaining}
              exchangeRate={exchangeRate ?? null}
            />
            <QuickActions onAction={handleQuickAction} />
            <TransactionTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          </div>

          <div className="space-y-6">
            <ExchangeRateCard
              exchangeRate={exchangeRate ?? null}
              rateLoading={rateLoading}
              rateError={rateError ? "환율 정보를 불러올 수 없습니다." : null}
              onRefresh={handleRefreshRate}
              currencyCode={currencyCode}
              currencyName={currencyName}
            />
            <CategoryStats
              categoryStats={categoryStats}
              totalSpent={totalSpent}
            />
          </div>
        </div>
      </div>

      {showModal && (
        <AddExpenseModal
          form={form}
          exchangeRate={exchangeRate ?? null}
          onClose={handleCloseModal}
          onSubmit={handleSubmitExpense}
          onCategory={handleFormCategory}
          onDescription={handleFormDescription}
          onAmount={handleFormAmount}
        />
      )}
    </PageContainer>
  );
}
