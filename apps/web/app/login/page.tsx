'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Recycle, Lock, Mail, ShieldCheck, Wrench, Truck, GraduationCap, ArrowRight, UserCheck, Info } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, quickDemoLogin } = useAuth();
  const [selectedRoleTab, setSelectedRoleTab] = useState<'STUDENT' | 'VOLUNTEER' | 'TECHNICIAN' | 'ADMIN'>('STUDENT');
  const [email, setEmail] = useState('student@ecocycle.local');
  const [password, setPassword] = useState('Student@123');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick Demo account lists for multiple accounts per role & single admin
  const demoAccounts = {
    STUDENT: [
      { name: 'Rohan Gupta', email: 'student@ecocycle.local', pass: 'Student@123', dept: 'Computer Science (CSE)' },
      { name: 'Neha Sharma', email: 'neha.student@ecocycle.local', pass: 'Student@123', dept: 'First Year Engineering (FE)' },
      { name: 'Siddharth Verma', email: 'sid.student@ecocycle.local', pass: 'Student@123', dept: 'Electronics (ECE)' },
    ],
    VOLUNTEER: [
      { name: 'Ananya Roy', email: 'volunteer@ecocycle.local', pass: 'Vol@123', zone: 'FE Dept Zone Lead' },
      { name: 'Vikram Patel', email: 'vikram.vol@ecocycle.local', pass: 'Vol@123', zone: 'Gate No. 1 Zone Lead' },
      { name: 'Sneha Rao', email: 'sneha.vol@ecocycle.local', pass: 'Vol@123', zone: 'Gate No. 2 Zone Lead' },
    ],
    TECHNICIAN: [
      { name: 'Suresh Kumar', email: 'technician@ecocycle.local', pass: 'Tech@123', spec: 'Hardware & Motherboard Spec' },
      { name: 'Priya Nair', email: 'priya.tech@ecocycle.local', pass: 'Tech@123', spec: 'Display & Electronics Spec' },
      { name: 'Rajesh Deshmukh', email: 'rajesh.tech@ecocycle.local', pass: 'Tech@123', spec: 'Lab Tech & Refurbishment' },
    ],
    ADMIN: [
      { name: 'Dr. Aris Thorne', email: 'admin@ecocycle.local', pass: 'Admin@123', spec: 'Chief Campus Administrator (Single Admin)' },
    ],
  };

  const handleSelectAccount = (acc: { email: string; pass: string }) => {
    setEmail(acc.email);
    setPassword(acc.pass);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login(email, password);
      router.push('/dashboard');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickDemo = async (role: 'ADMIN' | 'TECHNICIAN' | 'VOLUNTEER' | 'STUDENT') => {
    await quickDemoLogin(role);
    router.push('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-[#090e1a]">
      <div className="w-full max-w-xl space-y-6 bg-[#131c2e] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bright-gradient-emerald flex items-center justify-center text-white mx-auto shadow-lg shadow-emerald-500/30">
            <Recycle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            EcoCycle Portal Sign In
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Select your role category to sign in to your campus e-waste dashboard
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#090e1a] border border-slate-800">
          <button
            onClick={() => { setSelectedRoleTab('STUDENT'); handleSelectAccount(demoAccounts.STUDENT[0]); }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedRoleTab === 'STUDENT'
                ? 'bright-gradient-emerald text-white shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Students</span>
          </button>

          <button
            onClick={() => { setSelectedRoleTab('VOLUNTEER'); handleSelectAccount(demoAccounts.VOLUNTEER[0]); }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedRoleTab === 'VOLUNTEER'
                ? 'bright-gradient-cyan text-white shadow-md shadow-cyan-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Truck className="w-4 h-4" />
            <span>Volunteers</span>
          </button>

          <button
            onClick={() => { setSelectedRoleTab('TECHNICIAN'); handleSelectAccount(demoAccounts.TECHNICIAN[0]); }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedRoleTab === 'TECHNICIAN'
                ? 'bright-gradient-amber text-white shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Wrench className="w-4 h-4" />
            <span>Technicians</span>
          </button>

          <button
            onClick={() => { setSelectedRoleTab('ADMIN'); handleSelectAccount(demoAccounts.ADMIN[0]); }}
            className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              selectedRoleTab === 'ADMIN'
                ? 'bright-gradient-purple text-white shadow-md shadow-purple-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin</span>
          </button>
        </div>

        {/* Demo Accounts List for Selected Role */}
        <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              {selectedRoleTab === 'ADMIN' ? 'Single Admin Account' : `Multiple ${selectedRoleTab} Accounts`}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 font-extrabold">
              Click to Auto-fill
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {demoAccounts[selectedRoleTab].map((acc, idx) => {
              const isSelected = email === acc.email;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAccount(acc)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-[#1a2744] border-emerald-500 ring-2 ring-emerald-500/30 shadow-md'
                      : 'bg-[#090e1a]/80 border-slate-800 hover:border-emerald-500/50'
                  }`}
                >
                  <div>
                    <p className="text-xs font-black text-white leading-tight">{acc.name}</p>
                    <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">{acc.email}</p>
                  </div>
                  <span className="text-[9px] font-extrabold text-emerald-400 mt-2 block">
                    {'dept' in acc ? acc.dept : 'zone' in acc ? acc.zone : acc.spec}
                  </span>
                </button>
              );
            })}
          </div>

          {selectedRoleTab === 'ADMIN' && (
            <div className="flex items-start gap-2 p-2.5 rounded-xl bg-purple-950/50 border border-purple-800 text-[11px] text-purple-200 font-medium">
              <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <span>
                <strong>Single Admin Login:</strong> System policy enforces 1 Chief Administrator account (<code className="font-mono bg-purple-900 px-1 py-0.5 rounded text-purple-200 font-bold">admin@ecocycle.local</code>) for security & governance.
              </span>
            </div>
          )}
        </div>

        {/* Login Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@ecocycle.local"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 rounded-xl bright-gradient-emerald hover:opacity-95 text-white text-xs font-black shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <span>{isSubmitting ? 'Signing In...' : `Sign In as ${selectedRoleTab}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link to Register */}
        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-xs font-medium text-slate-400">
            Don't have an account yet?{' '}
            <Link href="/register" className="font-extrabold text-emerald-400 hover:underline">
              Register Student, Volunteer or Technician Account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
