import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

/**
 * Config is phase-aware so that `next dev` and `next build` never write to the
 * same output directory.
 *
 * Previously both used `.next`. Running a production build while the dev server
 * was up overwrote the chunk map underneath it, and the running site then
 * rendered with no CSS at all — a failure that looks like a styling bug and
 * sends you hunting in the wrong place. The dev server now owns `.next-dev`,
 * builds own `.next`, and the two cannot collide.
 *
 * `next start` and Vercel both read `.next`, so deployment is unaffected.
 *
 * @param {string} phase
 * @returns {import('next').NextConfig}
 */
export default function nextConfig(phase) {
  return {
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
    images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "**"
        }
      ]
    },
    async redirects() {
      return [
        {
          /*
           * /church-search-request was a second, broken copy of the musician
           * request form: its inputs had no name attributes, it had no action,
           * and it collected no way to contact the person asking. Everything it
           * was for is handled properly by /request-musician.
           */
          source: "/church-search-request",
          destination: "/request-musician",
          permanent: true
        }
      ];
    }
  };
}
