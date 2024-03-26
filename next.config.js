/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    publicRuntimeConfig: {
      // remove private variables from processEnv
      processEnv: Object.fromEntries(
        Object.entries(process.env).filter(([key]) => key.includes('NEXT_PUBLIC_')),
      ),
    },
    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
      typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
      },
      
}

module.exports = nextConfig
