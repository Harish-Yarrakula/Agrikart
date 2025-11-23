/** @type {import('next').NextConfig} */
module.exports = {
	images: {
		// Allowlist remote hosts used by the app so next/image won't throw
		remotePatterns: [
			{ protocol: 'https', hostname: 'cdn.weatherapi.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'media.bighaat.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'cdn.shopify.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'dummyimage.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'via.placeholder.com', pathname: '/**' },
			{ protocol: 'https', hostname: '5.imimg.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'm.media-amazon.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'images-na.ssl-images-amazon.com', pathname: '/**' },
			{protocol: 'https', hostname: 'krishibazaar.in', pathname: '/**' },
			{ protocol: 'https', hostname: 'cdn.moglix.com', pathname: '/**' },
			{ protocol: 'https', hostname: 'agribegri.com', pathname: '/**' },
		]
	},
	i18n: {
		locales: ['en-US', 'te', 'hi', 'ta'], // Supported locales
		defaultLocale: 'en-US', // Default locale
	},
	devIndicators: false,
};
