"use client";

import React, { useState } from 'react';
import { useCSVReader } from 'react-papaparse';
import { Upload, FileCheck, AlertCircle, ShieldCheck } from 'lucide-react';
import { Language, translations } from '@/lib/translations';

interface Props {
  onDataParsed: (revenue: number, aov: number) => void;
  lang: Language;
}

export default function CSVUploader({ onDataParsed, lang }: Props) {
  const { CSVReader } = useCSVReader();
  const [isHovering, setIsHovering] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const handleUploadAccepted = (results: any) => {
    const data = results.data;
    setFileName(results.meta.name || "orders.csv");
    
    // Shopify CSV Headers: "Financial Status", "Subtotal"
    // Filter: "paid" or "partially_paid"
    const validOrders = data.filter((row: any) => {
      const status = (row["Financial Status"] || "").toLowerCase();
      return status === "paid" || status === "partially_paid";
    });

    const totalRevenue = validOrders.reduce((sum: number, row: any) => {
      const subtotal = parseFloat(row["Subtotal"] || "0");
      return sum + (isNaN(subtotal) ? 0 : subtotal);
    }, 0);

    const orderCount = validOrders.length;
    const aov = orderCount > 0 ? totalRevenue / orderCount : 0;

    onDataParsed(totalRevenue, aov);
    setIsHovering(false);
  };

  return (
    <div className="space-y-3">
      <CSVReader
        onUploadAccepted={handleUploadAccepted}
        config={{
          header: true,
          skipEmptyLines: true,
        }}
        onDragOver={() => setIsHovering(true)}
        onDragLeave={() => setIsHovering(false)}
      >
        {({ getRootProps, acceptedFile, ProgressBar, getRemoveFileProps }: any) => (
          <div className="relative group">
            <div
              {...getRootProps()}
              className={`
                flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer
                ${isHovering 
                  ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.2)]' 
                  : 'border-white/10 bg-white/5 hover:border-indigo-500/50 hover:bg-white/10'
                }
              `}
            >
              <div className={`p-3 rounded-full mb-3 transition-colors ${isHovering ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-400'}`}>
                {acceptedFile ? <FileCheck className="w-6 h-6" /> : <Upload className="w-6 h-6" />}
              </div>
              
              <p className="text-sm font-bold text-slate-200 mb-1">
                {acceptedFile ? acceptedFile.name : (lang === 'zh' ? '点击或拖拽 Shopify 订单 CSV' : 'Drop Shopify Orders CSV here')}
              </p>
              <p className="text-xs text-slate-500">
                {lang === 'zh' ? '仅解析已支付订单' : 'Only paid/partially paid orders parsed'}
              </p>

              <div className="mt-4 w-full h-1">
                <ProgressBar />
              </div>
            </div>
          </div>
        )}
      </CSVReader>
      
      <div className="flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-[10px] font-bold text-emerald-500/70 uppercase tracking-tighter">
        <ShieldCheck className="w-3 h-3" />
        100% Local - No data leaves your browser
      </div>
    </div>
  );
}
