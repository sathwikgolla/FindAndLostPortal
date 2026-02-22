'use client';

import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <motion.button
      onClick={handleLogout}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive px-6 py-2.5 rounded-lg font-medium transition-all duration-200"
    >
      Logout
    </motion.button>
  );
}
