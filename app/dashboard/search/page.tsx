'use client';

import { useAuth } from '@/lib/authContext';
import { useState, useMemo } from 'react';
import { AnimationWrapper } from '@/components/AnimationWrapper';
import { SearchBar } from '@/components/search/SearchBar';
import { ResultCard } from '@/components/search/ResultCard';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SearchPage() {
  const { currentUser, searchPosts, deletePost, posts } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'lost' | 'found' | undefined>(undefined);

  if (!currentUser) {
    return null;
  }

  // Determine what type of posts to show based on user role
  const displayFilterRole = currentUser.role === 'admin' ? filterRole : currentUser.role === 'lost' ? 'found' : 'lost';

  const searchResults = useMemo(() => {
    return searchPosts(searchQuery, displayFilterRole);
  }, [searchQuery, displayFilterRole, searchPosts]);

  const userPosts = useMemo(() => {
    return posts.filter(p => p.postedBy === currentUser.id);
  }, [posts, currentUser.id]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <AnimationWrapper type="fadeIn">
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-[#2C3E50] text-balance">
              {currentUser.role === 'admin' ? 'All Items' : currentUser.role === 'lost' ? 'Found Items' : 'Lost Items'}
            </h1>
            <p className="section-subheader">
              {currentUser.role === 'admin'
                ? 'Browse all lost and found items in the system'
                : currentUser.role === 'lost'
                  ? 'Check items that other users have found'
                  : 'Help find items that people have lost'}
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="space-y-4">
            <SearchBar onSearch={setSearchQuery} placeholder={`Search items...`} />

            {currentUser.role === 'admin' && (
              <div className="flex gap-3 flex-wrap">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setFilterRole(undefined)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterRole === undefined
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'bg-muted border border-border text-foreground/70 hover:border-primary/50'
                  }`}
                >
                  All Items
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setFilterRole('lost')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterRole === 'lost'
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-muted border border-border text-foreground/70 hover:border-orange-500/50'
                  }`}
                >
                  Lost Items
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setFilterRole('found')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    filterRole === 'found'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-muted border border-border text-foreground/70 hover:border-green-500/50'
                  }`}
                >
                  Found Items
                </motion.button>
              </div>
            )}
          </motion.div>

          {/* Action for non-admin users */}
          {currentUser.role !== 'admin' && (
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              className="flex gap-4 border-b border-border pb-4"
            >
              <Link href={currentUser.role === 'lost' ? '/dashboard/post/lost' : '/dashboard/post/found'}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-3 text-foreground/60 hover:text-foreground font-medium border-b-2 border-transparent hover:border-primary/50 transition-all"
                >
                  {currentUser.role === 'lost' ? '+ Post Lost Item' : '+ Post Found Item'}
                </motion.button>
              </Link>
            </motion.div>
          )}

          {/* Results Grid */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.length > 0 ? (
              searchResults.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ResultCard post={post} />
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-20"
              >
                <p className="text-foreground/60 text-lg mb-6">
                  {searchQuery ? 'No items found matching your search' : 'No items available yet'}
                </p>
                {searchQuery && (
                  <motion.button
                    onClick={() => setSearchQuery('')}
                    whileHover={{ scale: 1.05 }}
                    className="button-primary"
                  >
                    Clear search
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* User's own posts section (for non-admin) */}
          {currentUser.role !== 'admin' && userPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 border-t border-border pt-12"
            >
              <h2 className="text-3xl font-semibold text-foreground">Your Posts</h2>
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <ResultCard
                      post={post}
                      showDelete={true}
                      onDelete={deletePost}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </AnimationWrapper>
  );
}
