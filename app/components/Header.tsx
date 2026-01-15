'use client';

import React, { useState, useEffect } from 'react';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 20;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-black/50 backdrop-blur-md py-4' : 'bg-transparent py-6'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <a
                    href="#hero"
                    onClick={(e) => scrollToSection(e, 'hero')}
                    className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 hover:opacity-80 transition-opacity"
                >
                    AlphaM2
                </a>

                <nav className="sm:flex gap-8 hidden">
                    {[
                        { name: 'Home', id: 'hero' },
                        { name: 'Experiences', id: 'projects' }, // Maps to #projects section
                        { name: 'About Me', id: 'about' },
                        { name: 'Contact', id: 'contact' },
                    ].map((item) => (
                        <a
                            key={item.name}
                            href={`#${item.id}`}
                            onClick={(e) => scrollToSection(e, item.id)}
                            className="text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 px-4 py-2 rounded-full transition-all"
                        >
                            {item.name}
                        </a>
                    ))}
                </nav>

                {/* Mobile Menu Icon could go here if needed, keeping it simple for now as requested */}
            </div>
        </header>
    );
}
