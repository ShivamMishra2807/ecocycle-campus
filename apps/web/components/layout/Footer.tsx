'use client';

import React from 'react';
import Link from 'next/link';
import { Recycle, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 py-10 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100">EcoCycle Campus</p>
              <p className="text-xs text-slate-500">Circular Economy & E-Waste Management Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-medium">
            <Link href="/" className="hover:text-emerald-600 transition-colors">Home</Link>
            <Link href="/submit-ewaste" className="hover:text-emerald-600 transition-colors">Submit E-Waste</Link>
            <Link href="/marketplace" className="hover:text-emerald-600 transition-colors">Reuse Marketplace</Link>
            <Link href="/impact" className="hover:text-emerald-600 transition-colors">Impact Analytics</Link>
            <a href="http://localhost:5000/api/docs" target="_blank" rel="noreferrer" className="hover:text-emerald-600 transition-colors">API Docs</a>
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for Sustainable University Campuses</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
