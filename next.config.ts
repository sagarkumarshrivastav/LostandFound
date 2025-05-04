
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
       // Add pattern for Google User Profile Pictures (keep for Passport OAuth)
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      // Add pattern for Cloudinary images
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
         // Update pathname to match your Cloudinary account structure
         // e.g., /your_cloud_name/image/upload/**
        pathname: `/${process.env.CLOUDINARY_CLOUD_NAME || '*'}/image/upload/**`, // Use env var or wildcard
      },
    ],
  },
   // Ensure experimental features like appDir are enabled if you are using App Router
   experimental: {
    // appDir: true, // This might be default now, but good to be explicit if needed
   },

    // Add environment variables needed by the frontend client
   env: {
     // Backend API URL (used by frontend for requests)
     NEXT_PUBLIC_API_URL: process.env.NODE_ENV === 'production'
        ? process.env.API_URL // Use production API URL from environment (set this in your deployment)
        : 'http://localhost:5000/api', // Default to local backend for dev
   }
};

export default nextConfig;
