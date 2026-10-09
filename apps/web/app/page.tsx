'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Recycle, ArrowRight, ShieldCheck, Wrench, RefreshCw, Sparkles, MapPin, CheckCircle2, LogIn, UserPlus, GraduationCap, Truck, UserCheck, HeartHandshake } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function LandingPage() {
  const [impact, setImpact] = useState<any>({
    totalDevices: 2481,
    totalWeightDivertedKg: 1842.5,
    totalReused: 734,
    landfillDiversionRate: 91,
  });

  const [activeTab, setActiveTab] = useState<'collect' | 'repair' | 'reuse' | 'recycle'>('collect');

  useEffect(() => {
    fetchApi('/impact')
      .then((res) => {
        if (res.success && res.data) setImpact(res.data);
      })
      .catch(() => {});
  }, []);

  const lifecycleSteps = [
    { key: 'collect', title: '1. Collection Request', desc: 'Students & Faculty submit unused/damaged electronics. Assigned campus volunteers pick them up from smart collection drop boxes at FE Department, Gate 1, & Gate 2.', color: 'bright-gradient-emerald', icon: MapPin },
    { key: 'repair', title: '2. Tech Assessment & Repair', desc: 'Certified technicians diagnose hardware. Functional parts are swapped, thermal paste refreshed, and OS reinstalled.', color: 'bright-gradient-cyan', icon: Wrench },
    { key: 'reuse', title: '3. Campus Reuse Pool', desc: 'Refurbished laptops, tablets, and monitors enter the student reuse marketplace for low-cost allocation to department labs.', color: 'bright-gradient-amber', icon: RefreshCw },
    { key: 'recycle', title: '4. Zero-Landfill Recycling', desc: 'Non-repairable e-waste is dispatched to government-certified recyclers for 100% safe precious metal and plastic extraction.', color: 'bright-gradient-purple', icon: ShieldCheck },
  ];

  return (
    <div className="min-h-screen space-y-20 pb-16 bg-[#090e1a] text-white">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-10 md:pt-16 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Text & Action Buttons */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-xs font-extrabold text-emerald-300 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Campus Circular Electronics Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight"
            >
              Give Your Electronics a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-amber-400">Second Life.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed font-medium"
            >
              One dark-mode platform for Students, Volunteers, Technicians, and Admin to collect, assess, repair, reuse and responsibly recycle e-waste across university departments.
            </motion.p>

            {/* Prominent Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              <Link
                href="/login"
                className="px-6 py-3.5 rounded-xl bright-gradient-emerald hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In to Portal</span>
              </Link>

              <Link
                href="/register"
                className="px-6 py-3.5 rounded-xl bright-gradient-cyan hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register / Sign Up</span>
              </Link>

              <Link
                href="/submit-ewaste"
                className="px-5 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs border border-slate-700 shadow-md flex items-center gap-1.5 transition-all"
              >
                <span>Report E-Waste</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </motion.div>

            {/* Quick Metrics Pills */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800">
              <div className="p-3 rounded-2xl bg-[#131c2e] border border-slate-800 shadow-xs">
                <p className="text-2xl font-black text-white">{impact.totalDevices.toLocaleString()}+</p>
                <p className="text-xs text-slate-400 font-bold">Devices Processed</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#131c2e] border border-slate-800 shadow-xs">
                <p className="text-2xl font-black text-emerald-400">{impact.totalWeightDivertedKg} kg</p>
                <p className="text-xs text-slate-400 font-bold">E-Waste Diverted</p>
              </div>
              <div className="p-3 rounded-2xl bg-[#131c2e] border border-slate-800 shadow-xs">
                <p className="text-2xl font-black text-cyan-400">{impact.landfillDiversionRate}%</p>
                <p className="text-xs text-slate-400 font-bold">Diversion Rate</p>
              </div>
            </div>
          </div>

          {/* Right Hero Interactive Circular Loop */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md aspect-square rounded-3xl bg-[#131c2e] p-8 flex flex-col items-center justify-between border-2 border-emerald-500/40 shadow-2xl overflow-hidden">
              
              <div className="text-center z-10 space-y-1">
                <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-400">Interactive Lifecycle</span>
                <h3 className="text-xl font-black text-white">Campus Circular Loop</h3>
              </div>

              {/* Central Display */}
              <motion.div
                key={activeTab}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="z-10 text-center p-6 rounded-2xl bg-[#090e1a] shadow-md border border-slate-800 w-full"
              >
                {activeTab === 'collect' && <MapPin className="w-12 h-12 text-emerald-400 mx-auto mb-2" />}
                {activeTab === 'repair' && <Wrench className="w-12 h-12 text-amber-400 mx-auto mb-2" />}
                {activeTab === 'reuse' && <RefreshCw className="w-12 h-12 text-cyan-400 mx-auto mb-2" />}
                {activeTab === 'recycle' && <ShieldCheck className="w-12 h-12 text-purple-400 mx-auto mb-2" />}

                <h4 className="font-extrabold text-white text-base capitalize">{activeTab} Phase</h4>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {activeTab === 'collect' && 'Drop-off at FE Dept, Gate 1, or Gate 2 collected by volunteers.'}
                  {activeTab === 'repair' && 'Hardware diagnosis & component refurbishment by campus technicians.'}
                  {activeTab === 'reuse' && 'Re-allocated to students for coding labs & coursework.'}
                  {activeTab === 'recycle' && 'Certified zero-landfill precious metal recovery.'}
                </p>
              </motion.div>

              {/* Quadrant Tab Buttons */}
              <div className="grid grid-cols-4 gap-2 w-full z-10">
                {(['collect', 'repair', 'reuse', 'recycle'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-2 px-1 rounded-xl text-xs font-extrabold capitalize transition-all cursor-pointer ${
                      activeTab === tab
                        ? 'bright-gradient-emerald text-white shadow-md'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ROLE PORTAL ACCESS CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">Multi-Role Access</span>
          <h2 className="text-3xl font-black text-white">Sign In or Register by Category</h2>
          <p className="text-slate-400 text-xs font-medium">Select your campus role to sign in or create your user account</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Student Card */}
          <div className="bright-card p-6 rounded-3xl border-t-4 border-t-emerald-500 space-y-4 flex flex-col justify-between bg-[#131c2e]">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bright-gradient-emerald text-white flex items-center justify-center shadow-md">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white">Students</h3>
              <p className="text-xs text-slate-300">
                Submit old laptops/cables at drop bins & apply for refurbished devices in the reuse marketplace.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-extrabold text-xs text-center border border-slate-700">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 py-2 px-3 rounded-xl bright-gradient-emerald text-white font-extrabold text-xs text-center shadow-xs">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Volunteer Card */}
          <div className="bright-card p-6 rounded-3xl border-t-4 border-t-cyan-500 space-y-4 flex flex-col justify-between bg-[#131c2e]">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bright-gradient-cyan text-white flex items-center justify-center shadow-md">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white">Volunteers</h3>
              <p className="text-xs text-slate-300">
                Manage e-waste pickups across FE Department, Gate 1, & Gate 2 collection points.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-extrabold text-xs text-center border border-slate-700">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 py-2 px-3 rounded-xl bright-gradient-cyan text-white font-extrabold text-xs text-center shadow-xs">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Technician Card */}
          <div className="bright-card p-6 rounded-3xl border-t-4 border-t-amber-500 space-y-4 flex flex-col justify-between bg-[#131c2e]">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bright-gradient-amber text-white flex items-center justify-center shadow-md">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white">Technicians</h3>
              <p className="text-xs text-slate-300">
                Diagnose hardware, log repair timeline updates, and manage component inventory.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <Link href="/login" className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-extrabold text-xs text-center border border-slate-700">
                Sign In
              </Link>
              <Link href="/register" className="flex-1 py-2 px-3 rounded-xl bright-gradient-amber text-white font-extrabold text-xs text-center shadow-xs">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Admin Card */}
          <div className="bright-card p-6 rounded-3xl border-t-4 border-t-purple-500 space-y-4 flex flex-col justify-between bg-[#131c2e]">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bright-gradient-purple text-white flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg text-white">Single Admin</h3>
              <p className="text-xs text-slate-300">
                System governance, campus-wide analytics, audit logs, and compliance oversight.
              </p>
            </div>
            <div className="pt-2">
              <Link href="/login" className="w-full block py-2.5 px-3 rounded-xl bright-gradient-purple text-white font-extrabold text-xs text-center shadow-xs">
                Single Admin Sign In
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest">End-To-End Process</span>
          <h2 className="text-3xl font-black text-white">How EcoCycle Campus Operates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lifecycleSteps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.key}
                whileHover={{ y: -4 }}
                className="bright-card p-6 rounded-3xl space-y-4 bg-[#131c2e]"
              >
                <div className={`w-12 h-12 rounded-2xl ${step.color} flex items-center justify-center text-white shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-extrabold text-white text-base">{step.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed font-medium">{step.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bright-gradient-emerald text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-black">Ready to Join the Campus Sustainability Movement?</h3>
            <p className="text-emerald-100 text-xs sm:text-sm font-medium">
              Create an account or sign in to start submitting e-waste, collecting drop-offs, or claiming refurbished laptops.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/register"
              className="px-6 py-3.5 rounded-xl bg-white text-emerald-950 font-black hover:bg-emerald-50 transition-all text-xs shadow-lg"
            >
              Sign Up Now
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl bg-emerald-950/80 text-white font-black hover:bg-emerald-900 transition-all text-xs border border-emerald-400/40"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
