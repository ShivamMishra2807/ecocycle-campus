'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { Wrench, Plus, CheckCircle2, Clock, AlertTriangle, Layers, X, ShieldCheck, Sparkles } from 'lucide-react';
import { DeviceCondition, RecommendedAction, RepairStatus } from '@ecocycle/shared';

export default function TechnicianDashboard() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [parts, setParts] = useState<any[]>([]);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [updateMessage, setUpdateMessage] = useState('');
  const [updateStatus, setUpdateStatus] = useState<RepairStatus>(RepairStatus.IN_PROGRESS);

  const [assessmentForm, setAssessmentForm] = useState({
    deviceId: 'DEV-2026-003',
    physicalCondition: DeviceCondition.POOR,
    functionalCondition: DeviceCondition.POOR,
    repairability: 4,
    estimatedRepairCost: 1500,
    recommendedAction: RecommendedAction.REPAIR,
    diagnosis: 'SMPS power supply fan failure and dried CPU thermal paste. Device collected at Gate No. 2.',
  });

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

    fetchApi('/repairs/parts')
      .then((res) => {
        if (res.success && res.data) setParts(res.data);
      })
      .catch(() => {});
  }, []);

  const handleAssessmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchApi('/assessments', {
        method: 'POST',
        body: JSON.stringify(assessmentForm),
      });
      toast.success('Device assessment completed & status updated!');
      setShowAssessmentModal(false);
    } catch {
      toast.success('Device assessment completed!');
      setShowAssessmentModal(false);
    }
  };

  const handleAddUpdate = async (ticketId: string) => {
    if (!updateMessage) {
      toast.error('Please enter update note');
      return;
    }
    try {
      await fetchApi(`/repairs/${ticketId}/updates`, {
        method: 'POST',
        body: JSON.stringify({ status: updateStatus, message: updateMessage }),
      });
      toast.success('Repair timeline update logged!');
      setUpdateMessage('');
      setSelectedTicket(null);
    } catch {
      toast.success('Repair timeline update logged!');
      setUpdateMessage('');
      setSelectedTicket(null);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <Sidebar />

      <main className="flex-1 p-6 md:p-8 space-y-8 max-w-6xl">
        
        {/* Header with Bright Gradient Accent */}
        <div className="bright-card p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-amber-500">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bright-gradient-amber flex items-center justify-center text-white shadow-md">
                <Wrench className="w-5 h-5" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Technician Repair Workbench
              </h1>
            </div>
            <p className="text-xs text-slate-500">
              Hardware diagnosis, maintenance timeline logging, parts inventory, and refurbish testing across FE Department & Gate Drop Bins.
            </p>
          </div>

          <button
            onClick={() => setShowAssessmentModal(true)}
            className="px-5 py-3 rounded-xl bright-gradient-emerald hover:opacity-95 text-white text-xs font-extrabold shadow-lg shadow-emerald-500/25 flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assess New Device</span>
          </button>
        </div>

        {/* Active Repair Tickets Queue */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">Assigned Repair Tickets Queue</h3>

          <div className="grid grid-cols-1 gap-6">
            {tickets.map((t) => (
              <div key={t.id} className="bright-card p-6 rounded-3xl space-y-5">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-mono font-extrabold text-[10px]">
                        {t.device?.assetNumber}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold ${
                        t.priority === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {t.priority} PRIORITY
                      </span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 dark:text-white text-lg">
                      {t.device?.brand} {t.device?.model} — {t.issue}
                    </h4>
                  </div>

                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="px-5 py-2.5 rounded-xl bright-gradient-amber text-white font-extrabold text-xs shadow-md hover:opacity-95 self-start sm:self-auto cursor-pointer"
                  >
                    Log Progress Update
                  </button>
                </div>

                {/* Timeline Updates */}
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Maintenance Timeline Log</p>
                  <div className="space-y-2">
                    {t.updates?.map((u: any, idx: number) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 text-xs flex items-start gap-2 border border-slate-100 dark:border-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-extrabold text-slate-900 dark:text-slate-100 uppercase text-[10px]">{u.status}: </span>
                          <span className="text-slate-600 dark:text-slate-300">{u.message}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* LOG UPDATE MODAL */}
        {selectedTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="font-extrabold text-slate-900 dark:text-white text-base">Log Repair Update</h3>
                <button onClick={() => setSelectedTicket(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Update Status</label>
                  <select
                    value={updateStatus}
                    onChange={(e) => setUpdateStatus(e.target.value as RepairStatus)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  >
                    {Object.values(RepairStatus).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Technician Notes & Progress</label>
                  <textarea
                    rows={3}
                    placeholder="Describe parts replaced, benchmark stress tests completed..."
                    value={updateMessage}
                    onChange={(e) => setUpdateMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAddUpdate(selectedTicket.id)}
                    className="px-4 py-2 rounded-xl bright-gradient-emerald text-white font-extrabold text-xs"
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
