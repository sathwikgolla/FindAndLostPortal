'use client';

import { ReactNode } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-background">
        {/* Navigation */}
        <Navbar variant="dashboard" />

        {/* Main Content with top padding to account for fixed navbar */}
        <div className="relative z-10 min-h-screen pt-20">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
