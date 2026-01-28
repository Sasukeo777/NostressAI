import createMDX from '@next/mdx';

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: []
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable features for Next.js 16

  turbopack: {},
  experimental: {
    mdxRs: true,
  },
  pageExtensions: ['ts', 'tsx', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'lh5.googleusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'lh6.googleusercontent.com'
      }
    ]
  }
};

export default withMDX(nextConfig);
