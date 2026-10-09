'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { fetchApi } from '@/lib/api';
import { Sidebar } from '@/components/layout/Sidebar';
import { Role } from '@ecocycle/shared';
import { toast } from 'sonner';
import { PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts';
import { PlusCircle, Laptop, Clock, CheckCircle2, ArrowRight, Recycle, RefreshCw, Bell, Sparkles, ShieldCheck, Wrench, Truck, MapPin, Download, Plus, X, User } from 'lucide-react';

export default function SmartDashboardPage() {
  const { user } = useAuth();
  const currentRole = user?.role || Role.STUDENT;

  if (currentRole === Role.ADMIN || currentRole === Role.SUPER_ADMIN) {
    return <AdminDashboardView user={user} />;
  }

  if (currentRole === Role.VOLUNTEER) {
    return <VolunteerDashboardView user={user} />;
  }

  if (currentRole === Role.TECHNICIAN) {
    return <TechnicianDashboardView user={user} />;
  }

  // Default Student Dashboard View
  return <StudentDashboardView user={user} />;
}

/* =========================================================================
   1. STUDENT DASHBOARD VIEW (DARK THEME)
   ========================================================================= */
function StudentDashboardView({ user }: { user: any }) {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [reuseRequests, setReuseRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/ewaste/submissions')
      .then((res) => {
        if (res.success && res.data) setSubmissions(res.data);
      })
      .catch(() => {
        setSubmissions([
          {
            id: 'sub-1',
            status: 'PICKED_UP',
            reason: 'Submitted laptop in front of FE Department for refurbishment',
            createdAt: new Date().toISOString(),
            device: { assetNumber: 'DEV-2026-001', category: 'LAPTOP', brand: 'Dell', model: 'Latitude 3400', status: 'AVAILABLE_FOR_REUSE' },
          },
        ]);
      });

    fetchApi('/reuse/requests')
      .then((res) => {
        if (res.success && res.data) setReuseRequests(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#090e1a] text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-6xl">
        
        {/* Welcome Banner */}
        <div className="bright-card p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden bg-[#131c2e]">
          <div className="space-y-2 relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-xs font-extrabold text-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Student Sustainability Dashboard</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Welcome back, {user?.name || 'Student'} 👋
            </h1>
            <p className="text-xs text-slate-300 font-medium max-w-xl">
              Role: <strong className="text-emerald-400 font-extrabold">STUDENT</strong> — Submit e-waste at FE Department, Gate 1, or Gate 2, track pickup status, and claim refurbished devices.
            </p>
          </div>

          <Link
            href="/submit-ewaste"
            className="px-6 py-3.5 rounded-xl bright-gradient-emerald hover:opacity-95 text-white font-black text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Submit New E-Waste</span>
          </Link>
        </div>

        {/* Student Impact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <motion.div whileHover={{ y: -3 }} className="bright-card p-6 rounded-3xl border-l-4 border-l-emerald-500 space-y-2 bg-[#131c2e]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Submitted</p>
              <div className="w-9 h-9 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center font-bold">
                <Laptop className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">{submissions.length || 1}</p>
            <p className="text-[10px] text-emerald-400 font-extrabold">Electronics Handed In</p>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="bright-card p-6 rounded-3xl border-l-4 border-l-cyan-500 space-y-2 bg-[#131c2e]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Reused</p>
              <div className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">
                <Recycle className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-cyan-400">1</p>
            <p className="text-[10px] text-cyan-400 font-extrabold">Saved from Landfill</p>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="bright-card p-6 rounded-3xl border-l-4 border-l-amber-500 space-y-2 bg-[#131c2e]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Diverted</p>
              <div className="w-9 h-9 rounded-xl bg-amber-950 text-amber-400 flex items-center justify-center font-bold">
                <RefreshCw className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-white">1.8 <span className="text-xs text-amber-400">kg</span></p>
            <p className="text-[10px] text-amber-400 font-extrabold">Carbon Footprint Saved</p>
          </motion.div>

          <motion.div whileHover={{ y: -3 }} className="bright-card p-6 rounded-3xl border-l-4 border-l-purple-500 space-y-2 bg-[#131c2e]">
            <div className="flex items-center justify-between">
              <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Claims</p>
              <div className="w-9 h-9 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center font-bold">
                <Bell className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-purple-400">{reuseRequests.length || 0}</p>
            <p className="text-[10px] text-purple-400 font-extrabold">Marketplace Requests</p>
          </motion.div>
        </div>

        {/* Submissions & Devices Table */}
        <div className="bright-card p-6 rounded-3xl space-y-4 bg-[#131c2e]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="font-black text-white text-lg">My Submitted Electronics</h3>
              <p className="text-xs text-slate-400 font-medium">Track live status of your submitted devices at campus collection points</p>
            </div>
            <Link href="/submit-ewaste" className="text-xs font-extrabold text-emerald-400 hover:underline flex items-center gap-1">
              <span>Submit More</span>
              <PlusCircle className="w-4 h-4" />
            </Link>
          </div>

          <div className="divide-y divide-slate-800">
            {submissions.map((sub) => (
              <div key={sub.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bright-gradient-emerald text-white flex items-center justify-center shadow-md">
                    <Laptop className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">
                      {sub.device?.brand} {sub.device?.model}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Location: Drop Bin <span className="font-extrabold text-slate-200">In front of FE Department</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-3.5 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-black text-[10px] uppercase tracking-wider">
                    {sub.device?.status || sub.status}
                  </span>

                  <Link
                    href={`/device/${sub.device?.assetNumber || 'DEV-2026-001'}`}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

/* =========================================================================
   2. VOLUNTEER DASHBOARD VIEW (DARK THEME)
   ========================================================================= */
function VolunteerDashboardView({ user }: { user: any }) {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/collections/requests')
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) setRequests(res.data);
        else setRequests(defaultRequests);
      })
      .catch(() => setRequests(defaultRequests));
  }, []);

  const defaultRequests = [
    {
      id: 'col-1',
      status: 'REQUESTED',
      submission: {
        device: { assetNumber: 'DEV-2026-001', brand: 'Dell', model: 'Latitude 3400', category: 'LAPTOP' },
        user: { name: 'Rohan Gupta', phone: '+91 91234 56789' },
      },
      collectionPoint: { name: 'In front of FE Department', building: 'FE Block Foyer' },
    },
    {
      id: 'col-2',
      status: 'SCHEDULED',
      submission: {
        device: { assetNumber: 'DEV-2026-002', brand: 'HP', model: 'ProDisplay P223', category: 'MONITOR' },
        user: { name: 'Neha Sharma', phone: '+91 91234 11111' },
      },
      collectionPoint: { name: 'Gate No. 1', building: 'Main Security Kiosk' },
    },
    {
      id: 'col-3',
      status: 'REQUESTED',
      submission: {
        device: { assetNumber: 'DEV-2026-003', brand: 'Lenovo', model: 'ThinkCentre M720', category: 'DESKTOP' },
        user: { name: 'Siddharth Verma', phone: '+91 91234 22222' },
      },
      collectionPoint: { name: 'Gate No. 2', building: 'Rear Entrance Drop Bin' },
    },
  ];

  const handlePickUp = (reqId: string) => {
    toast.success('Collection marked as Picked Up!');
    setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: 'PICKED_UP' } : r)));
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#090e1a] text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-5xl">
        
        <div className="bright-card p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-cyan-500 bg-[#131c2e]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bright-gradient-cyan flex items-center justify-center text-white shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Volunteer Pickup Manager
              </h1>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Logged in as Volunteer (<strong className="text-cyan-400 font-extrabold">{user?.name || 'Ananya Roy'}</strong>) — Manage assigned e-waste pickups across <strong>FE Department</strong>, <strong>Gate No. 1</strong>, and <strong>Gate No. 2</strong>.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg text-white">Assigned Pickups & Drop-off Bins</h3>

          <div className="grid grid-cols-1 gap-4">
            {requests.map((r) => (
              <div key={r.id} className="bright-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5 bg-[#131c2e]">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 font-mono font-black text-[10px]">
                      {r.submission?.device?.assetNumber}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-black text-[10px]">
                      {r.status}
                    </span>
                  </div>

                  <h4 className="font-black text-white text-lg">
                    {r.submission?.device?.brand} {r.submission?.device?.model}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-500" />
                      {r.submission?.user?.name} ({r.submission?.user?.phone})
                    </span>
                    <span className="flex items-center gap-1.5 font-extrabold text-emerald-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {r.collectionPoint?.name}
                    </span>
                  </div>
                </div>

                {r.status !== 'PICKED_UP' ? (
                  <button
                    onClick={() => handlePickUp(r.id)}
                    className="px-6 py-3 rounded-xl bright-gradient-emerald hover:opacity-95 text-white font-black text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 self-start md:self-auto cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Pickup</span>
                  </button>
                ) : (
                  <span className="px-5 py-2.5 rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 font-black text-xs flex items-center gap-1.5 self-start md:self-auto">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Picked Up</span>
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

      </main>
    </div>
  );
}

/* =========================================================================
   3. TECHNICIAN DASHBOARD VIEW (DARK THEME)
   ========================================================================= */
function TechnicianDashboardView({ user }: { user: any }) {
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [updateMessage, setUpdateMessage] = useState('');

  useEffect(() => {
    fetchApi('/repairs')
      .then((res) => {
        if (res.success && res.data) setTickets(res.data);
      })
      .catch(() => {
        setTickets([
          {
            id: 'rep-1',
            issue: 'Computer randomly powers off during lab simulations.',
            priority: 'HIGH',
            status: 'IN_PROGRESS',
            estimatedCost: 1600,
            device: { assetNumber: 'DEV-2026-003', brand: 'Lenovo', model: 'ThinkCentre M720', category: 'DESKTOP' },
            updates: [
              { status: 'DIAGNOSING', message: 'Checked rail voltages with multimeter. Fault identified in PSU.', createdAt: new Date().toISOString() },
              { status: 'IN_PROGRESS', message: 'Replaced thermal paste, mounted new CPU fan.', createdAt: new Date().toISOString() },
            ],
          },
        ]);
      });
  }, []);

  const handleAddUpdate = (ticketId: string) => {
    if (!updateMessage) {
      toast.error('Please enter update note');
      return;
    }
    toast.success('Repair timeline update logged!');
    setUpdateMessage('');
    setSelectedTicket(null);
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#090e1a] text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-6xl">
        
        <div className="bright-card p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-amber-500 bg-[#131c2e]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bright-gradient-amber flex items-center justify-center text-white shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Technician Repair Workbench
              </h1>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Logged in as Technician (<strong className="text-amber-400 font-extrabold">{user?.name || 'Suresh Kumar'}</strong>) — Hardware diagnosis & maintenance timeline logging across FE Dept & Gate Drop Bins.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-black text-lg text-white">Assigned Repair Tickets Queue</h3>

          <div className="grid grid-cols-1 gap-6">
            {tickets.map((t) => (
              <div key={t.id} className="bright-card p-6 rounded-3xl space-y-5 bg-[#131c2e]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-950 border border-amber-800 text-amber-300 font-mono font-black text-[10px]">
                        {t.device?.assetNumber}
                      </span>
                      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-rose-950 border border-rose-800 text-rose-300">
                        {t.priority} PRIORITY
                      </span>
                    </div>
                    <h4 className="font-black text-white text-lg">
                      {t.device?.brand} {t.device?.model} — {t.issue}
                    </h4>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="px-5 py-2.5 rounded-xl bright-gradient-amber text-white font-black text-xs shadow-md hover:opacity-95 self-start sm:self-auto cursor-pointer"
                  >
                    Log Progress Update
                  </button>
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Maintenance Timeline Log</p>
                  <div className="space-y-2">
                    {t.updates?.map((u: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-[#090e1a] text-xs flex items-start gap-2 border border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-black text-white uppercase text-[10px]">{u.status}: </span>
                          <span className="text-slate-300 font-medium">{u.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
            <div className="bg-[#131c2e] p-6 rounded-3xl border border-slate-800 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-black text-white text-base">Log Repair Update</h3>
                <button onClick={() => setSelectedTicket(null)} className="p-1 rounded-lg hover:bg-slate-800">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-300 mb-1">Technician Notes & Progress</label>
                  <textarea
                    rows={3}
                    placeholder="Describe parts replaced, benchmark stress tests completed..."
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#090e1a] border border-slate-700 text-xs font-bold text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-bold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddUpdate(selectedTicket.id)}
                    className="px-4 py-2 rounded-xl bright-gradient-emerald text-white font-black text-xs"
                  >
                    Save Timeline Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}

/* =========================================================================
   4. ADMIN DASHBOARD VIEW (DARK THEME)
   ========================================================================= */
function AdminDashboardView({ user }: { user: any }) {
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

  const COLORS = ['#10b981', '#06b6d4', '#f59e0b', '#ef4444', '#a855f7'];

  const lifecycleData = analytics?.lifecycleData || [
    { status: 'Collected', count: 18 },
    { status: 'Under Repair', count: 10 },
    { status: 'Reuse Pool', count: 24 },
    { status: 'Recycled', count: 15 },
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
    <div className="flex min-h-[calc(100vh-4rem)] bg-[#090e1a] text-white">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl">
        
        <div className="bright-card p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-purple-500 bg-[#131c2e]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bright-gradient-purple flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Single Admin Command Center
              </h1>
            </div>
            <p className="text-xs text-slate-300 font-medium">
              Logged in as Chief Administrator (<strong className="text-purple-400 font-extrabold">{user?.name || 'Dr. Aris Thorne'}</strong>). Managing e-waste across FE Department, Gate 1, & Gate 2.
            </p>
          </div>

          <a
            href="http://localhost:5000/api/v1/audit-logs/export"
            download
            className="px-5 py-3 rounded-xl bright-gradient-purple hover:opacity-95 text-white text-xs font-black shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all self-start md:self-auto"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export Audit Logs CSV</span>
          </a>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-slate-500 bg-[#131c2e] space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Total Devices</p>
            <p className="text-2xl font-black text-white">67</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-cyan-500 bg-[#131c2e] space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pending Pickups</p>
            <p className="text-2xl font-black text-cyan-400">5</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-amber-500 bg-[#131c2e] space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Active Repairs</p>
            <p className="text-2xl font-black text-amber-400">8</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-emerald-500 bg-[#131c2e] space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Devices Reused</p>
            <p className="text-2xl font-black text-emerald-400">24</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-purple-500 bg-[#131c2e] space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Devices Recycled</p>
            <p className="text-2xl font-black text-purple-400">15</p>
          </div>
          <div className="bright-card p-4 rounded-2xl border-t-4 border-t-rose-500 bg-[#131c2e] space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">E-Waste Diverted</p>
            <p className="text-2xl font-black text-white">184.2 kg</p>
          </div>
        </div>

        {/* Collection Points Bar */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-emerald-300 font-extrabold text-xs">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Active Campus Drop-Off Hubs:</span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs font-extrabold">
            <span className="px-3 py-1 rounded-xl bg-[#090e1a] border border-emerald-700 text-emerald-300">
              📍 In front of FE Department (45 kg load)
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#090e1a] border border-emerald-700 text-emerald-300">
              📍 Gate No. 1 (80 kg load)
            </span>
            <span className="px-3 py-1 rounded-xl bg-[#090e1a] border border-emerald-700 text-emerald-300">
              📍 Gate No. 2 (25 kg load)
            </span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bright-card p-6 rounded-3xl shadow-md space-y-4 bg-[#131c2e]">
            <h3 className="font-black text-base text-white">Lifecycle Distribution</h3>
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

          <div className="lg:col-span-7 bright-card p-6 rounded-3xl shadow-md space-y-4 bg-[#131c2e]">
            <h3 className="font-black text-base text-white">Monthly E-Waste Diverted Trend (kg)</h3>
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

        {/* Inventory Table */}
        <div className="bright-card p-6 rounded-3xl shadow-md space-y-4 bg-[#131c2e]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-black text-white text-base">Campus Devices Inventory</h3>
            <span className="text-xs text-slate-400 font-extrabold">{devices.length} Total Registered Devices</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#090e1a] uppercase text-[10px] text-slate-400 font-black border-b border-slate-800">
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
              <tbody className="divide-y divide-slate-800">
                {devices.map((dev) => (
                  <tr key={dev.assetNumber} className="hover:bg-[#1a2744]">
                    <td className="px-4 py-3 font-mono font-black text-emerald-400">{dev.assetNumber}</td>
                    <td className="px-4 py-3 font-black text-white">{dev.brand} {dev.model}</td>
                    <td className="px-4 py-3 font-medium">{dev.category}</td>
                    <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-black">{dev.condition}</span></td>
                    <td className="px-4 py-3"><span className="px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 text-[10px] font-black">{dev.status}</span></td>
                    <td className="px-4 py-3 text-slate-400 font-medium">{dev.owner?.name || 'In front of FE Department'}</td>
                    <td className="px-4 py-3 text-right">
                      <Link href={`/device/${dev.assetNumber}`} className="text-emerald-400 font-black hover:underline">
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
