'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface LoginFormProps {
  title: string;
}

export function LoginForm({ title }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-modern space-y-6 p-8 w-full"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-foreground">{title}</h2>
        <p className="text-foreground/60">Sign in to your account</p>
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
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          Email Address
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-elegant w-full"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-elegant w-full"
          placeholder="••••••••"
        />
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base"
      >
        {isLoading ? 'Logging in...' : 'Login'}
      </motion.button>

      <div className="text-center text-sm text-foreground/60">
        Don't have an account?{' '}
        <motion.a
          href="/auth/register"
          whileHover={{ scale: 1.05 }}
          className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
        >
          Register here
        </motion.a>
      </div>
    </motion.form>
  );
}
