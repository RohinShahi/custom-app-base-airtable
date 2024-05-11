/** @type {import('next').NextConfig} */
const nextConfig = {
  headers: async () => {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: '',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self'; 
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://api.airtable.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob:;
              connect-src 'self' https://api.airtable.com;
              font-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              frame-ancestors 'self'; 
              upgrade-insecure-requests;
            `.replace(/\s{2,}/g, ' ').trim()
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
