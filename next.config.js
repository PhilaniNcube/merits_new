/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: ["kktstzsxntooizwpijko.supabase.co"],
  },
};

module.exports = nextConfig
