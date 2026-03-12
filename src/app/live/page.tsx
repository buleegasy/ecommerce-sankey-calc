"use client";

import React, { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowLeft, Zap, Globe as GlobeIcon, TrendingUp } from 'lucide-react';

// Dynamically import the Globe to avoid SSR issues
const LiveGlobe = dynamic(() => import('@/components/LiveGlobe'), { 
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen w-screen bg-black">
      <div className="animate-pulse text-indigo-500 font-bold tracking-widest text-2xl">
        INITIALIZING GLOBAL STREAM...
      </div>
    </div>
  )
});

const CITIES = [
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060 },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278 },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093 },
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522 },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198 },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050 },
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'Sao Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333 },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777 },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832 },
  { name: 'Shanghai', country: 'China', lat: 31.2304, lng: 121.4737 },
];

interface Order {
  id: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  amount: number;
  color: string;
  size: number;
}

export default function LiveDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(12450); // Starting mock revenue
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Play "Ka-Ching" sound
  const playSound = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
      audio.volume = 0.2;
      audio.play();
    } catch (e) {
      console.warn("Audio playback failed", e);
    }
  };

  useEffect(() => {
    const generateOrder = () => {
      const city = CITIES[Math.floor(Math.random() * CITIES.length)];
      const amount = Math.floor(Math.random() * 180) + 20;
      const newOrder: Order = {
        id: Math.random().toString(36).substr(2, 9),
        ...city,
        city: city.name, // Explicitly map city.name to city
        amount,
        color: '#f43f5e',
        size: 0.5 + Math.random() * 0.5
      };

      setOrders(prev => [...prev.slice(-40), newOrder]); // Keep last 40 for performance
      setTotalRevenue(prev => prev + amount);
      setLatestOrder(newOrder);
      playSound();

      // Reset latest order toast after 4 seconds
      setTimeout(() => {
        setLatestOrder(current => current?.id === newOrder.id ? null : current);
      }, 4000);

      // Schedule next order
      const nextDelay = Math.random() * 4000 + 2000;
      setTimeout(generateOrder, nextDelay);
    };

    const timer = setTimeout(generateOrder, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#000] text-white relative font-sans selection:bg-rose-500/30">
      {/* Background Globe */}
      <div className="absolute inset-0 z-0">
        <LiveGlobe pointsData={orders} />
      </div>

      {/* Top Overlay: Revenue */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 text-center pointer-events-none">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-rose-500/80 mb-2 drop-shadow-[0_0_10px_rgba(244,63,94,0.5)]">
          Real-Time Global Revenue
        </div>
        <div className="text-6xl lg:text-8xl font-black tracking-tighter tabular-nums text-white drop-shadow-[0_2px_40px_rgba(255,255,255,0.2)]">
          ${totalRevenue.toLocaleString()}
        </div>
      </div>

      {/* Top Left: Back Button */}
      <div className="absolute top-8 left-8 z-20">
        <Link 
          href="/" 
          className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 transition-all text-sm font-medium text-slate-400 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Calculator
        </Link>
      </div>

      {/* Top Right: Status */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-4">
        <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Live Stream Active</span>
        </div>
      </div>

      {/* Bottom Left: Ticker/Toast */}
      <div className="absolute bottom-8 left-8 z-20 w-80 pointer-events-none">
        {latestOrder && (
          <div className="animate-in slide-in-from-bottom-8 fade-in duration-500 p-4 rounded-2xl bg-[#0f172a]/80 border border-rose-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(244,63,94,0.1)]">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-full bg-rose-500/20 text-rose-400">
                <Zap className="w-5 h-5 fill-rose-400" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-black text-rose-500 mb-1">NEW ORDER!</div>
                <div className="text-slate-200 text-sm leading-tight">
                  <span className="font-bold text-white">${latestOrder.amount}</span> just came in from 
                  <br />
                  <span className="text-slate-400 font-medium">{latestOrder.city}, {latestOrder.country}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats Cards Bottom Right */}
      <div className="absolute bottom-8 right-8 z-20 flex flex-col gap-4 pointer-events-none">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md w-48">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active Nodes</div>
          <div className="text-2xl font-black flex items-center gap-2">
            <GlobeIcon className="w-5 h-5 text-indigo-400" /> {CITIES.length}
          </div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md w-48">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">24h Growth</div>
          <div className="text-2xl font-black flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> +12.4%
          </div>
        </div>
      </div>

      {/* Decorative Gradients */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/20 to-black pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
}
