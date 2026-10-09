'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, Role } from '@ecocycle/shared';
import { fetchApi } from './api';
import { toast } from 'sonner';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  register: (userData: { name: string; email: string; phone?: string; role: Role; department?: string; password: string }) => Promise<AuthUser | null>;
  quickDemoLogin: (role: 'ADMIN' | 'TECHNICIAN' | 'VOLUNTEER' | 'STUDENT') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Initial pre-provisioned demo accounts
const DEMO_USERS: Record<string, AuthUser> = {
  'admin@ecocycle.local': { id: 'usr-admin', name: 'Dr. Aris Thorne', email: 'admin@ecocycle.local', role: Role.ADMIN, avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250' },
  'student@ecocycle.local': { id: 'usr-student1', name: 'Rohan Gupta', email: 'student@ecocycle.local', role: Role.STUDENT, avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250' },
  'neha.student@ecocycle.local': { id: 'usr-student2', name: 'Neha Sharma', email: 'neha.student@ecocycle.local', role: Role.STUDENT, avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250' },
  'sid.student@ecocycle.local': { id: 'usr-student3', name: 'Siddharth Verma', email: 'sid.student@ecocycle.local', role: Role.STUDENT, avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=250' },
  'volunteer@ecocycle.local': { id: 'usr-vol1', name: 'Ananya Roy', email: 'volunteer@ecocycle.local', role: Role.VOLUNTEER, avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250' },
  'vikram.vol@ecocycle.local': { id: 'usr-vol2', name: 'Vikram Patel', email: 'vikram.vol@ecocycle.local', role: Role.VOLUNTEER, avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=250' },
  'sneha.vol@ecocycle.local': { id: 'usr-vol3', name: 'Sneha Rao', email: 'sneha.vol@ecocycle.local', role: Role.VOLUNTEER, avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=250' },
  'technician@ecocycle.local': { id: 'usr-tech1', name: 'Suresh Kumar', email: 'technician@ecocycle.local', role: Role.TECHNICIAN, avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250' },
  'priya.tech@ecocycle.local': { id: 'usr-tech2', name: 'Priya Nair', email: 'priya.tech@ecocycle.local', role: Role.TECHNICIAN, avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250' },
  'rajesh.tech@ecocycle.local': { id: 'usr-tech3', name: 'Rajesh Deshmukh', email: 'rajesh.tech@ecocycle.local', role: Role.TECHNICIAN, avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=250' },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Helper to load registered users dictionary from localStorage
  const getRegisteredUsersMap = (): Record<string, AuthUser> => {
    try {
      const saved = localStorage.getItem('ecocycle_registered_users_map');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {};
  };

  useEffect(() => {
    const savedToken = localStorage.getItem('ecocycle_token');
    const savedUser = localStorage.getItem('ecocycle_user');
    const savedTheme = (localStorage.getItem('ecocycle_theme') as 'light' | 'dark') || 'dark';

    setTheme(savedTheme);
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch {
        setUser(DEMO_USERS['student@ecocycle.local']);
      }
    } else {
      setUser(DEMO_USERS['student@ecocycle.local']);
    }
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('ecocycle_theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    toast.info(`Switched to ${nextTheme === 'dark' ? 'Dark Mode 🌙' : 'Light Mode ☀️'}`);
  };

  const register = async (userData: { name: string; email: string; phone?: string; role: Role; department?: string; password: string }) => {
    try {
      const res = await fetchApi<{ token: string; user: AuthUser }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('ecocycle_token', res.data.token);
        localStorage.setItem('ecocycle_user', JSON.stringify(res.data.user));

        // Save into local registered map
        const regMap = getRegisteredUsersMap();
        regMap[userData.email.toLowerCase()] = res.data.user;
        localStorage.setItem('ecocycle_registered_users_map', JSON.stringify(regMap));

        toast.success(`Account created successfully for ${res.data.user.name}!`);
        return res.data.user;
      }
    } catch {
      // Offline / Local Registration Logic
      const avatars: Record<string, string> = {
        STUDENT: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=250',
        VOLUNTEER: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
        TECHNICIAN: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
        ADMIN: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
      };

      const newUser: AuthUser = {
        id: `usr-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatarUrl: avatars[userData.role] || avatars.STUDENT,
      };

      setUser(newUser);
      setToken(`mock-jwt-${userData.role.toLowerCase()}-${Date.now()}`);
      localStorage.setItem('ecocycle_user', JSON.stringify(newUser));
      localStorage.setItem('ecocycle_token', `mock-jwt-${userData.role.toLowerCase()}`);

      // Save into registered users map so they can log in later!
      const regMap = getRegisteredUsersMap();
      regMap[userData.email.toLowerCase()] = newUser;
      localStorage.setItem('ecocycle_registered_users_map', JSON.stringify(regMap));

      toast.success(`Account registered successfully as ${userData.role}!`);
      return newUser;
    }
    return null;
  };

  const login = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetchApi<{ token: string; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      if (res.success && res.data) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('ecocycle_token', res.data.token);
        localStorage.setItem('ecocycle_user', JSON.stringify(res.data.user));
        toast.success(`Welcome back, ${res.data.user.name}!`);
        return res.data.user;
      }
    } catch {
      // Check if user exists in pre-provisioned DEMO_USERS or in registeredUsersMap
      const regMap = getRegisteredUsersMap();
      const existingUser = DEMO_USERS[cleanEmail] || regMap[cleanEmail];

      if (existingUser) {
        setUser(existingUser);
        setToken(`mock-jwt-${existingUser.role.toLowerCase()}`);
        localStorage.setItem('ecocycle_user', JSON.stringify(existingUser));
        localStorage.setItem('ecocycle_token', `mock-jwt-${existingUser.role.toLowerCase()}`);
        toast.success(`Welcome back, ${existingUser.name}!`);
        return existingUser;
      } else {
        // Reject login for unregistered new users
        toast.error(`No account found with email "${cleanEmail}". Please Sign Up first!`);
        return null;
      }
    }
    return null;
  };

  const quickDemoLogin = async (role: 'ADMIN' | 'TECHNICIAN' | 'VOLUNTEER' | 'STUDENT') => {
    const demoCredentials = {
      ADMIN: DEMO_USERS['admin@ecocycle.local'],
      TECHNICIAN: DEMO_USERS['technician@ecocycle.local'],
      VOLUNTEER: DEMO_USERS['volunteer@ecocycle.local'],
      STUDENT: DEMO_USERS['student@ecocycle.local'],
    };

    const target = demoCredentials[role];
    setUser(target);
    setToken(`mock-jwt-${role.toLowerCase()}`);
    localStorage.setItem('ecocycle_user', JSON.stringify(target));
    localStorage.setItem('ecocycle_token', `mock-jwt-${role.toLowerCase()}`);
    toast.success(`Switched to Demo ${role}: ${target.name}`);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ecocycle_token');
    localStorage.removeItem('ecocycle_user');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, theme, toggleTheme, login, register, quickDemoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
