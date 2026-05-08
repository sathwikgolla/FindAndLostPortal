/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Expose for client-side API calls as requested.
    VITE_API_URL: process.env.VITE_API_URL
  }
};

export default nextConfig;
