"use client";

import { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { CalculatorState } from '../types';

interface Props {
  state: CalculatorState;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const value = data.value[1] - data.value[0];
    const isNegative = value < 0;
    
    return (
      <div className="glass p-3 rounded-lg border border-white/10 text-sm shadow-xl">
        <p className="font-bold text-slate-200 mb-1">{label}</p>
        <p className={`font-mono ${isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
          {isNegative ? '-' : '+'}${Math.abs(value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function WaterfallChart({ state }: Props) {
  const data = useMemo(() => {
    // Benchmark Unit Economics on a base AOV ($50 assumption as requested, or actual AOV)
    const baseAOV = 50; 
    
    // Calculate precise deductions
    const cogsDed = (baseAOV * (state.cogsPercent / 100));
    const shipDed = (baseAOV * (state.shippingPercent / 100));
    
    // Stripe + Shopify approximations per order
    const stripeBaseFee = (baseAOV * 0.029) + 0.30;
    const stripeIntlFee = (baseAOV * (state.intlOrderPercent / 100)) * 0.015;
    const shopifyFee = (state.isShopifyBasic && state.useStripe) ? (baseAOV * 0.02) : 0;
    const totalFeesDed = stripeBaseFee + stripeIntlFee + shopifyFee;
    
    // Assume Ads/CPA takes up 30% of AOV for benchmark purposes if we don't have marketing spend
    const adsDed = baseAOV * 0.30; 
    
    const netProfit = baseAOV - cogsDed - shipDed - totalFeesDed - adsDed;

    // Build cumulative waterfall data
    // Format: [startValue, endValue]
    let current = baseAOV;
    
    const chartData = [
      {
        name: 'Gross Rev (AOV)',
        value: [0, current],
        color: '#3b82f6', // blue-500
        isTotal: true
      }
    ];

    const addDeduction = (name: string, amount: number, color: string) => {
      chartData.push({
        name,
        value: [current - amount, current],
        color,
        isTotal: false
      });
      current -= amount;
    };

    addDeduction('COGS', cogsDed, '#f43f5e'); // rose-500
    addDeduction('Shipping', shipDed, '#f43f5e');
    addDeduction('Fees', totalFeesDed, '#f43f5e');
    addDeduction('Ads (CPA)', adsDed, '#f43f5e');

    chartData.push({
      name: 'Net Profit',
      value: [0, current],
      color: current > 0 ? '#10b981' : '#dc2626', // emerald-500 or red-600
      isTotal: true
    });

    return chartData;
  }, [state]);

  return (
    <div className="h-[400px] w-full p-6 glass glass-hover rounded-[2.5rem]">
      <div className="mb-4">
        <h3 className="text-lg font-black tracking-tight text-slate-100">Unit Economics Waterfall</h3>
        <p className="text-xs font-medium text-slate-400">Benchmarked on $50 Average Order Value</p>
      </div>
      
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8" 
              fontSize={12} 
              tickLine={false}
              axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
            />
            <YAxis 
              stroke="#94a3b8" 
              fontSize={12} 
              tickFormatter={(val) => `$${val}`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }}/>
            <Bar dataKey="value" radius={[4, 4, 4, 4]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
