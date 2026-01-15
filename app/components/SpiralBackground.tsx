'use client';

import React, { useEffect, useRef } from 'react';

export default function SpiralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: no alpha channel for bg
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;

        // Configuration
        const particleCount = 600; // Balanced for performance and look
        const armCount = 3; // Number of spiral arms
        const armSpread = 0.5; // How "loose" the arms are
        const rotationSpeed = 0.0005; // Very slow, hypnotic rotation

        // Color Palettes (Deep Space)
        const palettes = [
            // Deep Purple / Blue
            ['#0f172a', '#312e81', '#4c1d95', '#581c87', '#7c3aed'],
            // Cosmic Teal / Void
            ['#020617', '#1e1b4b', '#115e59', '#0f766e', '#2dd4bf'],
            // Mystical Gold / Noir
            ['#000000', '#1c1917', '#78350f', '#b45309', '#f59e0b']
        ];

        // Dimensions
        let width = 0;
        let height = 0;
        let cx = 0;
        let cy = 0;

        interface Particle {
            angle: number;
            radius: number;
            speed: number;
            size: number;
            color: string;
            orbitOffset: number;
            drift: number;
            pulsePhase: number;
        }

        let particles: Particle[] = [];

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                // Logarithmic distribution for density near center
                const randomDist = Math.pow(Math.random(), 1.5);

                // Assign to an arm with some randomness
                const armIndex = i % armCount;
                const armAngle = (armIndex / armCount) * Math.PI * 2;
                const spread = (Math.random() - 0.5) * armSpread; // Scatter around arm

                particles.push({
                    angle: armAngle + spread, // Base angle
                    radius: randomDist, // Normalized radius (0-1)
                    speed: (Math.random() * 0.002) + 0.001, // Individual drift
                    size: Math.random() * 2 + 0.5,
                    color: palettes[0][Math.floor(Math.random() * palettes[0].length)],
                    orbitOffset: Math.random() * Math.PI * 2,
                    drift: (Math.random() - 0.5) * 0.1,
                    pulsePhase: Math.random() * Math.PI * 2
                });
            }
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            cx = width / 2;
            cy = height / 2;
            initParticles();
        };

        window.addEventListener('resize', resize);
        resize();

        const render = () => {
            time += 1;

            // Slow Color Shift Cycle (every ~30s)
            const cycleSpeed = 0.0005;
            const cycle = (Date.now() * cycleSpeed) % (palettes.length * Math.PI);
            const paletteIndex = Math.floor(Math.abs(Math.sin(cycle)) * palettes.length) % palettes.length;
            const currentPalette = palettes[paletteIndex];

            // Subtle Trails: instead of clearRect, draw semi-transparent rect
            ctx.fillStyle = 'rgba(5, 5, 10, 0.2)'; // Very dark fade, creating trails
            ctx.fillRect(0, 0, width, height);

            // Global Rotation
            const globalRotation = time * rotationSpeed;

            particles.forEach((p, i) => {
                // Calculate position based on spiral equation
                // r = a * e^(b * theta) ... simplified for visual effect here

                // Current spiral angle including rotation vs distance
                // Twist factor: further particles rotate slower or Lag behind? 
                // Let's make a galaxy twist: inner moves faster angularly, or just simple rigid body + twist

                const distance = p.radius * Math.max(width, height) * 0.8;

                // Galaxy twist: angle offset increases with distance (winding arms)
                const spiralTwist = p.radius * 5;

                const currentAngle = p.angle + globalRotation + spiralTwist + p.drift;

                const x = cx + Math.cos(currentAngle) * distance;
                const y = cy + Math.sin(currentAngle) * distance;

                // Breathing/Pulsing effect
                const pulse = Math.sin(time * 0.02 + p.pulsePhase);
                const drawSize = p.size * (1 + pulse * 0.2); // +/- 20% size
                const opacity = Math.max(0.1, Math.min(0.8, (1 - p.radius) + pulse * 0.1)); // Fade out at edges

                // Periodic color update (expensive to do every frame, so we just pick from palette occasionally or blend? 
                // For performance, just stick to assigned color but maybe simple opacity shift is enough)
                // Let's try to shift color slowly towards current palette
                if (Math.random() < 0.001) {
                    p.color = currentPalette[Math.floor(Math.random() * currentPalette.length)];
                }

                ctx.beginPath();
                ctx.arc(x, y, drawSize, 0, Math.PI * 2);

                // Glow effect
                ctx.shadowBlur = drawSize * 4;
                ctx.shadowColor = p.color;

                ctx.fillStyle = p.color;
                // Hack for opacity with hex colors: use globalAlpha
                ctx.globalAlpha = opacity;
                ctx.fill();
                ctx.globalAlpha = 1.0;
                ctx.shadowBlur = 0;
            });

            // Draw center "void" or glow
            const centerGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 200);
            centerGradient.addColorStop(0, 'rgba(10, 0, 30, 0)');
            centerGradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Transparent
            ctx.fillStyle = centerGradient;
            ctx.fillRect(0, 0, width, height);

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
        />
    );
}
