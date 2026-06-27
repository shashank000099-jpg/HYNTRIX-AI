/** @type {import('next').NextConfig} */
const isProduction = process.env.NODE_ENV === 'production';

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "form-action 'self'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com",
  "connect-src 'self' https://*.supabase.co https://api.razorpay.com https://checkout.razorpay.com https://generativelanguage.googleapis.com https://api.openai.com https://api.anthropic.com https://api.apify.com",
  "frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com",
].join('; ');

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    const securityHeaders = [
      {
        key: 'Content-Security-Policy',
        value: contentSecurityPolicy,
      },
      {
        key: 'X-Content-Type-Options',
        value: 'nosniff',
      },
      {
        key: 'X-Frame-Options',
        value: 'SAMEORIGIN',
      },
      {
        key: 'Referrer-Policy',
        value: 'strict-origin-when-cross-origin',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.razorpay.com")',
      },
      {
        key: 'Cross-Origin-Opener-Policy',
        value: 'same-origin-allow-popups',
      },
    ];

    if (isProduction) {
      securityHeaders.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      });
    }

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
