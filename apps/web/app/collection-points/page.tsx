'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import { MapPin, Clock, Layers, CheckCircle2, Sparkles, Building, Box, ShieldCheck, Phone } from 'lucide-react';

export default function CollectionPointsPage() {
  const [points, setPoints] = useState<any[]>([]);

  useEffect(() => {
    fetchApi('/collections/points')
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setPoints(res.data);
        } else {
          setPoints(defaultPoints);
        }
      })
      .catch(() => {
        setPoints(defaultPoints);
      });
  }, []);

  const defaultPoints = [
    {
      id: 'cp-fe',
      name: 'In front of FE Department',
      building: 'First Year Engineering (FE) Block',
      floor: 'Main Entrance Foyer',
      room: 'Eco Drop Box #1',
      operatingHours: '08:00 AM - 07:00 PM',
      capacity: 150,
      currentLoad: 45,
      description: 'Primary e-waste drop-off bin located directly in front of the First Year Engineering department building entrance.',
    },
    {
      id: 'cp-gate1',
      name: 'Gate No. 1',
      building: 'Main Campus Entrance Gate 1',
      floor: 'Security Office Kiosk',
      room: 'Drop Bin Gate 1',
      operatingHours: '24 Hours Open',
      capacity: 200,
      currentLoad: 80,
      description: '24/7 accessible collection hub right at Campus Gate No. 1 security area for convenient drop-offs.',
    },
    {
      id: 'cp-gate2',
      name: 'Gate No. 2',
      building: 'Campus Rear Entrance Gate 2',
      floor: 'Visitor Parking Hub',
      room: 'Drop Bin Gate 2',
      operatingHours: '06:00 AM - 10:00 PM',
      capacity: 120,
      currentLoad: 25,
      description: 'Collection point situated at Gate No. 2 visitor parking junction, equipped with sensor-monitored e-waste bin.',
    },
  ];

  const activePoints = points.length > 0 ? points : defaultPoints;

  return (
    <div className="min-h-screen bg-[#090e1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Page Header */}
        <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-xs font-bold text-emerald-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Official Campus Drop Bins</span>
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">
              Campus Collection Points
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Locate authorized e-waste collection points: In front of FE Department, Gate No. 1, and Gate No. 2.
            </p>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-xs font-bold text-emerald-300">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>3 Active Collection Bins Monitored Daily</span>
          </div>
        </div>

        {/* Collection Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePoints.map((pt) => {
            const loadPercent = Math.round((pt.currentLoad / pt.capacity) * 100);
            return (
              <div
                key={pt.id || pt.name}
                className="bright-card p-6 rounded-3xl space-y-5 flex flex-col justify-between bg-[#131c2e]"
              >
                <div className="space-y-4">
                  
                  {/* Status Badge & Icon */}
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bright-gradient-emerald flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-950 border border-emerald-800 text-emerald-300 font-black text-[10px] uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Active Bin</span>
                    </span>
                  </div>

                  {/* Point Title & Building */}
                  <div>
                    <h3 className="font-black text-white text-lg leading-snug">
                      {pt.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5 mt-1">
                      <Building className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{pt.building}</span>
                    </p>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed bg-[#090e1a] p-3 rounded-xl border border-slate-800 font-medium">
                    {pt.description || `Collection point at ${pt.name}, open for student and staff e-waste submissions.`}
                  </p>

                  {/* Details Card */}
                  <div className="p-3.5 rounded-2xl bg-[#090e1a] border border-slate-800 text-xs space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-medium flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        <span>Hours:</span>
                      </span>
                      <span className="font-bold text-white">{pt.operatingHours}</span>
                    </div>

                    {/* Load Bar */}
                    <div className="space-y-1.5 pt-1 border-t border-slate-800">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span className="text-slate-400">Live Capacity</span>
                        <span className={loadPercent > 80 ? 'text-amber-400' : 'text-emerald-400'}>
                          {pt.currentLoad} / {pt.capacity} kg ({loadPercent}%)
                        </span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            loadPercent > 80 ? 'bright-gradient-amber' : 'bright-gradient-emerald'
                          }`}
                          style={{ width: `${loadPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
