"use client";

import { useState } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import { ExchangeRateData } from "../types";
import InputPreset from "../../_components/Components/InputPreset";

interface ExchangeRateCardProps {
  exchangeRate: ExchangeRateData | null;
  rateLoading: boolean;
  rateError: string | null;
  onRefresh: () => void;
}

export default function ExchangeRateCard({
  exchangeRate,
  rateLoading,
  rateError,
  onRefresh,
}: ExchangeRateCardProps) {
  const [converterInput, setConverterInput] = useState("");
  const [direction, setDirection] = useState<"thb-to-krw" | "krw-to-thb">("thb-to-krw");

  const handleConverterInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConverterInput(e.target.value);
  };

  const handleToggleDirection = () => {
    setDirection((prev) => (prev === "thb-to-krw" ? "krw-to-thb" : "thb-to-krw"));
    setConverterInput("");
  };

  const thbPerKrw = exchangeRate ? 1 / exchangeRate.rate : null;

  const converterResult =
    converterInput && exchangeRate
      ? direction === "thb-to-krw"
        ? Math.round(parseInt(converterInput.replace(/,/g, ""), 10) * (thbPerKrw ?? 0))
        : Math.round(parseInt(converterInput.replace(/,/g, ""), 10) * exchangeRate.rate)
      : null;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CurrencyExchangeIcon className="text-primary" fontSize="small" />
          <h2 className="text-base font-semibold text-foreground">원화 / 바트 환율</h2>
        </div>
        <button
          onClick={onRefresh}
          disabled={rateLoading}
          className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors text-text-secondary cursor-pointer disabled:opacity-50"
        >
          <RefreshIcon fontSize="small" className={rateLoading ? "animate-spin" : ""} />
        </button>
      </div>

      {rateError ? (
        <p className="text-sm text-red-500">{rateError}</p>
      ) : rateLoading ? (
        <div className="space-y-2 animate-pulse">
          <div className="h-8 bg-slate-100 rounded-lg w-3/4" />
          <div className="h-5 bg-slate-100 rounded-lg w-1/2" />
        </div>
      ) : exchangeRate ? (
        <>
          <div className="bg-lighter rounded-xl p-4 mb-3">
            <p className="text-xs text-text-secondary mb-1">1 THB =</p>
            <p className="text-3xl font-bold text-primary">
              {thbPerKrw?.toFixed(1)}
              <span className="text-base font-medium ml-1">원</span>
            </p>
            <p className="text-xs text-text-secondary mt-1">
              1 KRW = ฿{exchangeRate.rate.toFixed(4)}
            </p>
          </div>

          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <SwapHorizIcon fontSize="small" className="text-text-secondary" />
                <span className="text-xs font-medium text-text-secondary">빠른 환산</span>
              </div>
              <button
                onClick={handleToggleDirection}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-lighter text-xs font-medium text-primary hover:bg-slate-200 transition-colors cursor-pointer"
              >
                <SwapHorizIcon fontSize="small" />
                {direction === "thb-to-krw" ? "THB → KRW" : "KRW → THB"}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <label className="text-xs text-text-secondary block mb-1">
                  {direction === "thb-to-krw" ? "THB (바트)" : "KRW (원)"}
                </label>
                <InputPreset
                  type="number"
                  value={converterInput}
                  onChange={handleConverterInput}
                  placeholder="금액 입력"
                  className="w-full"
                />
              </div>
              <div className="flex-1">
                <label className="text-xs text-text-secondary block mb-1">
                  {direction === "thb-to-krw" ? "KRW (원)" : "THB (바트)"}
                </label>
                <div className="border border-border rounded-lg px-3 py-2 text-sm bg-lighter text-light font-semibold min-h-[38px]">
                  {converterResult !== null && !isNaN(converterResult)
                    ? direction === "thb-to-krw"
                      ? `₩${converterResult.toLocaleString()}`
                      : `฿${converterResult.toLocaleString()}`
                    : "–"}
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-text-secondary mt-2 text-right">
            업데이트: {exchangeRate.updatedAt}
          </p>
        </>
      ) : null}
    </div>
  );
}
