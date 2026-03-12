"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import CalculatorForm from "@/components/CalculatorForm";
import SankeyChart from "@/components/SankeyChart";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import NumberTicker from "@/components/NumberTicker";
import DiagnosticDashboard from "@/components/DiagnosticDashboard";
import { CalculatorState } from "@/types";
import { calculateSankeyData } from "@/lib/logic";
import { Language, translations } from "@/lib/translations";
import { TrendingDown, HelpCircle, Zap, ArrowRight, BarChart3 } from "lucide-react";

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
    <main className="min-h-screen text-slate-100 selection:bg-blue-500/30 overflow-x-hidden text-foregound">
      {/* Background Mesh */}
      <div className="bg-mesh" />

      <div className="max-w-7xl mx-auto px-4 py-8 lg:py-12 relative z-10">
        {/* Navigation / Top Bar */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(244,63,94,0.1)]">
            <TrendingDown className="w-3.5 h-3.5" /> {t.alert}
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/live" 
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 hover:border-white/20 transition-all shadow-xl backdrop-blur-md"
            >
              <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" /> 
              Live Dashboard
              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </Link>
            <LanguageSwitcher currentLang={lang} setLang={setLang} />
          </div>
        </motion.div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16 text-center lg:text-left"
        >
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-6 bg-gradient-to-r from-white via-slate-300 to-slate-500 bg-clip-text text-transparent leading-tight">
            {t.title} 
            <br />
            <span className="text-blue-500 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)]">{t.subtitle}</span>
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl leading-relaxed font-medium flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Business Intelligence (BI) Diagnostic Center
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-4 space-y-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                {t.inputs}
                <HelpCircle className="w-5 h-5 text-slate-500 cursor-help hover:text-indigo-400 transition-colors" />
              </h2>
            </div>
            
            <CalculatorForm state={state} setState={setState} lang={lang} />
            
            <motion.div 
              layout
              className="p-8 glass glass-hover relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <TrendingDown className="w-24 h-24 text-emerald-400 rotate-12" />
              </div>
              
              <div className="relative z-10">
                <div className="text-sm font-bold text-indigo-300/80 uppercase tracking-widest mb-2">{t.estimatedProfit}</div>
                <div className="text-5xl font-black text-emerald-400 mb-6 flex items-baseline gap-1">
                  <span className="text-3xl font-bold opacity-80">$</span>
                  <NumberTicker 
                    value={netProfitAmount} 
                    decimals={2}
                    className="tabular-nums"
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>{t.margin}</span>
                    <span className="text-emerald-400">{profitMargin.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 w-full bg-slate-900/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.max(0, Math.min(100, profitMargin))}%` }}
                      transition={{ type: "spring", damping: 20 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: BI Analytical Center */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8"
          >
            <DiagnosticDashboard state={state} />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
