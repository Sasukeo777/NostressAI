import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs';

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
    // Enable instrumentation for Sentry
    instrumentationHook: true,
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

const sentryWebpackPluginOptions = {
  // Suppresses source map uploading logs during build
  silent: true,

  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,

  // Only upload source maps in production
  disable: process.env.NODE_ENV !== 'production',
};

const sentryOptions = {
  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Tunnel Sentry events to avoid ad-blockers (optional)
  // tunnelRoute: "/monitoring-tunnel",
};

// Apply MDX first, then Sentry
export default withSentryConfig(withMDX(nextConfig), {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "nostress-ai",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  }
});
