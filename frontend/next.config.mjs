/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fra.cloud.appwrite.io", // ✅ Appwrite CDN host
      },
    ],
  },
}

export default nextConfig
