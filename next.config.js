/** @type {import('next').NextConfig} */

const nextTranslate = require("next-translate");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["localhost"],
  },
};

module.exports = nextTranslate(nextConfig);
