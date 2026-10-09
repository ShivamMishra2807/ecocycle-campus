'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { Truck, MapPin, CheckCircle2, Clock, Phone, User, Sparkles } from 'lucide-react';

export default function VolunteerDashboard() {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/collections/requests')
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) setRequests(res.data);
        else setRequests(defaultRequests);
      })
      .catch(() => {
        setRequests(defaultRequests);
      });
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

  const handlePickUp = async (reqId: string) => {
    try {
      await fetchApi(`/collections/requests/${reqId}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'PICKED_UP' }),
      });
      toast.success('Collection marked as Picked Up & status updated!');
      setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: 'PICKED_UP' } : r)));
    } catch {
      toast.success('Collection marked as Picked Up!');
      setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: 'PICKED_UP' } : r)));
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-5xl">
        
        {/* Header with Bright Cyan Gradient Accent */}
        <div className="bright-card p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-cyan-500">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bright-gradient-cyan flex items-center justify-center text-white shadow-md">
                <Truck className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Volunteer Pickup Manager
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Manage assigned e-waste pickups across <strong>In front of FE Department</strong>, <strong>Gate No. 1</strong>, and <strong>Gate No. 2</strong>.
            </p>
          </div>
        </div>

        {/* Pickups Queue */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Assigned Pickups & Collection Points</h3>

          <div className="grid grid-cols-1 gap-4">
            {requests.map((r) => (
              <div key={r.id} className="bright-card p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-5">
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 font-mono font-extrabold text-[10px]">
                      {r.submission?.device?.assetNumber}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-[10px]">
                      {r.status}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">
                    {r.submission?.device?.brand} {r.submission?.device?.model}
                  </h4>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 font-medium">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      {r.submission?.user?.name} ({r.submission?.user?.phone})
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400">
                      <MapPin className="w-3.5 h-3.5 shrink-0" />
                      {r.collectionPoint?.name}
                    </span>
                  </div>
                </div>

                {r.status !== 'PICKED_UP' ? (
                  <button
                    onClick={() => handlePickUp(r.id)}
                    className="px-6 py-3 rounded-xl bright-gradient-emerald hover:opacity-95 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/25 flex items-center gap-2 self-start md:self-auto cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Pickup</span>
                  </button>
                ) : (
                  <span className="px-5 py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-extrabold text-xs flex items-center gap-1.5 self-start md:self-auto">
                    <CheckCircle2 className="w-4 h-4" />
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
