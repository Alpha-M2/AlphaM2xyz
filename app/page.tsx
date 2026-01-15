'use client'

import React from 'react';
import Image from 'next/image';
import { Github, Twitter, Mail, ExternalLink, ChevronRight, Terminal, TrendingUp, Shield, Zap, Send, Linkedin } from 'lucide-react';
import Header from './components/Header';
import SpiralBackground from './components/SpiralBackground';

export default function Portfolio() {

    const projects = [
        {
            title: "Portfolio Tracker Pro",
            description: "Real-time multi-chain portfolio tracking with PnL analytics, gas optimization alerts, and whale wallet monitoring.",
            impact: "Tracking $2M+ in assets",
            tech: ["Python", "Web3.py", "FastAPI", "PostgreSQL"],
            link: "https://github.com/Alpha-M2/crypto-portfolio-tracker",
            github: "https://github.com/Alpha-M2/crypto-portfolio-tracker"
        },
        {
            title: "QuintovaBot",
            description: "Solana Memecoin Alpha Detection Bot - Real-time Solana token monitoring with advanced filtering, smart wallet tracking, and cabal detection.",
            impact: "Private Access Only (Coming Soon)",
            tech: ["Python", "Helius", "Telegram Bot API", "Redis", "AsyncIO"],
            link: "#",
            github: "#"
        },
        {
            title: "Crypto News Aggregator Bot",
            description: "A crypto news aggregation pipeline that collects, normalizes, deduplicates, summarizes, and delivers real-time crypto news directly to Telegram subscribers.",
            impact: "Live Bot: @BlockoraBot",
            tech: ["Python", "MongoDB", "RSS", "Web Scraping", "AsyncIO", "Telegram Bot API"],
            link: "https://github.com/Alpha-M2/crypto-news-aggregator",
            github: "https://github.com/Alpha-M2/crypto-news-aggregator"
        },

        {
            title: "Top 20 ETH NFT Collections",
            description: "Floor price performance in USD and ETH across 7 days, 1, 3, and 6 months intervals.",
            impact: "NFT Analytics",
            tech: ["DuneSQL", "NFT Market"],
            link: "https://dune.com/alpham2_eth/top-20-ethereum-nft-collections-by-volume"
        },
        {
            title: "Pumpswap Most Traded Tokens",
            description: "Analysis of the most traded tokens on Pumpswap over the last 7 days.",
            impact: "DEX Analytics",
            tech: ["DuneSQL", "DEX Volume"],
            link: "https://dune.com/alpham2_eth/most-traded-tokens-on-pumpswap-over-the-last-7-days"
        },
        {
            title: "Base Chain Performance",
            description: "Performance comparison on Base Chain over the last 3 months.",
            impact: "L2 Analytics",
            tech: ["DuneSQL", "L2 Analysis"],
            link: "https://dune.com/alpham2_eth/perfomance-comparison-on-base-chain-over-the-last-3-months"
        },
        {
            title: "AlphaM2 Portfolio",
            description: "Modern personal portfolio website with task-based agentic development workflow.",
            impact: "High Performance",
            tech: ["Next.js 16", "React 19", "TypeScript", "Tailwind CSS"],
            link: "https://github.com/Alpha-M2/AlphaM2xyz",
            github: "https://github.com/Alpha-M2/AlphaM2xyz"
        }
    ];

    const skills = [
        { name: "Python", level: 95 },
        { name: "DuneSQL", level: 90 },
        { name: "Web3.py / Ethers.js", level: 88 },
        { name: "DeFi Protocols", level: 92 },
        { name: "Community Management", level: 85 },
        { name: "Bot Development", level: 90 },
        { name: "On-Chain Analysis", level: 93 }
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden">
            <SpiralBackground />
            <Header />

            {/* Hero Section */}
            <section id="hero" className="relative min-h-screen flex items-center justify-center px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-black to-black" />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <div className="mb-8 inline-block">
                        {/* Profile Image */}
                        <div className="mb-6 flex justify-center">
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-violet-600 shadow-2xl shadow-violet-900/50">
                                {/* Replace this div with your actual image */}
                                <div className="w-full h-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-4xl font-bold">
                                    AM2
                                </div>
                                {
                                    <Image
                                        src="/cMqMsAqw_400x400.jpg"
                                        alt="Alpha_M2"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 128px, 160px"
                                        priority
                                    />
                                }
                            </div>
                        </div>
                        <div className="text-6xl md:text-8xl font-bold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400">
                            Alpha_M2 ♟️♟️
                        </div>
                        <div className="text-xl md:text-2xl text-gray-400 font-light tracking-wide">
                            DeFi Explorer • Python Builder • 1% Better Everyday
                        </div>
                    </div>

                    <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Building tools that matter. From token launch detectors to whale trackers,
                        I ship Python-powered DeFi analytics that save money and spot opportunities.
                        On-chain data is my chessboard — every move calculated, every position optimized.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <a
                            href="https://twitter.com/Alpha_M2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group px-8 py-4 bg-violet-600 hover:bg-violet-500 transition-all rounded-lg font-semibold flex items-center gap-2"
                        >
                            DM for Collabs
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a
                            href="mailto:Alphaofweb3@gmail.com"
                            className="px-8 py-4 border border-violet-600/50 hover:border-violet-500 hover:bg-violet-950/30 transition-all rounded-lg font-semibold"
                        >
                            Email for Gigs
                        </a>
                    </div>

                    <div className="mt-16 flex justify-center gap-8 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Terminal className="w-4 h-4 text-violet-400" />
                            <span>10+ Projects Shipped</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-violet-400" />
                            <span>$100K+ Value Created</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-violet-400" />
                            <span>50+ Rugs Detected</span>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <ChevronRight className="w-6 h-6 text-violet-400 rotate-90" />
                </div>
            </section>

            {/* Experiences Section */}
            <section id="projects" className="relative py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                            Experiences
                        </h2>
                        <p className="text-xl text-gray-400">Tools that move markets, protect capital, and spot alpha.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map((project, idx) => (
                            <div
                                key={idx}
                                className="group bg-gradient-to-br from-violet-950/20 to-indigo-950/20 border border-violet-900/30 rounded-2xl p-8 hover:border-violet-600/50 transition-all duration-300 hover:shadow-2xl hover:shadow-violet-900/20 flex flex-col"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-white group-hover:text-violet-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <div className="flex gap-2">
                                        {project.link && (
                                            <a href={project.link} className="p-2 hover:bg-violet-900/30 rounded-lg transition-colors">
                                                <ExternalLink className="w-5 h-5 text-gray-400 hover:text-violet-400" />
                                            </a>
                                        )}
                                        {project.github && (
                                            <a href={project.github} className="p-2 hover:bg-violet-900/30 rounded-lg transition-colors">
                                                <Github className="w-5 h-5 text-gray-400 hover:text-violet-400" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <p className="text-gray-300 mb-4 leading-relaxed flex-grow">
                                    {project.description}
                                </p>

                                <div className="mb-6 p-3 bg-green-950/20 border border-green-800/30 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                                        <Zap className="w-4 h-4" />
                                        {project.impact}
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((tech, i) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1 bg-violet-900/30 border border-violet-800/30 rounded-full text-sm text-violet-300"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section id="about" className="relative py-32 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                            About Me
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16">
                        <div>
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                Started in traditional finance, pivoted to crypto in 2021. Worked as a Community Manager/Moderator
                                for several projects till 2023.
                            </p>
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                Worked as a Social Media Manager for few popular Projects and Influencers till early 2025.
                            </p>
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                Now, spending 10,000+ hours analyzing on-chain data, building bots, and reverse-engineering DeFi protocols.
                            </p>
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                Philosophy: <span className="text-violet-400 font-semibold">1% better everyday</span>.
                                Every line of code, every dashboard, every insight compounds. Like chess —
                                positioning matters more than immediate wins.
                            </p>
                            <div className="text-lg text-gray-300 leading-relaxed">
                                <p className="mb-2 font-semibold text-white">Available for:</p>
                                <ul className="list-disc list-inside space-y-1 text-gray-400">
                                    <li>Custom bots & Telegram/Discord tools</li>
                                    <li>Dune dashboards & on-chain analytics</li>
                                    <li>MEV bots & opportunities detection</li>
                                    <li>Portfolio trackers & wallet monitoring</li>
                                    <li>Risk management & scam detection systems</li>
                                    <li>Anything requiring deep Python + on-chain expertise</li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold mb-6 text-white">Skills</h3>
                            <div className="space-y-4">
                                {skills.map((skill, idx) => (
                                    <div key={idx}>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-300 font-medium">{skill.name}</span>
                                            <span className="text-violet-400">{skill.level}%</span>
                                        </div>
                                        <div className="h-2 bg-violet-950/30 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full transition-all duration-1000"
                                                style={{ width: `${skill.level}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section id="contact" className="relative py-32 px-6 bg-gradient-to-b from-black to-violet-950/20">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400">
                        Let&apos;s Build
                    </h2>
                    <p className="text-xl text-gray-400 mb-12">
                        Open for collaborations, contract work, and building the future of DeFi.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <a
                            href="https://x.com/Alpha_M2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 px-8 py-4 bg-violet-950/30 border border-violet-800/50 hover:border-violet-600 hover:bg-violet-950/50 rounded-xl transition-all"
                        >
                            <Twitter className="w-6 h-6 text-violet-400" />
                            <span className="font-semibold">@Alpha_M2</span>
                        </a>

                        <a
                            href="mailto:Alphaofweb3@gmail.com"
                            className="group flex items-center gap-3 px-8 py-4 bg-violet-950/30 border border-violet-800/50 hover:border-violet-600 hover:bg-violet-950/50 rounded-xl transition-all"
                        >
                            <Mail className="w-6 h-6 text-violet-400" />
                            <span className="font-semibold">Alphaofweb3@gmail.com</span>
                        </a>

                        <a
                            href="https://t.me/Alpha_M2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 px-8 py-4 bg-violet-950/30 border border-violet-800/50 hover:border-violet-600 hover:bg-violet-950/50 rounded-xl transition-all"
                        >
                            <Send className="w-6 h-6 text-violet-400" />
                            <span className="font-semibold">Telegram</span>
                        </a>

                        <a
                            href="https://github.com/Alpha-M2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 px-8 py-4 bg-violet-950/30 border border-violet-800/50 hover:border-violet-600 hover:bg-violet-950/50 rounded-xl transition-all"
                        >
                            <Github className="w-6 h-6 text-violet-400" />
                            <span className="font-semibold">GitHub</span>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/alpham2/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center gap-3 px-8 py-4 bg-violet-950/30 border border-violet-800/50 hover:border-violet-600 hover:bg-violet-950/50 rounded-xl transition-all"
                        >
                            <Linkedin className="w-6 h-6 text-violet-400" />
                            <span className="font-semibold">LinkedIn</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-violet-900/30 py-8 px-6 text-center text-gray-500">
                <p>Built with Next.js • Deployed on Vercel • 1% better everyday</p>
            </footer>
        </div>
    );
}