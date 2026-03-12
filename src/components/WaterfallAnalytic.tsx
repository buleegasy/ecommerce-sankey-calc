"use client";

import { useMemo } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

interface Props {
  aov: number;
  cogs: number;
  shipping: number;
  paymentFee: number;
  adSpend: number;
  returns: number;
  netMargin: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = data.actualValue;
    return (
      <div className="glass p-3 rounded-lg border border-white/10 text-xs shadow-2xl">
        <p className="font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-lg font-mono font-bold text-white">
          ${Math.abs(value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function WaterfallAnalytic({ 
  aov, cogs, shipping, paymentFee, adSpend, returns, netMargin 
}: Props) {

  const data = useMemo(() => {
    // Recharts Waterfall logic: use a "bottom" transparent bar to list the main bar
    let cumulative = aov;
    
    // 1. Gross Rev
    const items = [
      { name: 'Gross Revenue', bottom: 0, actualValue: aov, color: '#f8fafc' },
      { name: 'COGS', bottom: cumulative - cogs, actualValue: -cogs, color: '#fb7185' },
    ];
    cumulative -= cogs;
    
    // 2. Shipping
    items.push({ name: 'Shipping', bottom: cumulative - shipping, actualValue: -shipping, color: '#f43f5e' });
    cumulative -= shipping;

    // 3. Payment Fee
    items.push({ name: 'Payment Fee', bottom: cumulative - paymentFee, actualValue: -paymentFee, color: '#e11d48' });
    cumulative -= paymentFee;

    // 4. Ad Spend
    items.push({ name: 'Ad Spend', bottom: cumulative - adSpend, actualValue: -adSpend, color: '#9f1239' });
    cumulative -= adSpend;

    // 5. Returns
    items.push({ name: 'Returns', bottom: cumulative - returns, actualValue: -returns, color: '#881337' });
    cumulative -= returns;

    // 6. Net Margin
    items.push({ name: 'Net Margin', bottom: 0, actualValue: netMargin, color: netMargin > 0 ? '#22c55e' : '#dc2626' });

    return items;
  }, [aov, cogs, shipping, paymentFee, adSpend, returns, netMargin]);

  return (
    <div className="w-full glass p-8 rounded-[2rem] relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-[80px] rounded-full" />
      
      <div className="mb-8">
        <h3 className="text-xl font-black tracking-tight text-white mb-1">The Anatomy of a ${aov} Order</h3>
        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Unit Economics Visual Breakdown</p>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} layout="vertical" margin={{ left: 80, right: 30 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" horizontal={true} vertical={false} />
            <XAxis type="number" hide />
            <YAxis 
              dataKey="name" 
              type="category" 
              stroke="#64748b" 
              fontSize={10} 
              fontWeight={900}
              tickLine={false} 
              axisLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            
            {/* The transparent base bar */}
            <Bar dataKey="bottom" stackId="a" fill="transparent" />
            
            {/* The actual value bar */}
            <Bar dataKey="actualValue" stackId="a" radius={[0, 4, 4, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-slate-50" />
               <span className="text-[10px] font-black text-slate-500 uppercase">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-rose-500" />
               <span className="text-[10px] font-black text-slate-500 uppercase">Deductions</span>
            </div>
         </div>
         <div className="text-right">
            <span className="text-[10px] font-black text-slate-500 uppercase block mb-1">Estimated Net profit</span>
            <span className={`text-2xl font-black ${netMargin > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${netMargin.toFixed(2)}
            </span>
         </div>
      </div>
    </div>
  );
}
