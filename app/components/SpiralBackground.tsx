'use client';

import React, { useEffect, useRef } from 'react';

export default function SpiralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resize);
        resize();

        // Particle configuration
        const particleCount = 1000; // Adjust for density
        const particles: { x: number; y: number; z: number; renderX: number; renderY: number; size: number; baseColor: string }[] = [];

        const colors = [
            'rgba(139, 92, 246, 0.8)', // Violet
            'rgba(168, 85, 247, 0.8)', // Purple
            'rgba(99, 102, 241, 0.8)', // Indigo
            'rgba(192, 132, 252, 0.6)' // Lighter Purple
        ];


        for (let i = 0; i < particleCount; i++) {
            // Distribute particles in a spiral or cylindrical volume
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * 800; // Spread radius
            const depth = Math.random() * 2000; // Depth spread

            particles.push({
                x: Math.cos(angle) * radius,
                y: Math.sin(angle) * radius,
                z: depth - 1000, // Center z around 0
                renderX: 0,
                renderY: 0,
                size: Math.random() * 2,
                baseColor: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        const render = () => {
            time += 0.002; // Rotation speed

            // Clear with a very slight fade for potential trails (optional, using clearRect for crispness here)
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Standard clear

            // Or use this for a subtle trail effect:
            // ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            // ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            particles.forEach(p => {
                // Rotate around Z axis (2D rotation)
                // const rotX = p.x * Math.cos(time) - p.y * Math.sin(time);
                // const rotY = p.x * Math.sin(time) + p.y * Math.cos(time);

                // Let's do a 3D spiral rotation effect
                // Rotate the entire cloud
                const cosT = Math.cos(time);
                const sinT = Math.sin(time);

                // Rotate around Z
                let x1 = p.x * cosT - p.y * sinT;
                let y1 = p.x * sinT + p.y * cosT;
                let z1 = p.z;

                // Add a "flow" through the Z axis to mimic moving through a wormhole
                z1 -= 2; // Move "towards" camera
                if (z1 < -1000) z1 += 2000; // Reset to back

                // Simple perspective projection
                const fov = 1000;
                const scale = fov / (fov + z1);

                p.renderX = centerX + x1 * scale;
                p.renderY = centerY + y1 * scale;
                const renderSize = Math.max(0.1, p.size * scale);

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.renderX, p.renderY, renderSize, 0, Math.PI * 2);
                ctx.fillStyle = p.baseColor;
                ctx.fill();

                // Add simple connection lines for "constellation" look if close (optional - can be heavy)
                // Keeping it just particles for clean "professional" look as requested
            });

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-black"
            style={{ opacity: 1 }}
        />
    );
}
