/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // assets/beasts is served statically via public/assets (symlink); no remote optimization needed.
    unoptimized: true,
  },
};

export default nextConfig;
