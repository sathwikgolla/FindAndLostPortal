'use client';

import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';

interface PostFormProps {
  postType: 'lost' | 'found';
}

export function PostForm({ postType }: PostFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { createPost } = useAuth();
  const router = useRouter();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError('All fields are required');
      return;
    }

    setIsLoading(true);

    try {
      await createPost(title, description, location, postType, imageUrl);
      router.push('/dashboard/search');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  const typeConfig = postType === 'lost'
    ? { title: 'Report Lost Item', emoji: '🔍', accent: 'text-orange-600' }
    : { title: 'Report Found Item', emoji: '🎁', accent: 'text-green-600' };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-modern space-y-6 p-8 max-w-2xl w-full"
    >
      <div className="space-y-2">
        <h1 className="text-4xl font-semibold text-foreground flex items-center gap-3">
          <span>{typeConfig.emoji}</span>
          <span>{typeConfig.title}</span>
        </h1>
        <p className="text-foreground/60">Help us reunite lost and found items in our community</p>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg text-sm font-medium"
        >
          {error}
        </motion.div>
      )}

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Item Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="e.g., Black Leather Wallet"
          className="input-elegant w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Describe the item in detail..."
          className="input-elegant w-full resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Location</label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          placeholder="Where was it lost/found?"
          className="input-elegant w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-foreground">Item Photo (Optional)</label>
        <div className="relative">
          <input
            type="file"
            onChange={handleImageUpload}
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          <div className="bg-muted/50 border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted transition-colors">
            {imageUrl ? (
              <div className="space-y-2">
                <p className="text-foreground/70 font-medium">Image selected ✓</p>
                <img src={imageUrl} alt="Preview" className="h-32 mx-auto rounded-lg object-cover" />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-foreground font-semibold">📸 Click to upload photo</p>
                <p className="text-foreground/60 text-sm">or drag and drop</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base"
      >
        {isLoading ? 'Creating Post...' : 'Post Item'}
      </motion.button>
    </motion.form>
  );
}
