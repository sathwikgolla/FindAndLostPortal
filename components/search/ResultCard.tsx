'use client';

import { Post } from '@/lib/authContext';
import { motion } from 'framer-motion';

interface ResultCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
  showDelete?: boolean;
}

export function ResultCard({ post, onDelete, showDelete = false }: ResultCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getRoleBgColor = (role: 'lost' | 'found') => {
    return role === 'lost' ? 'from-orange-50 to-orange-100/50' : 'from-green-50 to-green-100/50';
  };

  const getRoleTextColor = (role: 'lost' | 'found') => {
    return role === 'lost' ? 'text-orange-700' : 'text-green-700';
  };

  const getRoleBadgeClass = (role: 'lost' | 'found') => {
    return role === 'lost' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="card-modern group hover:shadow-lg transition-all p-6 flex flex-col"
    >
      {post.imageUrl && (
        <div className="mb-4 h-40 bg-muted rounded-lg overflow-hidden border border-border">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        </div>
      )}

      <div className="space-y-3 flex-1">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-xl font-semibold text-foreground flex-1 line-clamp-2">{post.title}</h3>
          <motion.span
            whileHover={{ scale: 1.1 }}
            className={`${getRoleBadgeClass(post.role)} px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap`}
          >
            {post.role === 'lost' ? '🔍 Lost' : '🎁 Found'}
          </motion.span>
        </div>

        <p className="text-foreground/70 text-sm line-clamp-2">{post.description}</p>

        <div className="flex items-center gap-2 text-sm text-foreground/60">
          <span>📍</span>
          <span className="line-clamp-1">{post.location}</span>
        </div>

        <div className="text-xs text-foreground/50 pt-2 border-t border-border">
          Posted on {formatDate(post.createdAt)}
        </div>

        {showDelete && onDelete && (
          <motion.button
            onClick={() => onDelete(post.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full mt-4 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 text-destructive px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
          >
            Delete Post
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
