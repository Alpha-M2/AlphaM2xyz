'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Chaos & Math Engine for AlphaM2 Portfolio
 * 
 * Features:
 * - Strange Attractors: Lorenz, Aizawa, Chen, Halvorsen
 * - Palette: High-Voltage Neon, Limited to 1-2 Colors per State
 * - Physics: Particle Flow with Morphing
 */

export default function SpiralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;
        let stateTimer = 0;

        // --- Configuration ---
        const particleCount = 3000; // Increased density for "solid" look
        const transitionDuration = 120; // Faster morph (~2s)
        let cycleDuration = 400;

        let width = 0;
        let height = 0;
        let cx = 0;
        let cy = 0;

        enum EquationType {
            LORENZ,     // Classic Pink/Purple
            AIZAWA,     // Green Sphere
            CHEN,       // Blue/Cyan vortex
            HALVORSEN,  // Gold/Orange rings
            FLOW_FIELD, // Neon waves
            GALAXY      // White/Blue spiral
        }

        let currentType = EquationType.GALAXY;
        let nextType = EquationType.LORENZ;
        let transitionProgress = 0;
        let isTransitioning = false;

        // Particle System
        const particles = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        // --- Infinite Neon Gradient Engine ---
        // Generates a random "Hot Neon" theme for each state.
        // Rule: "One dominant color per state" but "Gradients/Blending Encouraged".

        let currentStateHue = Math.random() * 360;
        let nextStateHue = Math.random() * 360;

        const applyColors = (baseHue: number) => {
            for (let i = 0; i < particleCount * 3; i += 3) {
                // "Go Wild with Blending":
                // Primary Hue + Random Variation (Analogous Gradient)
                // This creates a rich, "deep" color look rather than flat single-color.
                const variance = (Math.random() - 0.5) * 60; // +/- 30 degrees variance
                const hue = baseHue + variance;

                // Neon brightness strategies:
                // 1. High Saturation (80-100%)
                // 2. High Lightness (50-80%) for "Glow"
                const sat = 80 + Math.random() * 20;
                const light = 50 + Math.random() * 30;

                // Convert HSL to RGB for Canvas
                const [r, g, b] = hslToRgb(hue / 360, sat / 100, light / 100);

                colors[i] = r;
                colors[i + 1] = g;
                colors[i + 2] = b;
            }
        };

        // Helper: HSL to RGB
        function hslToRgb(h: number, s: number, l: number) {
            let r, g, b;
            if (s === 0) {
                r = g = b = l; // achromatic
            } else {
                const hue2rgb = (p: number, q: number, t: number) => {
                    if (t < 0) t += 1;
                    if (t > 1) t -= 1;
                    if (t < 1 / 6) return p + (q - p) * 6 * t;
                    if (t < 1 / 2) return q;
                    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                    return p;
                };
                const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                const p = 2 * l - q;
                r = hue2rgb(p, q, h + 1 / 3);
                g = hue2rgb(p, q, h);
                b = hue2rgb(p, q, h - 1 / 3);
            }
            return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
        }

        const initParticles = () => {
            for (let i = 0; i < particleCount * 3; i += 3) {
                particles[i] = (Math.random() - 0.5) * 50;
                particles[i + 1] = (Math.random() - 0.5) * 50;
                particles[i + 2] = (Math.random() - 0.5) * 50;
            }
            applyColors(currentStateHue);
        };

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            cx = width / 2;
            cy = height / 2;
        };
        window.addEventListener('resize', resize);
        resize();
        initParticles();

        const getAttractorDelta = (type: EquationType, x: number, y: number, z: number): { dx: number, dy: number, dz: number } => {
            let dx = 0, dy = 0, dz = 0;
            const dt = 0.008;

            switch (type) {
                case EquationType.LORENZ:
                    dx = 10 * (y - x);
                    dy = x * (28 - z) - y;
                    dz = x * y - (8 / 3) * z;
                    break;
                case EquationType.CHEN:
                    dx = 40 * (y - x);
                    dy = (28 - 40) * x - x * z + 28 * y;
                    dz = x * y - 3 * z;
                    break;
                case EquationType.HALVORSEN:
                    const a = 1.89;
                    dx = -a * x - 4 * y - 4 * z - y * y;
                    dy = -a * y - 4 * z - 4 * x - z * z;
                    dz = -a * z - 4 * x - 4 * y - x * x;
                    break;
                case EquationType.AIZAWA:
                    const b = 0.7; const c = 0.6; const d = 3.5; const e = 0.25; const f = 0.1;
                    dx = (z - b) * x - d * y;
                    dy = d * x + (z - b) * y;
                    dz = c + 0.95 * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + 0.1 * z * x * x * x;
                    break;
                case EquationType.GALAXY:
                    const r = Math.sqrt(x * x + y * y);
                    const theta = Math.atan2(y, x);
                    const force = 50 / (r + 0.1);
                    dx = -Math.sin(theta) * force * r - x * 0.1;
                    dy = Math.cos(theta) * force * r - y * 0.1;
                    dz = -z * 0.1;
                    break;
                default: // FLOW_FIELD
                    dx = Math.sin(y * 0.05 + time * 0.005) * 50;
                    dy = Math.cos(x * 0.05 + time * 0.005) * 50;
                    dz = Math.sin(time * 0.02) * 20;
            }
            return { dx: dx * dt, dy: dy * dt, dz: dz * dt };
        };

        const render = () => {
            time++; // Global time
            stateTimer++;

            // --- State Switch Logic ---
            if (stateTimer > cycleDuration && !isTransitioning) {
                isTransitioning = true;
                transitionProgress = 0;

                const types = [
                    EquationType.LORENZ,
                    EquationType.AIZAWA,
                    EquationType.FLOW_FIELD,
                    EquationType.HALVORSEN,
                    EquationType.CHEN,
                    EquationType.GALAXY
                ];
                let nextIdx = Math.floor(Math.random() * types.length);
                if (types[nextIdx] === currentType) nextIdx = (nextIdx + 1) % types.length;
                nextType = types[nextIdx];

                // Pick a WILD new random Neon Hue
                // Ensure it is distinct from current (shift by at least 60deg)
                nextStateHue = (currentStateHue + 60 + Math.random() * 240) % 360;

                cycleDuration = 300 + Math.random() * 200;
            }

            // --- Color Morph Logic ---
            if (isTransitioning) {
                transitionProgress += 1 / transitionDuration;

                // Smoothly blend the Hue? Or Particle Flip?
                // User said "Ingredients/Blending is encouraged".
                // Let's drift the "Current State Hue" towards "Target Hue".
                // BUT circular interpolation for Hue is tricky.

                // Simpler: Just allow particles to randomly flip to the new Gradient theme
                if (time % 5 === 0) {
                    for (let i = 0; i < particleCount * 3; i += 3) {
                        // Flip to new gradient palette
                        if (Math.random() < 0.05) {
                            const variance = (Math.random() - 0.5) * 60;
                            const hue = nextStateHue + variance;
                            const sat = 80 + Math.random() * 20;
                            const light = 50 + Math.random() * 30;
                            const [r, g, b] = hslToRgb(hue / 360, sat / 100, light / 100);

                            colors[i] = r;
                            colors[i + 1] = g;
                            colors[i + 2] = b;

                            if (Math.random() < 0.1) {
                                particles[i] = (Math.random() - 0.5) * 20;
                                particles[i + 1] = (Math.random() - 0.5) * 20;
                                particles[i + 2] = (Math.random() - 0.5) * 20;
                            }
                        }
                    }
                }

                if (transitionProgress >= 1) {
                    currentType = nextType;
                    currentStateHue = nextStateHue;
                    isTransitioning = false;
                    stateTimer = 0;
                    transitionProgress = 0;
                    applyColors(currentStateHue); // Snap remaining
                }
            }

            // --- Draw ---
            // Fade trails: Darker fade => brighter trails
            ctx.fillStyle = 'rgba(0, 0, 0, 0.12)';
            ctx.fillRect(0, 0, width, height);

            ctx.globalCompositeOperation = 'lighter'; // Neon Glow

            let scale = 18;
            if (currentType === EquationType.AIZAWA) scale = 300; // Aizawa is naturally tiny
            if (currentType === EquationType.FLOW_FIELD) scale = 4; // Flow is huge

            // Interpolate scale for smooth zoom
            // (Simple hack: just use current scale, fixing zoom smoothly is hard without state)

            for (let i = 0; i < particleCount * 3; i += 3) {
                let x = particles[i];
                let y = particles[i + 1];
                let z = particles[i + 2];

                let v1 = getAttractorDelta(currentType, x, y, z);

                if (isTransitioning) {
                    let v2 = getAttractorDelta(nextType, x, y, z);
                    const t = transitionProgress;
                    const ease = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                    v1.dx = v1.dx * (1 - ease) + v2.dx * ease;
                    v1.dy = v1.dy * (1 - ease) + v2.dy * ease;
                    v1.dz = v1.dz * (1 - ease) + v2.dz * ease;
                }

                x += v1.dx * 10;
                y += v1.dy * 10;
                z += v1.dz * 10;

                // Respawn Logic
                const bound = 100;
                if (x * x + y * y + z * z > bound * bound || isNaN(x)) {
                    // Respawn at random spot near center
                    x = (Math.random() - 0.5) * 10;
                    y = (Math.random() - 0.5) * 10;
                    z = (Math.random() - 0.5) * 10;
                }

                particles[i] = x;
                particles[i + 1] = y;
                particles[i + 2] = z;

                // Project
                const fov = 600;
                const camRot = time * 0.002;
                const rx = x * Math.cos(camRot) - z * Math.sin(camRot);
                const rz = x * Math.sin(camRot) + z * Math.cos(camRot);

                const scaleProj = fov / (fov + rz + 300);
                const screenX = cx + rx * scale * scaleProj;
                const screenY = cy + y * scale * scaleProj;

                // Draw Particle
                // Opacity based on Z to fake depth
                const alpha = Math.min(1.0, (scaleProj - 0.2));
                ctx.fillStyle = `rgba(${colors[i]}, ${colors[i + 1]}, ${colors[i + 2]}, ${alpha})`;
                ctx.fillRect(screenX, screenY, 1.6, 1.6);
            }

            ctx.globalCompositeOperation = 'source-over';

            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <>
            <canvas
                ref={canvasRef}
                className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-black"
                style={{ opacity: 1 }}
            />
            {/* Overlay for text visibility */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-black/40" />
        </>
    );
}
