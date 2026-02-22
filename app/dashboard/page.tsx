'use client';

import { useAuth } from '@/lib/authContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { RoleBadge } from '@/components/dashboard/RoleBadge';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { AnimationWrapper } from '@/components/AnimationWrapper';

export default function DashboardPage() {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return null;
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const actionCards =
    currentUser.role === 'admin'
      ? [
          {
            icon: '👥',
            title: 'Manage Users',
            description: 'View and manage all user accounts',
            href: '/dashboard/admin',
          },
          {
            icon: '📋',
            title: 'All Posts',
            description: 'View all lost and found items',
            href: '/dashboard/search',
          },
        ]
      : [
          {
            icon: currentUser.role === 'lost' ? '🔍' : '🎁',
            title: currentUser.role === 'lost' ? 'Post Lost Item' : 'Post Found Item',
            description:
              currentUser.role === 'lost'
                ? 'Report an item you have lost'
                : 'Report an item you have found',
            href: `/dashboard/post/${currentUser.role}`,
          },
          {
            icon: '🔎',
            title: 'Search Items',
            description:
              currentUser.role === 'lost'
                ? 'Search for items that have been found'
                : 'Search for lost items',
            href: '/dashboard/search',
          },
        ];

  return (
    <AnimationWrapper type="fadeIn">
      <div className="min-h-screen bg-white p-4 md:p-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto space-y-12"
        >
          {/* Header with user info */}
          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="section-header mb-2">Welcome back!</h1>
              <p className="section-subheader">{currentUser.email}</p>
            </div>
            <div className="flex flex-col gap-3">
              <RoleBadge role={currentUser.role} />
              <LogoutButton />
            </div>
          </motion.div>

          {/* Action Cards */}
          <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {actionCards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                whileHover={{ y: -4 }}
              >
                <Link href={card.href}>
                  <div className="card-modern group hover:shadow-lg transition-all p-8 h-full flex flex-col">
                    <div className="text-5xl mb-4">{card.icon}</div>
                    <h2 className="text-2xl font-semibold text-foreground mb-2">{card.title}</h2>
                    <p className="text-foreground/70 mb-4 flex-1">{card.description}</p>
                    <div className="text-primary font-medium group-hover:translate-x-2 transition-transform">
                      View →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Stats (if applicable) */}
          {currentUser.role !== 'admin' && (
            <motion.div
              variants={fadeInUp}
              className="card-modern p-8 mt-8"
            >
              <h2 className="text-2xl font-semibold text-foreground mb-6">Quick Stats</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6 text-center">
                  <div className="text-3xl font-semibold text-primary">0</div>
                  <p className="text-foreground/60 text-sm mt-3">Your Posts</p>
                </div>
                <div className="bg-gradient-to-br from-accent/5 to-accent/10 border border-accent/20 rounded-lg p-6 text-center">
                  <div className="text-3xl font-semibold text-accent">0</div>
                  <p className="text-foreground/60 text-sm mt-3">Community Posts</p>
                </div>
                <div className="bg-gradient-to-br from-secondary/5 to-secondary/10 border border-secondary/20 rounded-lg p-6 text-center">
                  <div className="text-3xl font-semibold text-secondary">0</div>
                  <p className="text-foreground/60 text-sm mt-3">Matches Found</p>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimationWrapper>
  );
}
