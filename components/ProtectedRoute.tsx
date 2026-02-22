'use client';

import { useAuth, UserRole } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { currentUser, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !currentUser) {
      router.push('/auth/login-lost');
    } else if (!isLoading && requiredRole && currentUser?.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [currentUser, isLoading, requiredRole, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  if (requiredRole && currentUser.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
