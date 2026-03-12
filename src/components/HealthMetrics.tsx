"use client";

import { motion } from "framer-motion";
import { PieChart, Truck, Percent } from "lucide-react";

interface MetricProps {
  title: string;
  value: number;
  target: number;
  icon: React.ReactNode;
  suffix?: string;
}

const MetricCard = ({ title, value, target, icon, suffix = "%" }: MetricProps) => {
  const isHealthy = value <= target;
  const statusColor = isHealthy ? "text-emerald-400" : "text-rose-400";
  const barColor = isHealthy ? "bg-emerald-500" : "bg-rose-500";
  const glowColor = isHealthy ? "rgba(16,185,129,0.3)" : "rgba(244,63,94,0.3)";

  return (
    <motion.div 
      whileHover={{ y: -2 }}
      className="p-6 glass glass-hover relative overflow-hidden group rounded-2xl"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl bg-white/5 border border-white/5 group-hover:bg-white/10 transition-colors`}>
            {icon}
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">{title}</h3>
            <div className={`text-2xl font-black ${statusColor} drop-shadow-[0_0_10px_${glowColor}]`}>
              {value.toFixed(1)}{suffix}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
          <span className="text-slate-500">Industry Target: &lt; {target}{suffix}</span>
          <span className={statusColor}>{isHealthy ? 'Healthy' : 'Critical'}</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, (value / (target * 2)) * 100)}%` }}
            transition={{ duration: 1, type: "spring" }}
            className={`h-full ${barColor} shadow-[0_0_10px_${glowColor}]`} 
          />
        </div>
        
        {/* Target Marker */}
        <div 
          className="absolute bottom-6 w-0.5 h-3 bg-white/50 z-10" 
          style={{ left: `calc(1.5rem + 50% - 1px)` }} // 50% = Target
        />
      </div>
    </motion.div>
  );
};

interface HealthMetricsProps {
  cogsPercent: number;
  shippingPercent: number;
  returnRate: number; // Assuming we add this or mock it for now
}

export default function HealthMetrics({ cogsPercent, shippingPercent, returnRate = 12 }: HealthMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <MetricCard 
        title="Cost of Goods (COGS)" 
        value={cogsPercent} 
        target={30} 
        icon={<PieChart className="w-5 h-5 text-indigo-400" />} 
      />
      <MetricCard 
        title="Fulfillment & Shipping" 
        value={shippingPercent} 
        target={20} 
        icon={<Truck className="w-5 h-5 text-blue-400" />} 
      />
      <MetricCard 
        title="Customer Return Rate" 
        value={returnRate} 
        target={15} 
        icon={<Percent className="w-5 h-5 text-amber-400" />} 
      />
    </div>
  );
}
