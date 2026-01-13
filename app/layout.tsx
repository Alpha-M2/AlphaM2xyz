import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Alpha_M2 ♟️♟️ | DeFi Explorer & Python Builder',
    description: 'Elite DeFi analytics builder. Python-powered tools for token launch detection, portfolio tracking, and on-chain analysis. 1% better everyday.',
    keywords: ['DeFi', 'Python', 'Web3', 'Crypto Analytics', 'Dune Analytics', 'On-chain Data', 'Blockchain', 'Alpha_M2'],
    authors: [{ name: 'Alpha_M2', url: 'https://alpham2.xyz' }],
    openGraph: {
        title: 'Alpha_M2 ♟️♟️ | DeFi Explorer & Python Builder',
        description: 'Building tools that matter in DeFi. Portfolio trackers, rug detectors, whale monitors.',
        url: 'https://alpham2.xyz',
        siteName: 'Alpha_M2 Portfolio',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Alpha_M2 DeFi Portfolio',
            },
        ],
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Alpha_M2 ♟️♟️ | DeFi Explorer & Python Builder',
        description: 'Building tools that matter in DeFi. Portfolio trackers, rug detectors, whale monitors.',
        creator: '@Alpha_M2',
        images: ['/og-image.png'],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    metadataBase: new URL('https://alpham2.xyz'),
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="scroll-smooth">
            <body className={inter.className}>{children}</body>
        </html>
    )
}