/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  output: "standalone", // Optimizes for container deployment
  images: {
    domains: ["your-domain.com"], // Add your domain
  },
};

module.exports = nextConfig;
