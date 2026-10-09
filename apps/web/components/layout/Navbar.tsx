'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { Recycle, LogIn, UserPlus, User, LogOut, ShieldCheck, Wrench, Truck, GraduationCap, ChevronDown, Moon, Sun } from 'lucide-react';

export function Navbar() {
  const { user, theme, toggleTheme, quickDemoLogin, logout } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800 bg-[#090e1a]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo with Glowing Emerald Icon */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bright-gradient-emerald flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-200">
            <Recycle className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
              EcoCycle <span className="text-emerald-400 font-extrabold">Campus</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold tracking-wider uppercase">Campus Sustainability Hub</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-extrabold text-slate-300">
          <Link href="/dashboard" className="hover:text-emerald-400 transition-colors">Dashboard</Link>
          <Link href="/submit-ewaste" className="hover:text-emerald-400 transition-colors">Submit E-Waste</Link>
          <Link href="/marketplace" className="hover:text-emerald-400 transition-colors">Reuse Marketplace</Link>
          <Link href="/collection-points" className="hover:text-emerald-400 transition-colors">Collection Points</Link>
          <Link href="/impact" className="hover:text-emerald-400 transition-colors">Campus Impact</Link>
        </nav>

        {/* Right Actions: Sign In, Sign Up, Quick Role Switcher, Theme Toggle, User Profile */}
        <div className="flex items-center gap-2.5">
          
          {/* Explicit Sign In & Sign Up Action Buttons */}
          <Link
            href="/login"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-extrabold text-white transition-all shadow-xs"
          >
            <LogIn className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sign In</span>
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bright-gradient-emerald hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Sign Up</span>
          </Link>

          {/* Quick Demo Role Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-950/80 border border-cyan-800 text-xs font-extrabold text-cyan-300 hover:bg-cyan-900/80 transition-all shadow-xs cursor-pointer"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>Role: {user?.role || 'STUDENT'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#131c2e] rounded-2xl shadow-2xl border border-slate-800 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3.5 py-1.5 border-b border-slate-800 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                  Quick Role Demo Account Switcher
                </div>
                <button
                  onClick={() => { quickDemoLogin('STUDENT'); setShowRoleMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                >
                  <GraduationCap className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <p className="leading-none text-white">Student Account</p>
                    <p className="text-[10px] text-slate-400 font-normal">Rohan Gupta (Multiple Students)</p>
                  </div>
                </button>
                <button
                  onClick={() => { quickDemoLogin('VOLUNTEER'); setShowRoleMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                >
                  <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <p className="leading-none text-white">Volunteer Account</p>
                    <p className="text-[10px] text-slate-400 font-normal">Ananya Roy (Multiple Volunteers)</p>
                  </div>
                </button>
                <button
                  onClick={() => { quickDemoLogin('TECHNICIAN'); setShowRoleMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left"
                >
                  <Wrench className="w-4 h-4 text-amber-400 shrink-0" />
                  <div>
                    <p className="leading-none text-white">Technician Account</p>
                    <p className="text-[10px] text-slate-400 font-normal">Suresh Kumar (Multiple Techs)</p>
                  </div>
                </button>
                <button
                  onClick={() => { quickDemoLogin('ADMIN'); setShowRoleMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-200 hover:bg-slate-800 transition-colors text-left border-t border-slate-800"
                >
                  <ShieldCheck className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <p className="leading-none text-purple-300 font-extrabold">Single Admin Account</p>
                    <p className="text-[10px] text-slate-400 font-normal">Dr. Aris Thorne (Chief Admin)</p>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Moon className="w-4 h-4 text-emerald-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-emerald-400 transition-all cursor-pointer"
            >
              <img
                src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={user?.name || 'User Avatar'}
                className="w-9 h-9 rounded-full object-cover border-2 border-emerald-400"
              />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-52 bg-[#131c2e] rounded-2xl shadow-2xl border border-slate-800 py-2 z-50">
                <div className="px-4 py-2.5 border-b border-slate-800">
                  <p className="text-xs font-extrabold text-white">{user?.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
                </div>
                <Link
                  href="/dashboard"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-slate-800"
                >
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>My Dashboard</span>
                </Link>
                <button
                  onClick={() => { logout(); setShowUserMenu(false); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
