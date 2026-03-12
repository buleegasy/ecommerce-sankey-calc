"use client";

import { CalculatorState } from "../types";
import { Language, translations } from "@/lib/translations";
import { DollarSign, Percent, Truck, ShoppingBag, CreditCard, Globe, Database } from "lucide-react";
import CSVUploader from "./CSVUploader";

interface Props {
  state: CalculatorState;
  setState: (state: CalculatorState) => void;
  lang: Language;
}

export default function CalculatorForm({ state, setState, lang }: Props) {
  const t = translations[lang];

  const handleChange = (key: keyof CalculatorState, value: any) => {
    setState({ ...state, [key]: value });
  };

  const handleCSVData = (revenue: number, aov: number) => {
    setState({
      ...state,
      revenue: Math.round(revenue),
      aov: Math.round(aov * 100) / 100,
    });
  };

  return (
    <div className="space-y-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-6 shadow-2xl">
      {/* CSV Section */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Database className="w-4 h-4 text-emerald-400" /> 
          {lang === 'zh' ? '从 Shopify 导入' : 'Import from Shopify'}
        </label>
        <CSVUploader onDataParsed={handleCSVData} lang={lang} />
      </div>

      <div className="h-px bg-white/5 -mx-6" />

      {/* Inputs Section */}
      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <DollarSign className="w-4 h-4" /> {t.revenue}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="1000"
            max="250000"
            step="1000"
            value={state.revenue}
            onChange={(e) => handleChange("revenue", Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="w-24 text-right font-mono text-indigo-400">${state.revenue.toLocaleString()}</span>
        </div>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <ShoppingBag className="w-4 h-4" /> {t.aov}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="10"
            max="1000"
            step="1"
            value={state.aov}
            onChange={(e) => handleChange("aov", Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span className="w-24 text-right font-mono text-indigo-400">${state.aov}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Percent className="w-4 h-4" /> {t.cogs}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={state.cogsPercent}
              onChange={(e) => handleChange("cogsPercent", Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400"
            />
            <span className="w-12 text-right font-mono text-slate-400">{state.cogsPercent}%</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
            <Truck className="w-4 h-4" /> {t.shipping}
          </label>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="0"
              max="100"
              value={state.shippingPercent}
              onChange={(e) => handleChange("shippingPercent", Number(e.target.value))}
              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-slate-400"
            />
            <span className="w-12 text-right font-mono text-slate-400">{state.shippingPercent}%</span>
          </div>
        </div>
      </div>

      <div className="space-y-4 border-t border-white/5 pt-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-300">
          <Globe className="w-4 h-4" /> {t.intl}
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="0"
            max="100"
            value={state.intlOrderPercent}
            onChange={(e) => handleChange("intlOrderPercent", Number(e.target.value))}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <span className="w-12 text-right font-mono text-rose-400">{state.intlOrderPercent}%</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-white/5 pt-6">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 cursor-pointer">
            <CreditCard className="w-4 h-4" /> {t.useStripe}
          </label>
          <button
            onClick={() => handleChange("useStripe", !state.useStripe)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.useStripe ? 'bg-indigo-600' : 'bg-slate-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.useStripe ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 cursor-pointer">
            <ShoppingBag className="w-4 h-4" /> {t.shopifyBasic}
          </label>
          <button
            onClick={() => handleChange("isShopifyBasic", !state.isShopifyBasic)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.isShopifyBasic ? 'bg-rose-600' : 'bg-slate-700'}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.isShopifyBasic ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
