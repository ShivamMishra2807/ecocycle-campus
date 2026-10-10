'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { QrCode, CheckCircle2, Clock, Wrench, RefreshCw, ShieldCheck, MapPin, User, ArrowLeft, AlertCircle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function DeviceTrackingClient({ assetNumber }: { assetNumber: string }) {
  const [device, setDevice] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi(`/devices/${assetNumber}`)
      .then((res) => {
        if (res.success && res.data) setDevice(res.data);
      })
      .catch(() => {
        // Fallback demo device view if backend offline
        setDevice({
          assetNumber,
          category: 'LAPTOP',
          brand: 'Dell',
          model: 'Latitude 3400',
          condition: 'GOOD',
          status: 'UNDER_REPAIR',
          currentLocation: 'Hardware Maintenance Workshop - Bench #3',
          estimatedWeight: 1.8,
          description: 'Fully refurbished Dell laptop with 8GB RAM & 256GB SSD.',
          owner: { name: 'Rohan Gupta', email: 'student@ecocycle.local' },
          assessments: [{ technician: { name: 'Suresh Kumar' }, recommendedAction: 'REPAIR', diagnosis: 'Motherboard healthy, SMPS fan replaced.' }],
          repairTickets: [{ status: 'IN_PROGRESS', priority: 'HIGH', issue: 'Random power off in simulation labs', technician: { name: 'Suresh Kumar' } }],
        });
      })
      .finally(() => setIsLoading(false));
  }, [assetNumber]);

  const lifecycleStages = [
    { key: 'REPORTED', label: 'Submitted', desc: 'Reported by Student', icon: CheckCircle2 },
    { key: 'COLLECTION_PENDING', label: 'Collection Scheduled', desc: 'Assigned to Eco-Volunteer', icon: Clock },
    { key: 'COLLECTED', label: 'Collected', desc: 'Received at Central Hub', icon: MapPin },
    { key: 'UNDER_ASSESSMENT', label: 'Assessed', desc: 'Diagnosed by Technician', icon: ShieldCheck },
    { key: 'UNDER_REPAIR', label: 'Under Repair', desc: 'Parts replaced & tested', icon: Wrench },
    { key: 'REFURBISHED', label: 'Refurbished', desc: 'Cleaned & OS updated', icon: RefreshCw },
    { key: 'AVAILABLE_FOR_REUSE', label: 'Available for Reuse', desc: 'Listed on Marketplace', icon: CheckCircle2 },
  ];

  const getStageIndex = (status: string) => {
    switch (status) {
      case 'REPORTED': return 0;
      case 'COLLECTION_PENDING': return 1;
      case 'COLLECTED': return 2;
      case 'UNDER_ASSESSMENT': return 3;
      case 'REPAIR_REQUIRED':
      case 'UNDER_REPAIR': return 4;
      case 'REFURBISHED': return 5;
      case 'AVAILABLE_FOR_REUSE':
      case 'ALLOCATED': return 6;
      case 'SENT_FOR_RECYCLING':
      case 'RECYCLED': return 6;
      default: return 2;
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-600 border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-slate-500 font-medium">Fetching Device Lifecycle History...</p>
      </div>
    );
  }

  const activeStageIdx = getStageIndex(device?.status || 'REPORTED');

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Back Link */}
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      {/* Main Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono font-bold text-xs">
              {device?.assetNumber}
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs uppercase">
              {device?.category}
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {device?.brand} {device?.model}
          </h1>

          <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
            <div>
              <p className="text-slate-400 font-medium">Current Location</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{device?.currentLocation || 'Campus Hub'}</span>
              </p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Responsible Person</p>
              <p className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5 mt-0.5">
                <User className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{device?.assessments?.[0]?.technician?.name || device?.owner?.name || 'Technician Suresh'}</span>
              </p>
            </div>
          </div>
        </div>

        {/* QR Code Card */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-2 shadow-sm">
          <QRCodeSVG
            value={`${typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000'}/device/${device?.assetNumber || assetNumber}`}
            size={112}
            bgColor="transparent"
            fgColor="#10b981"
            level="M"
            className="mx-auto"
          />
          <p className="text-[10px] text-slate-400 font-mono">Scan QR for instant status update</p>
        </div>
      </div>

      {/* VISUAL TIMELINE CARD */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Device Lifecycle Stage Timeline</h3>

        <div className="space-y-6 relative pl-6 border-l-2 border-slate-200 dark:border-slate-800">
          {lifecycleStages.map((stage, idx) => {
            const isCompleted = idx <= activeStageIdx;
            const isCurrent = idx === activeStageIdx;
            const Icon = stage.icon;

            return (
              <motion.div
                key={stage.key}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="relative"
              >
                {/* Step Circle Node */}
                <div
                  className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs ${
                    isCurrent
                      ? 'bg-emerald-600 ring-4 ring-emerald-100 dark:ring-emerald-950 scale-110'
                      : isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-3">
                    <p className={`text-sm font-bold ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                      {stage.label}
                    </p>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold uppercase">
                        Current Status
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500">{stage.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* TECHNICIAN REPAIR FEEDBACK CARD */}
      {(device?.repairTickets?.length > 0 || device?.assessments?.length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8 rounded-3xl border border-amber-200 dark:border-amber-800 shadow-xl space-y-5 bg-amber-50/40 dark:bg-amber-950/20"
        >
          <div className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Technician Repair Feedback</h3>
          </div>

          {/* Assessment Notes */}
          {device?.assessments?.map((a: any, i: number) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 space-y-2">
              <div className="flex items-center gap-2 text-xs">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span className="font-bold text-slate-700 dark:text-slate-300">{a.technician?.name || 'Technician'}</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-extrabold uppercase text-[10px]">
                  {a.recommendedAction}
                </span>
              </div>
              {a.diagnosis && (
                <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300">Diagnosis: </span>{a.diagnosis}
                </p>
              )}
            </div>
          ))}

          {/* Repair Ticket Updates */}
          {device?.repairTickets?.map((ticket: any, i: number) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2.5 py-1 rounded-full bg-rose-100 dark:bg-rose-950 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 font-extrabold uppercase text-[10px]">
                    {ticket.priority} Priority
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-extrabold uppercase text-[10px]">
                    {ticket.status?.replace(/_/g, ' ')}
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-medium">{ticket.technician?.name}</span>
              </div>
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Issue: <span className="font-normal text-slate-600 dark:text-slate-400">{ticket.issue}</span>
              </p>

              {/* Ticket Updates Timeline */}
              {ticket.updates && ticket.updates.length > 0 && (
                <div className="space-y-2 pl-4 border-l-2 border-amber-300 dark:border-amber-700">
                  {ticket.updates.map((u: any, j: number) => (
                    <div key={j} className="text-xs space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                        <span className="font-extrabold text-slate-800 dark:text-white uppercase text-[10px]">{u.status}</span>
                        {u.createdAt && (
                          <span className="text-slate-400 text-[10px]">
                            — {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-500 pl-4 font-medium">{u.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* No updates yet */}
              {(!ticket.updates || ticket.updates.length === 0) && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Repair is in progress. No updates logged yet by the technician.</span>
                </div>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
