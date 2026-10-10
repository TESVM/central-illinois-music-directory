/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
