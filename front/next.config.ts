import type { NextConfig } from "next";

process.env.BASELINE_BROWSER_MAPPING_IGNORE_OLD_DATA ??= "true";
process.env.BROWSERSLIST_IGNORE_OLD_DATA ??= "true";

const nextConfig: NextConfig = {
  // output: 'export',
  images: {
    minimumCacheTTL: 2678400, // 31일
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      new URL('https://images.unsplash.com/**')
    ],
  },
};

export default nextConfig;
