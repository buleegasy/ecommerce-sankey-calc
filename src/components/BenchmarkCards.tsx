"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

interface CardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
}

const BenchmarkCard = ({ title, current, target, unit = "%" }: CardProps) => {
  const isHealthy = current <= target;
  const statusColor = isHealthy ? "text-emerald-400" : "text-rose-500";
  const barColor = isHealthy ? "bg-emerald-500" : "bg-rose-500";
  const Icon = isHealthy ? CheckCircle2 : XCircle;

  return (
    <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
      <div className="flex justify-between items-start mb-4">
        <h4 className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{title}</h4>
        <Icon className={`w-4 h-4 ${statusColor}`} />
      </div>
      
      <div className="flex items-baseline gap-1 mb-4">
        <span className={`text-3xl font-black ${statusColor}`}>
          {current}
        </span>
        <span className="text-sm font-bold text-slate-600">{unit}</span>
      </div>

      <div className="space-y-2">
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (current / (target * 1.5)) * 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full ${barColor} shadow-[0_0_12px_rgba(255,255,255,0.1)]`}
          />
        </div>
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-500">Industry Target</span>
          <span className="text-slate-300">&lt; {target}{unit}</span>
        </div>
      </div>
    </div>
  );
};

interface Props {
  cogsPercent: number;
  shippingPercent: number;
  returnRate: number;
}

export default function BenchmarkCards({ cogsPercent, shippingPercent, returnRate }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <BenchmarkCard 
        title="COGS Health" 
        current={cogsPercent} 
        target={30} 
      />
      <BenchmarkCard 
        title="Shipping Health" 
        current={shippingPercent} 
        target={15} 
      />
      <BenchmarkCard 
        title="Return Rate Health" 
        current={returnRate} 
        target={5} 
      />
    </div>
  );
}
