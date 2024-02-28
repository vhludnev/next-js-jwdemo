const runtimeCaching = require("next-pwa/cache");
const path = require("path");
const withPWAInit = require("next-pwa");

const isDev = process.env.NODE_ENV !== "production";

/** @type {import('next-pwa').PWAConfig} */

const withPWA = withPWAInit({
  dest: "public",
  disable: isDev,
  register: true,
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: ["app-build-manifest.json"],
  fallbacks: {
    document: "/offline",
  },
});

const generateAppDirEntry = (entry) => {
  const packagePath = require.resolve("next-pwa");
  const packageDirectory = path.dirname(packagePath);
  const registerJs = path.join(packageDirectory, "register.js");

  return entry().then((entries) => {
    if (entries["main-app"] && !entries["main-app"].includes(registerJs)) {
      if (Array.isArray(entries["main-app"])) {
        entries["main-app"].unshift(registerJs);
      } else if (typeof entries["main-app"] === "string") {
        entries["main-app"] = [registerJs, entries["main-app"]];
      }
    }
    return entries;
  });
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    webpackBuildWorker: true,
    serverComponentsExternalPackages: ["mongoose"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  reactStrictMode: true,
  webpack(config) {
    if (!isDev) {
      const entry = generateAppDirEntry(config.entry);
      config.entry = () => entry;
    }
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    };
    config.externals = [...config.externals, "canvas", "jsdom"];

    return config;
  },
};

module.exports = withPWA(nextConfig);
