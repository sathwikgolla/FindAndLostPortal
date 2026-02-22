'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useAuth } from '@/lib/authContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from '@/components/Navbar';

export default function LandingPage() {
  const { currentUser } = useAuth();
  const router = useRouter();

  // Redirect to dashboard if already logged in
  useEffect(() => {
    if (currentUser) {
      router.push('/dashboard');
    }
  }, [currentUser, router]);

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
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen w-full bg-white">
      {/* Navigation */}
      <Navbar variant="home" />

      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-white"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Headline */}
              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl text-balance leading-tight font-bold text-[#2C3E50]"
              >
                Reunite Lost Items with Their{' '}
                <span className="text-[#FF6B6B]">Rightful Owners</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p
                variants={fadeInUp}
                className="text-lg md:text-xl text-[#7F8C8D] leading-relaxed"
              >
                Join our community-driven platform dedicated to helping people recover lost belongings and return found items with ease.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={fadeInUp}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Link href="/auth/register">
                  <motion.button
                    whileHover={{ scale: 1.06, boxShadow: '0 20px 40px -10px rgba(255, 107, 107, 0.4)' }}
                    whileTap={{ scale: 0.94 }}
                    className="text-lg px-8 py-3 shadow-lg font-semibold bg-[#FF6B6B] text-white rounded-lg hover:bg-[#FF5555] transition-all duration-300"
                  >
                    Get Started
                  </motion.button>
                </Link>
                <Link href="#about">
                  <motion.button
                    whileHover={{ scale: 1.06, backgroundColor: '#F5F5F5', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                    whileTap={{ scale: 0.94 }}
                    className="px-8 py-3 rounded-lg font-semibold border-2 border-[#E8E8E8] text-[#2C3E50] hover:border-[#FF6B6B] transition-all duration-300 text-lg"
                  >
                    Learn More
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="hidden lg:block"
            >
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 30px 60px -15px rgba(255, 107, 107, 0.2)' }}
                className="rounded-2xl overflow-hidden shadow-xl border border-[#E8E8E8] transition-all duration-300"
              >
                <img
                  src="/community-connect.jpg"
                  alt="Community connecting and reuniting items"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E8E8E8] bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">About Lost & Found</h2>
            <p className="text-lg text-[#7F8C8D] font-medium">
              Our mission is to create a trusted community platform where lost items are quickly reunited with their owners. We believe that every lost item has a chance of being found, and every good deed deserves recognition.
            </p>
            <p className="text-lg text-[#7F8C8D] leading-relaxed">
              Whether you've lost a cherished possession or found something that belongs to someone else, our platform makes it easy to connect and resolve these situations. We're committed to building a compassionate community that values integrity and mutual support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Role Selection Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#F5F5F5]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">Choose Your Role</h2>
            <p className="text-lg text-[#7F8C8D] max-w-2xl mx-auto">
              Select how you want to contribute to our community
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Lost Items Role */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md hover:shadow-xl border border-[#E8E8E8] hover:border-[#FF6B6B]/30 transition-all p-8 group"
            >
              <div className="mb-6 w-12 h-12 rounded-lg bg-[#FF6B6B]/10 flex items-center justify-center group-hover:bg-[#FF6B6B]/20 transition-colors">
                <svg
                  className="w-6 h-6 text-[#FF6B6B]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-3">
                Report Lost Items
              </h3>
              <p className="text-[#7F8C8D] mb-6 leading-relaxed">
                Post details about your lost items including photos, location, and description to help the community find them.
              </p>
              <Link
                href="/auth/login-lost"
                className="inline-block text-[#FF6B6B] font-semibold hover:text-[#FF5555] transition-colors"
              >
                Login as Reporter →
              </Link>
            </motion.div>

            {/* Found Items Role */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md hover:shadow-xl border border-[#E8E8E8] hover:border-[#1E90FF]/30 transition-all p-8 group"
            >
              <div className="mb-6 w-12 h-12 rounded-lg bg-[#1E90FF]/10 flex items-center justify-center group-hover:bg-[#1E90FF]/20 transition-colors">
                <svg
                  className="w-6 h-6 text-[#1E90FF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-3">
                Share Found Items
              </h3>
              <p className="text-[#7F8C8D] mb-6 leading-relaxed">
                Help reunite found belongings with their owners by uploading photos and details about what you discovered.
              </p>
              <Link
                href="/auth/login-found"
                className="inline-block text-[#1E90FF] font-semibold hover:text-[#0D7FE8] transition-colors"
              >
                Login as Helper →
              </Link>
            </motion.div>

            {/* Admin Role */}
            <motion.div
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-md hover:shadow-xl border border-[#E8E8E8] hover:border-[#2C3E50]/30 transition-all p-8 group"
            >
              <div className="mb-6 w-12 h-12 rounded-lg bg-[#2C3E50]/10 flex items-center justify-center group-hover:bg-[#2C3E50]/20 transition-colors">
                <svg
                  className="w-6 h-6 text-[#2C3E50]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#2C3E50] mb-3">
                Manage Platform
              </h3>
              <p className="text-[#7F8C8D] mb-6 leading-relaxed">
                Oversee all items, moderate content, manage users, and ensure the community operates smoothly.
              </p>
              <Link
                href="/auth/login-admin"
                className="inline-block text-[#2C3E50] font-semibold hover:text-[#FF6B6B] transition-colors"
              >
                Admin Login →
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features/How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3E50] mb-4">How It Works</h2>
            <p className="text-lg text-[#7F8C8D] max-w-2xl mx-auto">
              Simple steps to reunite lost items with their owners
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {[
              {
                step: '01',
                title: 'Register',
                description: 'Create your account and choose your role in the community',
              },
              {
                step: '02',
                title: 'Post Details',
                description:
                  'Share comprehensive information about lost or found items with photos',
              },
              {
                step: '03',
                title: 'Connect & Communicate',
                description: 'Browse listings and reach out to help reunite belongings',
              },
              {
                step: '04',
                title: 'Resolution',
                description:
                  'Complete the handoff and celebrate helping someone recover their item',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-accent/5 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="section-header">Ready to Make a Difference?</h2>
            <p className="section-subheader">
              Join thousands of community members helping reunite lost items with their owners.
            </p>
            <Link href="/auth/register" className="inline-block button-primary text-lg">
              Get Started Today
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Lost & Found</h3>
              <p className="text-foreground/60 text-sm">
                Reuniting lost items with their owners, one connection at a time.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Features</h4>
              <ul className="space-y-2 text-foreground/60 text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Report Lost Items
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Browse Found
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Support</h4>
              <ul className="space-y-2 text-foreground/60 text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-2 text-foreground/60 text-sm">
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-foreground/60 text-sm">
            <p>&copy; 2026 Lost & Found Portal. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="hover:text-foreground transition-colors">
                Twitter
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Facebook
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
