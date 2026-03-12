"use client";

import { useState, useMemo } from "react";
import AIDoctorAlerts from "./AIDoctorAlerts";
import WaterfallAnalytic from "./WaterfallAnalytic";
import BenchmarkCards from "./BenchmarkCards";
import { CalculatorState } from "@/types";

interface Props {
  state: CalculatorState;
}

export default function DiagnosticDashboard({ state }: Props) {
  // Use user input state but provide the specific architectural logic requested
  const metrics = useMemo(() => {
    const aov = state.aov || 50;
    const cogsPercent = state.cogsPercent;
    const shippingPercent = state.shippingPercent;
    const paymentFeePercent = state.useStripe ? 3.5 : 0;
    const adSpendPercent = 40; // Mocked as requested
    const returnRate = 8; // Mocked as requested

    // Derived values
    const cogs = aov * (cogsPercent / 100);
    const shipping = aov * (shippingPercent / 100);
    const paymentFee = aov * (paymentFeePercent / 100);
    const adSpend = aov * (adSpendPercent / 100);
    const returns = aov * (returnRate / 100);
    const netMargin = aov - cogs - shipping - paymentFee - adSpend - returns;

    return {
      aov,
      cogsPercent,
      shippingPercent,
      paymentFeePercent,
      adSpendPercent,
      returnRate,
      cogs,
      shipping,
      paymentFee,
      adSpend,
      returns,
      netMargin
    };
  }, [state]);

  return (
    <div className="space-y-12">
      {/* Layer A: AI Doctor Alerts */}
      <section>
        <AIDoctorAlerts 
          cogsPercent={metrics.cogsPercent} 
          adSpendPercent={metrics.adSpendPercent} 
        />
      </section>

      {/* Layer B: Unit Economics Waterfall */}
      <section>
        <WaterfallAnalytic 
          aov={metrics.aov}
          cogs={metrics.cogs}
          shipping={metrics.shipping}
          paymentFee={metrics.paymentFee}
          adSpend={metrics.adSpend}
          returns={metrics.returns}
          netMargin={metrics.netMargin}
        />
      </section>

      {/* Layer C: Traffic Light Benchmarks */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1.5 h-6 bg-blue-500 rounded-full" />
          <h2 className="text-2xl font-black tracking-tight text-white uppercase">Health Diagnostics</h2>
        </div>
        <BenchmarkCards 
          cogsPercent={metrics.cogsPercent}
          shippingPercent={metrics.shippingPercent}
          returnRate={metrics.returnRate}
        />
      </section>
    </div>
  );
}
