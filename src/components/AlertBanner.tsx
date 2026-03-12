"use client";

import { AlertTriangle, TrendingDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  actualRoas: number;
  breakEvenRoas: number;
  netProfit: number;
}

export default function AlertBanner({ actualRoas, breakEvenRoas, netProfit }: Props) {
  const isLosingMoney = actualRoas < breakEvenRoas || netProfit < 0;

  return (
    <AnimatePresence>
      {isLosingMoney && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="w-full bg-rose-500/10 border-b border-rose-500/20 px-4 py-3 shadow-[inset_0_-1px_0_rgba(244,63,94,0.1)] relative overflow-hidden"
        >
          {/* Animated background glow */}
          <motion.div 
            animate={{ 
              x: ["-100%", "100%"] 
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3, 
              ease: "linear" 
            }}
            className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-rose-500/10 to-transparent skew-x-[-45deg]"
          />
          
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 relative z-10">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 animate-pulse">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <p className="text-rose-100 font-medium text-sm md:text-base flex items-center gap-2">
              <span className="font-bold text-rose-400">🚨 MARKETING BLEED:</span> 
              You are losing money on acquisition. Stop or optimize ads immediately.
            </p>
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded bg-black/40 border border-rose-500/30 font-mono text-xs text-rose-300">
              <TrendingDown className="w-3 h-3" />
              ROAS: {actualRoas.toFixed(2)}x <span className="text-slate-500">|</span> Target: <span className="text-slate-300">{breakEvenRoas.toFixed(2)}x</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
