'use client';

import { UserRole } from '@/lib/authContext';
import { motion } from 'framer-motion';

interface RoleBadgeProps {
  role: UserRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const getRoleConfig = (role: UserRole) => {
    switch (role) {
      case 'lost':
        return {
          label: 'Lost Item Reporter',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-700',
          icon: '🔍',
        };
      case 'found':
        return {
          label: 'Found Item Reporter',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-700',
          icon: '🎁',
        };
      case 'admin':
        return {
          label: 'Administrator',
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/20',
          textColor: 'text-primary',
          icon: '👨‍💼',
        };
    }
  };

  const config = getRoleConfig(role);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`${config.bgColor} border ${config.borderColor} ${config.textColor} px-4 py-2 rounded-full font-semibold text-sm flex items-center gap-2 w-fit transition-shadow hover:shadow-md`}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </motion.div>
  );
}
