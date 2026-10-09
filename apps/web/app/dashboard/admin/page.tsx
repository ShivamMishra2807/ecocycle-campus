'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sidebar } from '@/components/layout/Sidebar';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { ShieldCheck, Laptop, Download, RefreshCw, Wrench, Recycle, CheckCircle2, AlertCircle, Sparkles, Building, MapPin } from 'lucide-react';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/analytics')
      .then((res) => {
        if (res.success && res.data) setAnalytics(res.data);
      })
      .catch(() => {});

    fetchApi('/devices')
      .then((res) => {
        if (res.success && res.data) setDevices(res.data);
      })
      .catch(() => {
        setDevices([
          { assetNumber: 'DEV-2026-001', brand: 'Dell', model: 'Latitude 3400', category: 'LAPTOP', condition: 'GOOD', status: 'AVAILABLE_FOR_REUSE', owner: { name: 'Rohan Gupta' } },
          { assetNumber: 'DEV-2026-002', brand: 'HP', model: 'ProDisplay P223', category: 'MONITOR', condition: 'EXCELLENT', status: 'AVAILABLE_FOR_REUSE', owner: { name: 'Campus IT' } },
          { assetNumber: 'DEV-2026-003', brand: 'Lenovo', model: 'ThinkCentre M720', category: 'DESKTOP', condition: 'POOR', status: 'UNDER_REPAIR', owner: { name: 'Dr. Meera Sen' } },
          { assetNumber: 'DEV-2026-004', brand: 'Epson', model: 'EB-X05 Projector', category: 'PROJECTOR', condition: 'NON_FUNCTIONAL', status: 'SENT_FOR_RECYCLING', owner: { name: 'Admin Dept' } },
        ]);
      });
  }, []);

  const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'];

  const lifecycleData = analytics?.lifecycleData || [
    { status: 'Collected', count: 18 },
    { status: 'Under Repair', count: 10 },
    { status: 'Reuse Pool', count: 24 },
    { status: 'Recycled', count: 15 },
  ];

  const categoryData = analytics?.categoryData || [
    { category: 'LAPTOP', count: 28 },
    { category: 'MONITOR', count: 14 },
    { category: 'DESKTOP', count: 10 },
    { category: 'TABLET', count: 8 },
    { category: 'OTHER', count: 7 },
  ];

  const monthlyTrend = analytics?.monthlyTrend || [
    { month: 'May', collectedKg: 45, reusedKg: 30, recycledKg: 15 },
    { month: 'Jun', collectedKg: 62, reusedKg: 44, recycledKg: 18 },
    { month: 'Jul', collectedKg: 78, reusedKg: 52, recycledKg: 26 },
    { month: 'Aug', collectedKg: 95, reusedKg: 70, recycledKg: 25 },
    { month: 'Sep', collectedKg: 110, reusedKg: 82, recycledKg: 28 },
    { month: 'Oct', collectedKg: 135, reusedKg: 98, recycledKg: 37 },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl">
        
        {/* Header with Bright Gradient Accent */}
        <div className="bright-card p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-purple-500">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bright-gradient-purple flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Single Admin Command Center
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Logged in as Chief Administrator (<strong className="text-purple-600 dark:text-purple-400">Dr. Aris Thorne</strong>). Managing e-waste across FE Department, Gate 1, & Gate 2.
            </p>
          </div>

          <a
            href="http://localhost:5000/api/v1/audit-logs/export"
            download
            className="px-5 py-3 rounded-xl bright-gradient-purple hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export Audit Logs CSV</span>
          </a>
        </div>

        {/* Top Bright KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-slate-700 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Devices</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">67</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-cyan-500 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pending Pickups</p>
            <p className="text-2xl font-extrabold text-cyan-600">5</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-amber-500 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Active Repairs</p>
            <p className="text-2xl font-extrabold text-amber-600">8</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-emerald-500 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Devices Reused</p>
            <p className="text-2xl font-extrabold text-emerald-600">24</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-purple-500 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Devices Recycled</p>
            <p className="text-2xl font-extrabold text-purple-600">15</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-rose-500 space-y-1">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">E-Waste Diverted</p>
            <p className="text-2xl font-extrabold text-slate-900 dark:text-white">184.2 kg</p>
          </div>
        </div>

        {/* Collection Points Status Quick Bar */}
        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-200 font-bold text-xs">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>Active Campus Drop-Off Hubs:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
            <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
              📍 In front of FE Department (45 kg load)
            </span>
            <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
              📍 Gate No. 1 (80 kg load)
            </span>
            <span className="px-3 py-1 rounded-xl bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300">
              📍 Gate No. 2 (25 kg load)
            </span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Lifecycle Donut Chart */}
          <div className="lg:col-span-5 bright-card p-6 rounded-3xl shadow-md space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Lifecycle Distribution</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={lifecycleData} dataKey="count" nameKey="status" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4}>
                    {lifecycleData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly Trend Area Chart */}
          <div className="lg:col-span-7 bright-card p-6 rounded-3xl shadow-md space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Monthly E-Waste Diverted Trend (kg)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrend}>
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="collectedKg" stroke="#10b981" fill="#10b981" fillOpacity={0.25} name="Collected (kg)" />
                  <Area type="monotone" dataKey="reusedKg" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} name="Reused (kg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* Device Inventory Table */}
        <div className="bright-card p-6 rounded-3xl shadow-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Campus Devices Inventory</h3>
            <span className="text-xs text-slate-500 font-bold">{devices.length} Total Registered Devices</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-100 dark:bg-slate-900 uppercase text-[10px] text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-4 py-3">Asset ID</th>
                  <th className="px-4 py-3">Device Details</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Condition</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Owner / Location</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {devices.map((dev) => (
                  <tr key={dev.assetNumber} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/50">
                    <td className="px-4 py-3 font-mono font-bold text-emerald-600">{dev.assetNumber}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100">{dev.brand} {dev.model}</td>
                    <td className="px-4 py-3">{dev.category}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold">{dev.condition}</span></td>
                    <td className="px-4 py-3"><span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-extrabold">{dev.status}</span></td>
                    <td className="px-4 py-3 text-slate-500">{dev.owner?.name || 'In front of FE Department'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/device/${dev.assetNumber}`} className="text-emerald-600 font-bold hover:underline">
                        View Track
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
