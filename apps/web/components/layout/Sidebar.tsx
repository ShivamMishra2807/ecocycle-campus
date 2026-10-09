'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { Role } from '@ecocycle/shared';
import { LayoutDashboard, Laptop, PlusCircle, ShoppingBag, MapPin, Leaf, Shield, Wrench, Truck, FileText, History, Settings } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const userRole = user?.role || Role.STUDENT;

  const baseLinks = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/submit-ewaste', label: 'Submit E-Waste', icon: PlusCircle },
    { href: '/marketplace', label: 'Reuse Marketplace', icon: ShoppingBag },
    { href: '/collection-points', label: 'Collection Points', icon: MapPin },
    { href: '/impact', label: 'Impact & Analytics', icon: Leaf },
  ];

  const roleSpecificLinks = [];

  if (userRole === Role.VOLUNTEER) {
    roleSpecificLinks.push({ href: '/dashboard/volunteer', label: 'Volunteer Pickups', icon: Truck });
  }

  if (userRole === Role.TECHNICIAN) {
    roleSpecificLinks.push({ href: '/dashboard/technician', label: 'Technician Workbench', icon: Wrench });
  }

  if (userRole === Role.ADMIN || userRole === Role.SUPER_ADMIN) {
    roleSpecificLinks.push(
      { href: '/dashboard/admin', label: 'Single Admin Panel', icon: Shield },
      { href: '/dashboard/technician', label: 'Repair Workbench', icon: Wrench },
      { href: '/dashboard/volunteer', label: 'Collection Queue', icon: Truck },
    );
  }

  return (
    <aside className="w-64 glass-panel border-r border-slate-800 bg-[#131c2e] hidden md:block min-h-[calc(100vh-4rem)] p-4">
      <div className="space-y-6">
        <div>
          <h3 className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">
            Main Navigation
          </h3>
          <nav className="space-y-1.5">
            {baseLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bright-gradient-emerald text-white shadow-md shadow-emerald-500/25'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {roleSpecificLinks.length > 0 && (
          <div>
            <h3 className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5">
              {userRole} Workspace
            </h3>
            <nav className="space-y-1.5">
              {roleSpecificLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bright-gradient-emerald text-white shadow-md shadow-emerald-500/25'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </aside>
  );
}
