'use client';

import React, { useEffect, useRef } from 'react';

/**
 * Chaos & Math Engine for AlphaM2 Portfolio
 * 
 * Implements:
 * 1. Strange Attractors (Lorenz, Aizawa, Chen, Halvorsen)
 * 2. Parametric Flow Fields
 * 3. Morphing Logic (5-7s transitions)
 * 4. Visibility Overlay
 */

export default function SpiralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Optimization: Alpha false for background optimization, but we need trails so we'll handle clear manualy
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;
        let frameCount = 0;

        // --- Configuration ---
        const particleCount = 2500;
        const transitionDuration = 180; // ~3 seconds for smooth morph
        let cycleDuration = 360; // 6 seconds (variable 5-7s)

        // State
        let width = 0;
        let height = 0;
        let cx = 0;
        let cy = 0;

        enum EquationType {
            LORENZ,
            AIZAWA,
            CHEN,
            HALVORSEN,
            FLOW_FIELD_A,
            FLOW_FIELD_B,
            SPIRAL_GALAXY
        }

        let currentType = EquationType.SPIRAL_GALAXY;
        let nextType = EquationType.LORENZ;
        let transitionProgress = 0; // 0 to 1
        let isTransitioning = false;
        let stateTimer = 0;

        // Particle System
        const particles = new Float32Array(particleCount * 3); // x, y, z
        const velocities = new Float32Array(particleCount * 3); // vx, vy, vz
        const colors = new Float32Array(particleCount * 3); // r, g, b

        // Initialize Particles
        const initParticles = () => {
            for (let i = 0; i < particleCount * 3; i += 3) {
                // Initialize in a sphere/cloud
                particles[i] = (Math.random() - 0.5) * 40;
                particles[i + 1] = (Math.random() - 0.5) * 40;
                particles[i + 2] = (Math.random() - 0.5) * 40;

                // Random base colors (Deep Space: Blue/Violet/Teal/Gold)
                const scheme = Math.random();
                if (scheme < 0.6) { // Violet/Indigo main
                    colors[i] = 139 + Math.random() * 50;
                    colors[i + 1] = 92 + Math.random() * 50;
                    colors[i + 2] = 246;
                } else if (scheme < 0.85) { // Teal/Cyan main
                    colors[i] = 20;
                    colors[i + 1] = 180 + Math.random() * 75;
                    colors[i + 2] = 200 + Math.random() * 55;
                } else { // Gold hints
                    colors[i] = 245;
                    colors[i + 1] = 158 + Math.random() * 50;
                    colors[i + 2] = 11;
                }
            }
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

        // --- Math Kernels ---

        const getAttractorDelta = (type: EquationType, x: number, y: number, z: number): { dx: number, dy: number, dz: number } => {
            let dx = 0, dy = 0, dz = 0;
            const dt = 0.01; // Simulation step

            switch (type) {
                case EquationType.LORENZ:
                    // σ=10, ρ=28, β=8/3
                    dx = 10 * (y - x);
                    dy = x * (28 - z) - y;
                    dz = x * y - (8 / 3) * z;
                    break;
                case EquationType.CHEN:
                    // a=35, b=3, c=28
                    dx = 35 * (y - x);
                    dy = (28 - 35) * x - x * z + 28 * y;
                    dz = x * y - 3 * z;
                    break;
                case EquationType.HALVORSEN:
                    // a=1.4
                    const a = 1.4;
                    dx = -a * x - 4 * y - 4 * z - y * y;
                    dy = -a * y - 4 * z - 4 * x - z * z;
                    dz = -a * z - 4 * x - 4 * y - x * x;
                    break;
                case EquationType.AIZAWA:
                    // a=0.95, b=0.7, c=0.6, d=3.5, e=0.25, f=0.1
                    // x' = (z-b)x - dy
                    // y' = dx + (z-b)y
                    // z' = c + az - z^3/3 - (x^2+y^2)(1+e z) + f z x^3
                    const b = 0.7;
                    const c = 0.6;
                    const d = 3.5;
                    const e = 0.25;

                    dx = (z - b) * x - d * y;
                    dy = d * x + (z - b) * y;
                    dz = c + 0.95 * z - (z * z * z) / 3 - (x * x + y * y) * (1 + e * z) + 0.1 * z * x * x * x;
                    break;
                case EquationType.SPIRAL_GALAXY:
                    // Simple orbital mechanics for galaxy
                    const r = Math.sqrt(x * x + y * y);
                    const theta = Math.atan2(y, x);
                    // Swirl inward/outward based on Z
                    const force = 100 / (r + 1);
                    dx = -Math.sin(theta) * force * r * 0.5 - x * 0.05;
                    dy = Math.cos(theta) * force * r * 0.5 - y * 0.05;
                    dz = -z * 0.05; // flatten
                    break;
                default:
                    // Flow fields fall through logic below
                    dx = Math.sin(y * 0.1 + time * 0.002) * 20;
                    dy = Math.cos(x * 0.1 + time * 0.002) * 20;
                    dz = Math.sin(time * 0.01) * 10;
            }
            return { dx: dx * dt, dy: dy * dt, dz: dz * dt };
        };

        const render = () => {
            time++; // Global time

            // --- State Machine ---
            stateTimer++;
            if (stateTimer > cycleDuration && !isTransitioning) {
                isTransitioning = true;
                transitionProgress = 0;
                // Pick next random state
                const types = [
                    EquationType.LORENZ,
                    EquationType.AIZAWA,
                    EquationType.CHEN,
                    EquationType.HALVORSEN,
                    EquationType.FLOW_FIELD_A,
                    EquationType.SPIRAL_GALAXY
                ];
                let nextIdx = Math.floor(Math.random() * types.length);
                // Avoid repeat
                if (types[nextIdx] === currentType) nextIdx = (nextIdx + 1) % types.length;
                nextType = types[nextIdx];

                // Randomize duration for "Endless" feel (5s - 8s)
                cycleDuration = 300 + Math.random() * 180;
            }

            if (isTransitioning) {
                transitionProgress += 1 / transitionDuration;
                if (transitionProgress >= 1) {
                    currentType = nextType;
                    isTransitioning = false;
                    stateTimer = 0;
                    transitionProgress = 0;
                }
            }

            // --- Draw Background / Trails ---
            // "Visibility Improvement": We keep the background dark, trails subtle.
            // A semi-transparent black fill creates trails.
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, width, height);

            // --- Particle Simulation ---
            // Blend Mode for "Neon" look
            ctx.globalCompositeOperation = 'lighter'; // Additive blending for glow

            // Optimization buffer
            const scale = 15; // Scale attractors to screen

            for (let i = 0; i < particleCount * 3; i += 3) {
                let x = particles[i];
                let y = particles[i + 1];
                let z = particles[i + 2];

                // Calculate forces for Current State
                let v1 = getAttractorDelta(currentType, x, y, z);

                // If morphing, calculate forces for Next State
                if (isTransitioning) {
                    let v2 = getAttractorDelta(nextType, x, y, z);

                    // Smooth Interpolation of Vector Field
                    // This makes particles "re-route" mid-flight
                    const t = transitionProgress;
                    // EaseInOut
                    const ease = t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

                    v1.dx = v1.dx * (1 - ease) + v2.dx * ease;
                    v1.dy = v1.dy * (1 - ease) + v2.dy * ease;
                    v1.dz = v1.dz * (1 - ease) + v2.dz * ease;
                }

                // Generalized Flow Field Special Case (Override standard attractor logic)
                if (currentType === EquationType.FLOW_FIELD_A || (isTransitioning && nextType === EquationType.FLOW_FIELD_A)) {
                    // Reset if far out bounds for flow field
                    if (Math.abs(x) > 50 || Math.abs(y) > 50) {
                        x = (Math.random() - 0.5) * 40;
                        y = (Math.random() - 0.5) * 40;
                        z = (Math.random() - 0.5) * 40;
                    }
                }

                // Update Position
                // Speed throttling prevents explosion
                const speedLimit = 2.0;
                x += Math.max(-speedLimit, Math.min(speedLimit, v1.dx * 10)); // Speed modifier
                y += Math.max(-speedLimit, Math.min(speedLimit, v1.dy * 10));
                z += Math.max(-speedLimit, Math.min(speedLimit, v1.dz * 10));

                // Respawn Logic (Attractors can fling particles to infinity or trap them)
                const bound = 80;
                if (x * x + y * y + z * z > bound * bound || isNaN(x)) {
                    x = (Math.random() - 0.5) * 20;
                    y = (Math.random() - 0.5) * 20;
                    z = (Math.random() - 0.5) * 20;
                }

                particles[i] = x;
                particles[i + 1] = y;
                particles[i + 2] = z;

                // --- 3D Projection ---
                const fov = 800;
                // Add simple rotation based on time for camera movement
                const camRot = time * 0.001;
                const rx = x * Math.cos(camRot) - z * Math.sin(camRot);
                const rz = x * Math.sin(camRot) + z * Math.cos(camRot);

                // Project
                const scaleProj = fov / (fov + rz + 200); // 200 z-offset
                const screenX = cx + rx * scale * scaleProj;
                const screenY = cy + y * scale * scaleProj;
                const size = Math.max(0.1, 1.5 * scaleProj);

                // Draw
                ctx.fillStyle = `rgb(${colors[i]}, ${colors[i + 1]}, ${colors[i + 2]})`;
                ctx.fillRect(screenX, screenY, size, size);
            }

            ctx.globalCompositeOperation = 'source-over'; // Reset blend mode

            // --- Visibility Overlay ---
            // User requested: "Content getting swallowed... make content standout"
            // We'll add a radial gradient overlay that darkens the center or ensures text contrast
            // Actually, simply keeping the `alpha` in fillRect low helps tracks from building up too bright.
            // But let's add a fixed darkening layer on top if the effect gets too intense.

            // Optional: Vignette to focus center
            /*
            const gradient = ctx.createRadialGradient(cx, cy, height * 0.5, cx, cy, height);
            gradient.addColorStop(0, 'rgba(0,0,0,0)');
            gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0, width, height);
            */

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
            {/* Visibility Layer: Dark overlay to ensure text legibility */}
            <div className="fixed inset-0 pointer-events-none z-0 bg-black/40" />
        </>
    );
}
