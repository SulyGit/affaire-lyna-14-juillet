/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "dist",
  basePath: "/affaire-lyna-14-juillet",
  assetPrefix: "/affaire-lyna-14-juillet/",
  trailingSlash: true,
  images: {
    unoptimized: true
  }
};

export default nextConfig;
