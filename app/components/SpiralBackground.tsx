'use client';

import React, { useEffect, useRef } from 'react';

export default function SpiralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;

        // Configuration
        const particleCount = 2000;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Math Engine State
        // The equation is roughly:
        // dx = sin(t*A + y*B + C) * D
        // dy = cos(t*E + x*F + G) * H
        interface Coefficients {
            a: number; b: number; c: number; d: number;
            e: number; f: number; g: number; h: number;
            zoom: number;
        }

        let currentCoeffs: Coefficients = generateCoeffs();
        let targetCoeffs: Coefficients = generateCoeffs();
        let transitionProgress = 0;

        // Color Engine
        let currentColor = { r: 10, g: 10, b: 20 };
        let targetColor = { r: 10, g: 10, b: 20 };

        function generateCoeffs(): Coefficients {
            return {
                a: (Math.random() - 0.5) * 0.02,
                b: (Math.random() - 0.5) * 0.02,
                c: (Math.random() - 0.5) * 2,
                d: (Math.random() - 0.5) * 2,
                e: (Math.random() - 0.5) * 0.02,
                f: (Math.random() - 0.5) * 0.02,
                g: (Math.random() - 0.5) * 2,
                h: (Math.random() - 0.5) * 2,
                zoom: Math.random() * 0.005 + 0.001
            };
        }

        function generateColor() {
            // Generates a deep space base color (dark purples, blues, teals)
            const hue = Math.random() * 360;
            return {
                r: Math.floor(Math.sin(hue * 0.017) * 20 + 20),
                g: Math.floor(Math.sin((hue + 120) * 0.017) * 20 + 20),
                b: Math.floor(Math.sin((hue + 240) * 0.017) * 40 + 60)
            };
        }

        // Particles
        const particles = new Float32Array(particleCount * 2); // x, y interleaved
        for (let i = 0; i < particleCount * 2; i += 2) {
            particles[i] = Math.random() * width;
            particles[i + 1] = Math.random() * height;
        }

        let time = 0;
        let lastTargetChange = 0;
        const transitionDuration = 300; // frames (~5s)

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Clean slate on resize to avoid stretching
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        };
        window.addEventListener('resize', resize);
        resize();

        const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

        const render = () => {
            time++;

            // 1. Manage State Transition (Mutate genes every 300 frames / 5s)
            transitionProgress++;
            if (transitionProgress > transitionDuration) {
                currentCoeffs = { ...targetCoeffs }; // Snap to target
                targetCoeffs = generateCoeffs();   // Pick new target
                currentColor = { ...targetColor };
                targetColor = generateColor();
                transitionProgress = 0;
            }

            // Interpolate coefficients for this frame
            const t = transitionProgress / transitionDuration;
            // Ease in-out
            const ease = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

            const A = lerp(currentCoeffs.a, targetCoeffs.a, ease);
            const B = lerp(currentCoeffs.b, targetCoeffs.b, ease);
            const C = lerp(currentCoeffs.c, targetCoeffs.c, ease);
            const D = lerp(currentCoeffs.d, targetCoeffs.d, ease);
            const E = lerp(currentCoeffs.e, targetCoeffs.e, ease);
            const F = lerp(currentCoeffs.f, targetCoeffs.f, ease);
            const G = lerp(currentCoeffs.g, targetCoeffs.g, ease);
            const H = lerp(currentCoeffs.h, targetCoeffs.h, ease);
            const ZOOM = lerp(currentCoeffs.zoom, targetCoeffs.zoom, ease);

            // Interpolate Background Color
            const R = lerp(currentColor.r, targetColor.r, ease);
            const G_col = lerp(currentColor.g, targetColor.g, ease);
            const B_col = lerp(currentColor.b, targetColor.b, ease);

            // 2. Draw Trails
            // Instead of clearing, we draw a semi-transparent rect of the current base color
            // This creates the "fade" effect and color shifting background
            ctx.fillStyle = `rgba(${R}, ${G_col}, ${B_col}, 0.05)`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // 3. Update & Draw Particles
            ctx.fillStyle = `rgba(200, 220, 255, 0.4)`; // Particle color (white-ish)

            for (let i = 0; i < particleCount * 2; i += 2) {
                let x = particles[i];
                let y = particles[i + 1];

                // Generalized Flow Field Equation
                // The "genes" A-H control the shape of the field
                const noiseX = (x - canvas.width / 2) * ZOOM;
                const noiseY = (y - canvas.height / 2) * ZOOM;

                // Vector field calculation
                const vx = Math.sin(time * A + noiseY * B + C) * 2;
                const vy = Math.cos(time * E + noiseX * F + G) * 2;

                x += vx;
                y += vy;

                // Wrap around screen
                if (x < 0) x = canvas.width;
                if (x > canvas.width) x = 0;
                if (y < 0) y = canvas.height;
                if (y > canvas.height) y = 0;

                particles[i] = x;
                particles[i + 1] = y;

                ctx.fillRect(x, y, 1.5, 1.5);
            }

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
