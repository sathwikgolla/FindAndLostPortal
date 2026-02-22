'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface NavbarProps {
  variant?: 'home' | 'dashboard';
  showUserMenu?: boolean;
}

export default function Navbar({ variant = 'home', showUserMenu = false }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems =
    variant === 'home'
      ? [
          { label: 'Home', href: '/', button: false },
          { label: 'About', href: '#about', button: false },
          { label: 'Registration', href: '/auth/register', button: true },
        ]
      : [
          { label: 'Dashboard', href: '/dashboard', button: false },
          { label: 'Browse', href: '/dashboard/search', button: false },
        ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-[#E8E8E8] bg-white/98 backdrop-blur-xl shadow-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{ scale: 1.12, rotate: 8, boxShadow: '0 8px 20px rgba(255, 107, 107, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF6B6B] to-[#FF5555] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 text-white font-bold text-lg cursor-pointer"
            >
              ✓
            </motion.div>
            <Link href="/" className="font-bold text-lg text-[#2C3E50] hover:text-[#FF6B6B] transition-colors duration-300">
              Lost & Found
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden md:flex items-center gap-8"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.button ? (
                  <Link href={item.href}>
                    <motion.button
                      whileHover={{ scale: 1.06, boxShadow: '0 12px 28px -5px rgba(255, 107, 107, 0.3)' }}
                      whileTap={{ scale: 0.94 }}
                      className="px-6 py-2.5 text-sm font-semibold bg-[#FF6B6B] text-white rounded-lg shadow-md hover:shadow-lg hover:bg-[#FF5555] transition-all duration-300"
                    >
                      {item.label}
                    </motion.button>
                  </Link>
                ) : (
                  <Link href={item.href} className="inline-block">
                    <motion.div
                      className="nav-link text-[#2C3E50] font-medium"
                      whileHover={{ color: '#FF6B6B' }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.label}
                      <motion.div
                        className="absolute bottom-0 left-0 h-0.5 bg-[#FF6B6B]"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.3 }}
                      />
                    </motion.div>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-[#2C3E50] hover:text-[#FF6B6B] transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden pb-4 border-t border-[#E8E8E8] space-y-2 bg-white"
          >
            {navItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
              >
                {item.button ? (
                  <Link href={item.href}>
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="w-full px-6 py-3 text-sm font-semibold bg-[#FF6B6B] text-white rounded-lg shadow-md hover:shadow-lg hover:bg-[#FF5555] transition-all duration-300 text-center"
                    >
                      {item.label}
                    </motion.button>
                  </Link>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-4 py-3 text-[#2C3E50] hover:text-[#FF6B6B] hover:bg-[#F5F5F5] transition-all font-medium rounded-lg duration-300"
                  >
                    {item.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
