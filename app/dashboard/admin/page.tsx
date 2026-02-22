'use client';

import { useAuth, UserRole } from '@/lib/authContext';
import { AnimationWrapper } from '@/components/AnimationWrapper';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { RoleBadge } from '@/components/dashboard/RoleBadge';
import { UsersTable } from '@/components/admin/UsersTable';
import { ResultCard } from '@/components/search/ResultCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AdminPage() {
  const { currentUser, users, posts } = useAuth();

  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  const stats = [
    { label: 'Total Users', value: users.length, icon: '👥' },
    { label: 'Total Posts', value: posts.length, icon: '📋' },
    { label: 'Lost Items', value: posts.filter(p => p.role === 'lost').length, icon: '🔍' },
    { label: 'Found Items', value: posts.filter(p => p.role === 'found').length, icon: '🎁' },
  ];

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

  return (
    <ProtectedRoute requiredRole="admin">
      <AnimationWrapper type="fadeIn">
        <div className="min-h-screen bg-white p-4 md:p-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto space-y-12"
          >
            {/* Header */}
            <motion.div variants={fadeInUp} className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50]">Admin Dashboard</h1>
                <p className="text-lg text-[#7F8C8D] mt-2">Manage users and posts</p>
              </div>
              <div className="flex flex-col gap-3">
                <RoleBadge role={currentUser.role} />
                <LogoutButton />
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={fadeInUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                  className="card-modern hover:shadow-lg transition-all p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stat.icon}</span>
                    <span className="text-3xl font-semibold text-foreground">{stat.value}</span>
                  </div>
                  <p className="text-foreground/60 text-sm font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>

            {/* Users Section */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-semibold text-foreground">Users</h2>
              <UsersTable users={users} />
            </motion.div>

            {/* Posts Section */}
            <motion.div variants={fadeInUp} className="space-y-6">
              <h2 className="text-3xl font-semibold text-foreground">Posts</h2>
              {posts.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {posts.map((post) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <ResultCard post={post} />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card-modern p-8 text-center">
                  <p className="text-foreground/60">No posts yet</p>
                </motion.div>
              )}
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={fadeInUp} className="card-modern p-8 space-y-6">
              <h3 className="text-2xl font-semibold text-foreground">Quick Actions</h3>
              <div className="flex gap-4 flex-wrap">
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="button-primary"
                  >
                    Back to Dashboard
                  </motion.button>
                </Link>
                <Link href="/dashboard/search">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="button-secondary"
                  >
                    View All Items
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </AnimationWrapper>
    </ProtectedRoute>
  );
}
