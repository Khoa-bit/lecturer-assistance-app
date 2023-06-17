// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

const {nextHeader, nextDevHeader} = await import("./config/nextHeader.mjs");

const isDev = process.env.NODE_ENV !== "production";

/** @type {import("next").NextConfig} */
const config = {
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
  // i18n: {
  //   locales: ["en"],
  //   defaultLocale: "en",
  // },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8090",
        pathname: "/api/files/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:slug*",
        headers: isDev ? nextDevHeader() : nextHeader(),
      },
    ];
  },
};
export default config;
