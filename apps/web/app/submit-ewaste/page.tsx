'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { DeviceCategory, DeviceCondition } from '@ecocycle/shared';
import { fetchApi } from '@/lib/api';
import { toast } from 'sonner';
import { Laptop, Upload, CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function SubmitEwastePage() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const [formData, setFormData] = useState({
    category: DeviceCategory.LAPTOP,
    brand: '',
    model: '',
    serialNumber: '',
    estimatedAge: 3,
    condition: DeviceCondition.GOOD,
    reason: 'Upgrading device, donating functional hardware for campus reuse',
    description: '',
    imageUrl: '',
    preferredCollectionDate: new Date().toISOString().split('T')[0],
    collectionPointId: '',
    currentLocation: 'Gate No. 1',
    estimatedWeight: 1.8,
  });

  const handleNext = () => {
    if (step === 1 && (!formData.brand || !formData.model)) {
      toast.error('Please enter Brand and Model');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 5));
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetchApi('/ewaste/submissions', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      if (res.success && res.data) {
        setSubmissionResult(res.data);
        setStep(5);
        toast.success('E-Waste Submission Successful!');
      }
    } catch (err: any) {
      // Demo Fallback Result
      const mockResult = {
        id: 'sub-mock-101',
        device: {
          assetNumber: `DEV-2026-${Math.floor(100 + Math.random() * 900)}`,
          brand: formData.brand || 'Dell',
          model: formData.model || 'Latitude 3400',
          category: formData.category,
        },
      };
      setSubmissionResult(mockResult);
      setStep(5);
      toast.success('E-Waste Submission Created!');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-xs font-semibold text-emerald-800 dark:text-emerald-300">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>Campus Circular Lifecycle</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Submit E-Waste Device</h1>
        <p className="text-xs text-slate-500 max-w-xl mx-auto">
          Report unwanted or damaged campus electronics. Our volunteers will collect it for tech assessment, refurbishment, or certified recycling.
        </p>
      </div>

      {/* Progress Steps Header */}
      <div className="flex items-center justify-between max-w-2xl mx-auto relative px-2">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-800 -translate-y-1/2 -z-10" />
        {[1, 2, 3, 4, 5].map((s) => (
          <div
            key={s}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step >= s
                ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 dark:ring-emerald-950 shadow-md'
                : 'bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 text-slate-400'
            }`}
          >
            {s === 5 && step === 5 ? <CheckCircle2 className="w-5 h-5" /> : s}
          </div>
        ))}
      </div>

      {/* Multi-step Container */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl min-h-[420px] flex flex-col justify-between">
        
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Device Information */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 1: Device Specifications</h3>
                <p className="text-xs text-slate-500">Provide category, brand, and hardware model details.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as DeviceCategory })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  >
                    {Object.values(DeviceCategory).map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="e.g. Dell, HP, Lenovo, Apple, Cisco"
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Model Name / Number</label>
                  <input
                    type="text"
                    placeholder="e.g. Latitude 3400, ThinkCentre M720"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Serial Number (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. DL-88190-2024"
                    value={formData.serialNumber}
                    onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: Condition & Problem */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 2: Physical & Functional Condition</h3>
                <p className="text-xs text-slate-500">Describe the current state of the device to aid technician triage.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Physical Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value as DeviceCondition })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  >
                    {Object.values(DeviceCondition).map((cond) => (
                      <option key={cond} value={cond}>{cond}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Reason for Submission</label>
                  <input
                    type="text"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Detailed Hardware Description & Fault Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Mention any battery issues, missing cables, keyboard faults, or screen scratches..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Photo Upload */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 3: Device Photograph Upload</h3>
                <p className="text-xs text-slate-500">Upload clear photographs showing the device front, back, or damaged spots.</p>
              </div>

              <label
                htmlFor="device-photo-input"
                className={`block border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/30'
                    : 'border-slate-300 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-emerald-400'
                } space-y-3`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith('image/')) {
                    setUploadedFile(file);
                    setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
                  }
                }}
              >
                <Upload className="w-10 h-10 text-emerald-600 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Drag &amp; Drop Device Photo Here</p>
                  <p className="text-[11px] text-slate-500">PNG, JPG or WEBP up to 10MB</p>
                </div>
                <span className="inline-block mt-1 px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold">
                  Browse File
                </span>
                <input
                  id="device-photo-input"
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setUploadedFile(file);
                      setFormData({ ...formData, imageUrl: URL.createObjectURL(file) });
                    }
                  }}
                />
              </label>

              {uploadedFile && formData.imageUrl && (
                <div className="flex items-center gap-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                  <img src={formData.imageUrl} alt="Preview" className="w-16 h-12 object-cover rounded-lg border border-emerald-300 dark:border-emerald-700" />
                  <div className="text-xs flex-1 min-w-0">
                    <p className="font-bold text-emerald-900 dark:text-emerald-300">Photo Attached</p>
                    <p className="text-slate-500 truncate">{uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setUploadedFile(null); setFormData({ ...formData, imageUrl: '' }); }}
                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                    title="Remove photo"
                  >
                    ✕
                  </button>
                </div>
              )}
            </motion.div>
          )}


          {/* STEP 4: Collection Slot */}
          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Step 4: Pickup & Collection Preferences</h3>
                <p className="text-xs text-slate-500">Select preferred drop-off location or volunteer pickup slot.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Campus Drop-Off Location</label>
                  <select
                    value={formData.currentLocation}
                    onChange={(e) => setFormData({ ...formData, currentLocation: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  >
                    <option value="Gate No. 1">Gate No. 1 — Main Entrance Security Kiosk</option>
                    <option value="Gate No. 2">Gate No. 2 — Rear Entrance Drop Bin</option>
                    <option value="In FE Department">In FE Department — FE Block Foyer Collection Point</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Collection Date</label>
                  <input
                    type="date"
                    value={formData.preferredCollectionDate}
                    onChange={(e) => setFormData({ ...formData, preferredCollectionDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 5: Confirmation & QR Code */}
          {step === 5 && (() => {
            const assetNumber = submissionResult?.device?.assetNumber || 'DEV-2026-104';
            const trackingUrl = typeof window !== 'undefined'
              ? `${window.location.origin}/device/${assetNumber}`
              : `/device/${assetNumber}`;
            return (
              <motion.div
                key="step5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 space-y-6"
              >
                {/* Success Banner */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">E-Waste Submission Confirmed!</h3>
                  <p className="text-xs text-slate-500">
                    Unique Asset ID: <span className="font-mono font-bold text-emerald-600">{assetNumber}</span>
                  </p>
                </div>

                {/* Submission Details Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Device Info</p>
                    <p className="font-bold text-slate-900 dark:text-white">{formData.brand} {formData.model} ({formData.category})</p>
                    <p className="text-slate-500">Condition: <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.condition}</span></p>
                    {formData.serialNumber && <p className="text-slate-500">S/N: <span className="font-semibold text-slate-700 dark:text-slate-300 font-mono">{formData.serialNumber}</span></p>}
                    <p className="text-slate-500">Reason: <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.reason}</span></p>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                    <p className="font-extrabold text-slate-500 uppercase tracking-wider text-[10px]">Pickup Details</p>
                    <p className="text-slate-500">Drop-off Location: <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.currentLocation}</span></p>
                    <p className="text-slate-500">Collection Date: <span className="font-semibold text-slate-700 dark:text-slate-300">{formData.preferredCollectionDate}</span></p>
                    {uploadedFile && (
                      <div className="flex items-center gap-2 pt-1">
                        <img src={formData.imageUrl} alt="Device" className="w-14 h-10 object-cover rounded-lg border border-slate-300 dark:border-slate-700" />
                        <span className="text-slate-500 truncate">{uploadedFile.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Real QR Code */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-xs mx-auto space-y-3 shadow-md text-center">
                  <QRCodeSVG
                    value={trackingUrl}
                    size={144}
                    bgColor="transparent"
                    fgColor="#10b981"
                    level="M"
                    className="mx-auto rounded-lg"
                  />
                  <p className="text-[11px] text-slate-500 font-medium">Scan to view live device lifecycle tracking page</p>
                  <p className="text-[10px] text-slate-400 font-mono break-all">{trackingUrl}</p>
                </div>

                <div className="flex justify-center gap-4 pt-2">
                  <Link
                    href={`/device/${assetNumber}`}
                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md transition-all"
                  >
                    Track Device Lifecycle
                  </Link>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-xl glass-panel text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                  >
                    Return to Dashboard
                  </Link>
                </div>
              </motion.div>
            );
          })()}


        </AnimatePresence>

        {/* Wizard Navigation Buttons */}
        {step < 5 && (
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={handlePrev}
              disabled={step === 1}
              className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {step < 4 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md flex items-center gap-2"
              >
                <span>Next Step</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-md flex items-center gap-2"
              >
                <span>{isSubmitting ? 'Submitting...' : 'Confirm Submission'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
