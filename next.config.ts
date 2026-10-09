import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.iacedcalculus.com",
        port: "",
        pathname: "/uploads/2024/08/Calculus-Terms-1024x791.png",
        search: "",
      },
    ],
  },
  i18n: {
    locales: ["en", "mk"],
    defaultLocale: "en",
  },
  reactCompiler: true,
  reactStrictMode: true,
};

export default nextConfig;
