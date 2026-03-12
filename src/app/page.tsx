"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import CalculatorForm from "@/components/CalculatorForm";
import SankeyChart from "@/components/SankeyChart";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { CalculatorState } from "@/types";
import { calculateSankeyData } from "@/lib/logic";
import { Language, translations } from "@/lib/translations";
import { TrendingDown, HelpCircle, Zap } from "lucide-react";
export default function Home() {
  const [lang, setLang] = useState<Language>('en');
  const [state, setState] = useState<CalculatorState>({
    revenue: 10000,
    aov: 50,
    cogsPercent: 30,
    shippingPercent: 15,
    isShopifyBasic: true,
    useStripe: true,
    intlOrderPercent: 20,
  });

  const t = translations[lang];
  const sankeyData = useMemo(() => calculateSankeyData(state, lang), [state, lang]);

  const netProfitAmount = useMemo(() => {
    const link = sankeyData.links.find(l => l.target === t.profitNode);
    return link ? link.value : 0;
  }, [sankeyData, t.profitNode]);

  const profitMargin = (netProfitAmount / state.revenue) * 100;

  return (
    <main className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-16">
        {/* Navigation / Top Bar */}
        <div className="flex justify-between items-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <TrendingDown className="w-3 h-3" /> {t.alert}
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/live" 
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider hover:bg-indigo-500/20 transition-all"
            >
              <Zap className="w-3 h-3 fill-indigo-400" /> Live Dashboard
            </Link>
            <LanguageSwitcher currentLang={lang} setLang={setLang} />
          </div>
        </div>

        {/* Header */}
        <div className="mb-12 text-center lg:text-left">
          <h1 className="text-4xl lg:text-6xl font-black tracking-tight mb-4 bg-gradient-to-r from-white via-slate-400 to-slate-600 bg-clip-text text-transparent">
            {t.title} 
            <br />
            <span className="text-rose-500">{t.subtitle}</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl">
            {t.description}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form */}
          <div className="lg:col-span-4 space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              {t.inputs}
              <HelpCircle className="w-4 h-4 text-slate-500 cursor-help" />
            </h2>
            <CalculatorForm state={state} setState={setState} lang={lang} />
            
            {/* Quick Summary Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20">
              <div className="text-sm font-medium text-slate-400 mb-1">{t.estimatedProfit}</div>
              <div className="text-3xl font-black text-emerald-400 mb-2">
                ${netProfitAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500" 
                    style={{ width: `${Math.max(0, Math.min(100, profitMargin))}%` }} 
                  />
                </div>
                <span className="text-xs font-bold text-slate-500">{profitMargin.toFixed(1)}% {t.margin}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Visualization */}
          <div className="lg:col-span-8">
            <div className="sticky top-8">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">{t.visualization}</h2>
                <div className="flex gap-2">
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" /> {t.revenue}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> {t.estimatedProfit}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-rose-500" /> {t.alert}
                  </span>
                </div>
              </div>
              <SankeyChart data={sankeyData} />
              
              <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4">{t.keyInsights}</h3>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-2">
                    <span className="text-indigo-400 font-bold">•</span>
                    {t.insightGross} <span className="text-slate-200">
                      {((state.revenue - (state.revenue * (state.cogsPercent / 100)) - (state.revenue * (state.shippingPercent / 100))) / state.revenue * 100).toFixed(1)}%
                    </span>.
                  </li>
                  {state.isShopifyBasic && state.useStripe && (
                    <li className="flex gap-2">
                      <span className="text-rose-400 font-bold">•</span>
                      <span>{t.insightShopify}</span>
                    </li>
                  )}
                  <li className="flex gap-2">
                    <span className="text-amber-400 font-bold">•</span>
                    {t.insightIntl} <span className="text-slate-200">
                      ${(state.revenue * (state.intlOrderPercent / 100) * 0.025).toLocaleString()}
                    </span> {t.ofTotalCosts}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
