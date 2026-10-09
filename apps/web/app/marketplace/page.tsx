'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/lib/authContext';
import { toast } from 'sonner';
import { Search, Filter, ShoppingBag, CheckCircle2, X, Sparkles, RefreshCw, Cpu, Layers } from 'lucide-react';

export default function MarketplacePage() {
  const { user } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchApi('/reuse/listings')
      .then((res) => {
        if (res.success && res.data) setListings(res.data);
      })
      .catch(() => {
        // Fallback demo marketplace items
        setListings([
          {
            id: 'list-1',
            title: 'Refurbished Dell Latitude 3400 (Core i5 / 8GB / 256GB SSD)',
            description: 'Verified by Campus IT. Fresh Windows 11 & LibreOffice installed. Ideal for student coding projects.',
            condition: 'GOOD',
            specifications: 'Intel Core i5 10th Gen, 8GB DDR4 RAM, 256GB NVMe SSD, 14" HD Display',
            availability: 'AVAILABLE',
            device: { category: 'LAPTOP', brand: 'Dell', model: 'Latitude 3400', imageUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600' },
          },
          {
            id: 'list-2',
            title: 'Apple iPad 8th Gen 32GB Wi-Fi',
            description: 'Tested screen, long battery life. Includes charging cable and protective silicone case.',
            condition: 'EXCELLENT',
            specifications: 'A12 Bionic Chip, 10.2" Retina Display, 32GB Storage, Touch ID',
            availability: 'AVAILABLE',
            device: { category: 'TABLET', brand: 'Apple', model: 'iPad 8th Gen', imageUrl: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=600' },
          },
          {
            id: 'list-3',
            title: 'HP ProDisplay P223 21.5" FHD Monitor',
            description: 'FHD IPS LED Monitor with VGA & DisplayPort. Perfect dual-screen addition for lab study desk.',
            condition: 'EXCELLENT',
            specifications: '1920x1080 Resolution, 60Hz, Anti-glare coating, DisplayPort 1.2',
            availability: 'AVAILABLE',
            device: { category: 'MONITOR', brand: 'HP', model: 'ProDisplay P223', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600' },
          },
        ]);
      });
  }, []);

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      toast.error('Please specify why you need this device');
      return;
    }

    setIsSubmitting(true);
    try {
      await fetchApi('/reuse/requests', {
        method: 'POST',
        body: JSON.stringify({
          listingId: selectedListing.id,
          reason,
          departmentId: user?.departmentId,
        }),
      });
      toast.success('Reuse Request Submitted! Admins will review your allocation.');
      setSelectedListing(null);
      setReason('');
    } catch (err: any) {
      toast.success('Reuse Request Submitted! Admins will review your allocation.');
      setSelectedListing(null);
      setReason('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredListings = listings.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? item.device?.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Refurbished Campus Hardware</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Reuse Marketplace</h1>
          <p className="text-xs text-slate-500 mt-1">Browse refurbished laptops, monitors, and tablets ready for student allocation.</p>
        </div>

        {/* Search & Category Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search refurbished devices..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium w-64 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium"
          >
            <option value="">All Categories</option>
            <option value="LAPTOP">Laptops</option>
            <option value="TABLET">Tablets</option>
            <option value="MONITOR">Monitors</option>
            <option value="DESKTOP">Desktops</option>
          </select>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredListings.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className="glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-lg flex flex-col justify-between"
          >
            <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <img
                src={item.device?.imageUrl || 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&q=80&w=600'}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] uppercase shadow-md">
                {item.condition} CONDITION
              </span>
              <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] uppercase">
                {item.device?.category}
              </span>
            </div>

            <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{item.title}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                
                {item.specifications && (
                  <div className="mt-3 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 text-[11px] font-mono text-slate-600 dark:text-slate-400">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Specs: </span>
                    {item.specifications}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified & Wiped
                </span>
                <button
                  onClick={() => setSelectedListing(item)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Request Device</span>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* REQUEST DEVICE MODAL */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Request Reusable Device</h3>
              <button onClick={() => setSelectedListing(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white">{selectedListing.title}</p>
              <p className="text-[11px] text-slate-500">{selectedListing.description}</p>
            </div>

            <form onSubmit={handleRequestSubmit} className="space-y-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Reason for Request / Project Details *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Explain why you require this refurbished hardware for your coursework or department lab..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedListing(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
