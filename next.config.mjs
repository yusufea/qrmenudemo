/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'tr',
    locales: ['tr', 'en', 'ar'],
    localeDetection: false, // Tarayıcı dil tercihlerini yok say
  },
};

export default nextConfig;
