'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { toast } from 'sonner';
import { Recycle, Lock, Mail, User, Phone, ShieldCheck, Wrench, Truck, GraduationCap, ArrowRight, Info } from 'lucide-react';
import { Role } from '@ecocycle/shared';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'STUDENT' | 'VOLUNTEER' | 'TECHNICIAN' | 'ADMIN'>('STUDENT');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState('FE');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedRole === 'ADMIN') {
      toast.error('Single Admin Registration Restricted: System has a single pre-provisioned Admin account.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        name,
        email,
        phone,
        role: selectedRole as Role,
        department,
        password,
      });

      // Redirect directly to dashboard upon successful registration
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 bg-[#090e1a]">
      <div className="w-full max-w-xl space-y-6 bg-[#131c2e] p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bright-gradient-cyan flex items-center justify-center text-white mx-auto shadow-lg shadow-cyan-500/30">
            <Recycle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Create Campus Account
          </h2>
          <p className="text-xs text-slate-400 font-medium">
            Sign up to join the EcoCycle Campus circular sustainability network
          </p>
        </div>

        {/* Role Options Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-extrabold text-slate-300 uppercase tracking-wider">
            Select Registration Category
          </label>
          <div className="grid grid-cols-4 gap-1.5 p-1.5 rounded-2xl bg-[#090e1a] border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedRole('STUDENT')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedRole === 'STUDENT'
                  ? 'bright-gradient-emerald text-white shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              <span>Student</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('VOLUNTEER')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedRole === 'VOLUNTEER'
                  ? 'bright-gradient-cyan text-white shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Volunteer</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('TECHNICIAN')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedRole === 'TECHNICIAN'
                  ? 'bright-gradient-amber text-white shadow-md shadow-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wrench className="w-4 h-4" />
              <span>Technician</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('ADMIN')}
              className={`flex flex-col sm:flex-row items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                selectedRole === 'ADMIN'
                  ? 'bright-gradient-purple text-white shadow-md shadow-purple-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Single Admin Restriction Banner */}
        {selectedRole === 'ADMIN' ? (
          <div className="p-5 rounded-2xl bg-purple-950/50 border border-purple-800 space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-extrabold text-sm">
              <Info className="w-5 h-5 text-purple-400 shrink-0" />
              <span>Single Admin Account Policy</span>
            </div>
            <p className="text-xs text-purple-200 leading-relaxed font-medium">
              EcoCycle Campus uses a single pre-provisioned Chief Admin account (<code className="font-mono bg-purple-900/80 px-1 py-0.5 rounded text-purple-200 font-bold">admin@ecocycle.local</code>) to ensure audit accountability.
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bright-gradient-purple text-white text-xs font-extrabold shadow-md hover:opacity-95 transition-all"
              >
                <span>Go to Admin Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Munja Kadam"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Campus Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@ecocycle.local"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Department</label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090e1a] border border-slate-700 text-xs font-bold text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="FE">First Year Engineering (FE)</option>
                  <option value="CSE">Computer Science (CSE)</option>
                  <option value="ECE">Electronics (ECE)</option>
                  <option value="MECH">Mechanical Engineering</option>
                  <option value="ADMIN">Administration</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-300 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#090e1a] border border-slate-700 text-xs font-bold text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bright-gradient-cyan hover:opacity-95 text-white text-xs font-black shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating Account...' : `Register as ${selectedRole}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Footer Link to Login */}
        <div className="text-center pt-2 border-t border-slate-800">
          <p className="text-xs font-medium text-slate-400">
            Already registered?{' '}
            <Link href="/login" className="font-extrabold text-cyan-400 hover:underline">
              Sign In to your account
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
