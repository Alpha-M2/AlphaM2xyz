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

        // --- Neon Palette Generator ---
        // Sticking to "1 or 2 colors" rule
        const getColorsForState = (type: EquationType): number[][] => {
            switch (type) {
                case EquationType.LORENZ:
                    // Hot Pink & Red (Reference: Pink Spiral)
                    return [[255, 0, 128], [255, 50, 50]];
                case EquationType.AIZAWA:
                    // Electric Green & Yellow (Reference: Green Object)
                    return [[0, 255, 64], [200, 255, 0]];
                case EquationType.CHEN:
                    // Cyan & Deep Blue
                    return [[0, 255, 255], [0, 100, 255]];
                case EquationType.HALVORSEN:
                    // Bright Gold & Orange
                    return [[255, 200, 0], [255, 100, 0]];
                case EquationType.FLOW_FIELD:
                    // Electric Violet
                    return [[180, 0, 255], [100, 50, 255]];
                case EquationType.GALAXY:
                    // Pure White & Ice Blue
                    return [[255, 255, 255], [200, 220, 255]];
            }
            return [[255, 255, 255]];
        };

        const applyColors = (type: EquationType) => {
            const palette = getColorsForState(type);
            for (let i = 0; i < particleCount * 3; i += 3) {
                const color = palette[Math.floor(Math.random() * palette.length)];
                colors[i] = color[0];
                colors[i + 1] = color[1];
                colors[i + 2] = color[2];
            }
        };

        const initParticles = () => {
            for (let i = 0; i < particleCount * 3; i += 3) {
                particles[i] = (Math.random() - 0.5) * 50;
                particles[i + 1] = (Math.random() - 0.5) * 50;
                particles[i + 2] = (Math.random() - 0.5) * 50;
            }
            applyColors(currentType);
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
            const dt = 0.008; // slightly slower step for stability

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
                    const a = 1.89; // tweaked parameter
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

                // Smart cycle
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

                cycleDuration = 300 + Math.random() * 200; // 5-8s hold
            }

            // --- Color Morph Logic ---
            // When transitioning, we also interpolate the colors to the NEW palette target
            // Ideally we just lerp the RGB values of each particle towards a new random color from the next palette
            if (isTransitioning) {
                transitionProgress += 1 / transitionDuration;

                // Color morphing 1% per frame towards new palette default
                // This is cheaper than calculating full Lerp for every particle every frame
                // just random chance to swap color
                if (time % 5 === 0) { // Optimization
                    let nextPalette = getColorsForState(nextType);
                    for (let i = 0; i < particleCount * 3; i += 3) {
                        // 5% of particles change color per check
                        if (Math.random() < 0.05) {
                            const c = nextPalette[Math.floor(Math.random() * nextPalette.length)];
                            colors[i] = c[0]; colors[i + 1] = c[1]; colors[i + 2] = c[2];

                            // Respawn on transition
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
                    isTransitioning = false;
                    stateTimer = 0;
                    transitionProgress = 0;
                    applyColors(currentType); // Snap remaining
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
