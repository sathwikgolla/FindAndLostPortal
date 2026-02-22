'use client';

import { useState } from 'react';
import { useAuth, UserRole } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export function RegisterForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('lost');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      await register(email, password, role);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { id: 'lost', label: 'I Lost Something', emoji: '🔍' },
    { id: 'found', label: 'I Found Something', emoji: '🎁' },
    { id: 'admin', label: 'Admin', emoji: '👨‍💼' },
  ];

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card-modern space-y-6 p-8 w-full"
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-foreground">Create Account</h2>
        <p className="text-foreground/60">Join our community and help reunite lost items</p>
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

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="input-elegant w-full"
          placeholder="••••••••"
        />
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-foreground">Select Your Role</label>
        <div className="grid grid-cols-1 gap-3">
          {roles.map((r) => (
            <motion.label
              key={r.id}
              whileHover={{ scale: 1.02 }}
              className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                role === r.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-muted/30 hover:border-primary/50'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.id}
                checked={role === r.id}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="mr-3 accent-primary"
              />
              <span className="text-foreground font-medium flex-1">{r.label}</span>
            </motion.label>
          ))}
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="button-primary w-full disabled:opacity-50 disabled:cursor-not-allowed py-3 text-base"
      >
        {isLoading ? 'Creating Account...' : 'Register'}
      </motion.button>

      <div className="text-center text-sm text-foreground/60">
        Already have an account?{' '}
        <motion.a
          href="/auth/login-lost"
          whileHover={{ scale: 1.05 }}
          className="text-primary hover:text-primary/80 font-semibold cursor-pointer transition-colors"
        >
          Login here
        </motion.a>
      </div>
    </motion.form>
  );
}
