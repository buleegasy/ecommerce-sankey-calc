"use client";

import { AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  cogsPercent: number;
  adSpendPercent: number;
}

export default function AIDoctorAlerts({ cogsPercent, adSpendPercent }: Props) {
  const showCogsAlert = cogsPercent > 30;
  const showAdsAlert = adSpendPercent > 30;

  return (
    <div className="space-y-3 mb-8">
      <AnimatePresence>
        {showCogsAlert && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shadow-lg shadow-red-900/10"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wider mb-0.5">🚨 Product Cost Alert</p>
              <p className="text-xs font-medium text-red-300 opacity-90">
                Your COGS is at <span className="font-bold underlineDecoration-red-500">{cogsPercent}%</span>. 
                Industry benchmark is <span className="font-bold">&lt;30%</span>. 
                You are bleeding margin at the sourcing level.
              </p>
            </div>
          </motion.div>
        )}

        {showAdsAlert && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ delay: 0.1 }}
            className="flex items-center gap-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shadow-lg shadow-amber-900/10"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wider mb-0.5">⚠️ High CAC Warning</p>
              <p className="text-xs font-medium text-amber-200/80">
                Marketing consumes <span className="font-bold">{adSpendPercent}%</span> of your revenue. 
                Optimize your ROAS immediately to prevent acquisition insolvency.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
