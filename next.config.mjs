const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: isProd ? '/aaenterprises' : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? '/aaenterprises' : '',
  },
};

export default nextConfig;
