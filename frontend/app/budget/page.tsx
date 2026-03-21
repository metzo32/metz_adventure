"use client";

import { useState, useEffect } from "react";
import { Transaction, ExchangeRateData, AddExpenseForm } from "./types";
import {
  TOTAL_BUDGET_KRW,
  INITIAL_TRANSACTIONS,
  INITIAL_CATEGORY_STATS,
} from "./data";
import { fetchExchangeRate } from "../api/budget";
import BudgetSummaryCards from "./_components/BudgetSummaryCards";
import QuickActions from "./_components/QuickActions";
import TransactionTable from "./_components/TransactionTable";
import ExchangeRateCard from "./_components/ExchangeRateCard";
import CategoryStats from "./_components/CategoryStats";
import AddExpenseModal from "./_components/AddExpenseModal";
import { PageContainer } from "@/components/PageContainer";

const DEFAULT_FORM: AddExpenseForm = {
  category: "식비",
  description: "",
  amountKRW: "",
};

export default function BudgetPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [exchangeRate, setExchangeRate] = useState<ExchangeRateData | null>(null);
  const [rateLoading, setRateLoading] = useState(true);
  const [rateError, setRateError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<AddExpenseForm>(DEFAULT_FORM);
  const [nextId, setNextId] = useState(INITIAL_TRANSACTIONS.length + 1);

  const totalSpent = transactions
    .filter((t) => t.status === "완료")
    .reduce((sum, t) => sum + t.amountKRW, 0);
  const remaining = TOTAL_BUDGET_KRW - totalSpent;
  const spentPercent = Math.min((totalSpent / TOTAL_BUDGET_KRW) * 100, 100);

  const categoryStats = INITIAL_CATEGORY_STATS.map((stat) => ({
    ...stat,
    amountKRW:
      transactions
        .filter((t) => t.category === stat.name && t.status === "완료")
        .reduce((sum, t) => sum + t.amountKRW, 0) || stat.amountKRW,
  }));

  const budgetValues: Record<string, number> = {
    total: TOTAL_BUDGET_KRW,
    spent: totalSpent,
    remaining,
  };

  const loadRate = async () => {
    setRateLoading(true);
    setRateError(null);
    try {
      const data = await fetchExchangeRate();
      setExchangeRate(data);
    } catch {
      setRateError("환율 정보를 불러올 수 없습니다.");
    } finally {
      setRateLoading(false);
    }
  };

  useEffect(() => {
    loadRate();
  }, []);

  const handleRefreshRate = () => {
    loadRate();
  };

  const handleOpenModal = () => {
    setForm(DEFAULT_FORM);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

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

    const newTransaction: Transaction = {
      id: nextId,
      category: form.category,
      description: form.description,
      date: new Date().toISOString().split("T")[0],
      amountKRW,
      amountTHB,
      status: "완료",
    };

    setTransactions((prev) => [newTransaction, ...prev]);
    setNextId((prev) => prev + 1);
    setShowModal(false);
  };

  const handleDeleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

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
              exchangeRate={exchangeRate}
            />
            <QuickActions onAction={handleQuickAction} />
            <TransactionTable
              transactions={transactions}
              onDelete={handleDeleteTransaction}
            />
          </div>

          <div className="space-y-6">
            <ExchangeRateCard
              exchangeRate={exchangeRate}
              rateLoading={rateLoading}
              rateError={rateError}
              onRefresh={handleRefreshRate}
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
          exchangeRate={exchangeRate}
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
