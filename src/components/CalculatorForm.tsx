"use client";

import { CalculatorState } from "../types";
import { Language, translations } from "@/lib/translations";
import { DollarSign, Percent, Truck, ShoppingBag, CreditCard, Globe, Database, Sparkles } from "lucide-react";
import CSVUploader from "./CSVUploader";
import { motion } from "framer-motion";

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
    <div className="space-y-8 glass glass-hover p-8 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full -ml-16 -mt-16" />
      
      {/* CSV Section */}
      <div className="space-y-5 relative z-10">
        <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-emerald-400/80">
          <Database className="w-4 h-4" /> 
          {lang === 'zh' ? '智能数据导入' : 'Smart Import'}
        </label>
        <div className="p-1 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
          <CSVUploader onDataParsed={handleCSVData} lang={lang} />
        </div>
      </div>

      <div className="h-px bg-white/5" />

      {/* Inputs Section */}
      <div className="space-y-8 relative z-10">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
              <DollarSign className="w-4 h-4" /> {t.revenue}
            </label>
            <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 font-mono text-indigo-300 text-sm font-bold">
              ${state.revenue.toLocaleString()}
            </div>
          </div>
          <input
            type="range"
            min="1000"
            max="250000"
            step="1000"
            value={state.revenue}
            onChange={(e) => handleChange("revenue", Number(e.target.value))}
            className="w-full h-2 rounded-lg accent-white"
          />
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-indigo-400">
              <ShoppingBag className="w-4 h-4" /> {t.aov}
            </label>
            <div className="px-3 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 font-mono text-indigo-300 text-sm font-bold">
              ${state.aov}
            </div>
          </div>
          <input
            type="range"
            min="10"
            max="1000"
            step="1"
            value={state.aov}
            onChange={(e) => handleChange("aov", Number(e.target.value))}
            className="w-full h-2 rounded-lg accent-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <Percent className="w-3.5 h-3.5" /> {t.cogs}
              </label>
              <span className="font-mono text-[10px] font-black text-slate-400">{state.cogsPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={state.cogsPercent}
              onChange={(e) => handleChange("cogsPercent", Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                <Truck className="w-3.5 h-3.5" /> {t.shipping}
              </label>
              <span className="font-mono text-[10px] font-black text-slate-400">{state.shippingPercent}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={state.shippingPercent}
              onChange={(e) => handleChange("shippingPercent", Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="space-y-5 p-6 rounded-3xl bg-rose-500/[0.03] border border-rose-500/10">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] text-rose-500">
              <Globe className="w-4 h-4" /> {t.intl}
            </label>
            <div className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-[10px] font-black">
              {state.intlOrderPercent}%
            </div>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.intlOrderPercent}
            onChange={(e) => handleChange("intlOrderPercent", Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Toggles */}
      <div className="grid grid-cols-1 gap-4 relative z-10">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChange("useStripe", !state.useStripe)}
          className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${state.useStripe ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-900/40 border-white/5'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-colors ${state.useStripe ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className={`text-xs font-black uppercase tracking-widest ${state.useStripe ? 'text-indigo-300' : 'text-slate-500'}`}>Stripe Payment</div>
              <div className="text-[10px] font-medium text-slate-400">{state.useStripe ? 'Processing fees active' : 'Internal processing'}</div>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${state.useStripe ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'}`} />
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => handleChange("isShopifyBasic", !state.isShopifyBasic)}
          className={`group flex items-center justify-between p-4 rounded-2xl border transition-all ${state.isShopifyBasic ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900/40 border-white/5'}`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl transition-colors ${state.isShopifyBasic ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div className="text-left">
              <div className={`text-xs font-black uppercase tracking-widest ${state.isShopifyBasic ? 'text-rose-300' : 'text-slate-500'}`}>Shopify Basic</div>
              <div className="text-[10px] font-medium text-slate-400">{state.isShopifyBasic ? 'Platform fees applied' : 'Custom platform'}</div>
            </div>
          </div>
          <div className={`w-2 h-2 rounded-full ${state.isShopifyBasic ? 'bg-rose-400 animate-pulse' : 'bg-slate-700'}`} />
        </motion.button>
      </div>
    </div>
  );
}
