/** @type {import('next').NextConfig} */
// next.config.mjs

export default {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
        pathname: '/**',
      },
    ],
  },

  // Modify Webpack configuration
  webpack(config, { isServer }) {
    // Disable CSS minification for development or production
    if (!isServer) {
      config.optimization.minimize = false;
    }

    // Return the modified config
    return config;
  },
};
