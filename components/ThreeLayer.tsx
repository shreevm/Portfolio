'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function ThreeLayer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  // For mouse parallax
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Scene with a deep background or transparent
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Create perspective camera
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.z = 15;
    cameraRef.current = camera;

    // Create WebGL Renderer with alpha transparency and antialiasing
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create custom soft glowing circle particle texture
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Gradient for glowing bokeh effect
        const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.2, 'rgba(255, 150, 50, 0.8)');
        gradient.addColorStop(0.5, 'rgba(255, 100, 30, 0.2)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 64, 64);
      }
      return new THREE.CanvasTexture(canvas);
    };

    const particleTexture = createParticleTexture();

    // Generate Particles
    const particleCount = 200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const randomOffsets = new Float32Array(particleCount * 3); // For individual sine wave speeds

    // Color definitions
    // Orange glowing: range of warm sunset/amber colors
    // White glowing: soft pure white bokeh
    const orangeColor = new THREE.Color('#f97316');
    const whiteColor = new THREE.Color('#ffffff');
    const amberColor = new THREE.Color('#ea580c');

    for (let i = 0; i < particleCount; i++) {
      // Position particles in a 3D box region
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 15;

      // Color distribution (70% warm orange/amber, 30% pure white)
      const colorRand = Math.random();
      let colorToSet = orangeColor;
      if (colorRand > 0.7) {
        colorToSet = whiteColor;
      } else if (colorRand > 0.4) {
        colorToSet = amberColor;
      }

      colors[i * 3] = colorToSet.r;
      colors[i * 3 + 1] = colorToSet.g;
      colors[i * 3 + 2] = colorToSet.b;

      // Sizes
      sizes[i] = Math.random() * 4.5 + 1.5;

      // Sine-wave offset factors (frequency, vertical speed, phase)
      randomOffsets[i * 3] = Math.random() * Math.PI * 2; // phase
      randomOffsets[i * 3 + 1] = Math.random() * 0.2 + 0.05; // speed
      randomOffsets[i * 3 + 2] = Math.random() * 0.5 + 0.1; // scale/amplitude
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom material with Additive Blending and depth check deactivated (depthWrite) for premium transparency layering
    const material = new THREE.PointsMaterial({
      size: 1.0,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true,
    });

    // Custom shader material is alternative, but PointsMaterial has everything we need for high perf
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
    particlesRef.current = particles;

    // Handle mouse movement for Parallax
    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      mouseRef.current.targetX = x * 4; // Max parallax offset X
      mouseRef.current.targetY = y * 2; // Max parallax offset Y
    };

    window.addEventListener('mousemove', handleMouseMove);

    // ResizeObserver configuration for strict responsive canvas container sizing
    let resizeTimeout: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver((entries) => {
      // Debounce resize updates for peak performance on rapid resizing
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        for (let entry of entries) {
          const { width, height } = entry.contentRect;
          if (camera) {
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
          }
          if (renderer) {
            renderer.setSize(width, height);
          }
        }
      }, 100);
    });

    resizeObserver.observe(container);

    // Animation loop (Sine wave oscillations and lerped mouse parallax)
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Update particles using positions buffer
      if (particles) {
        const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
        const array = positionAttribute.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          const idx = i * 3;
          const phase = randomOffsets[i * 3];
          const speed = randomOffsets[i * 3 + 1];
          const amp = randomOffsets[i * 3 + 2];

          // Slow organic float: up-down and sideways wobble
          // We add a tiny amount of vertical drifting that wraps around boundaries
          array[idx + 1] += Math.sin(elapsedTime * speed + phase) * 0.005; // Y drift
          array[idx] += Math.cos(elapsedTime * (speed * 0.5) + phase) * 0.003; // X drift

          // Boundary wrapping (keep particles inside the visible frustum grid)
          if (array[idx + 1] > 12) array[idx + 1] = -12;
          if (array[idx + 1] < -12) array[idx + 1] = 12;
          if (array[idx] > 18) array[idx] = -18;
          if (array[idx] < -18) array[idx] = 18;
        }
        positionAttribute.needsUpdate = true;
      }

      // Smooth camera position damping (Lerping) for buttery parallax
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      if (camera) {
        camera.position.x = mouseRef.current.x;
        camera.position.y = -mouseRef.current.y; // invert parallax for cinematic realism
        camera.lookAt(0, 0, 0);
      }

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }

      animationFrameIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Resource Cleanup to prevent memory leaks!
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      clearTimeout(resizeTimeout);
      
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      // Traversal and disposal of all geometries, textures, materials, and renderer nodes
      geometry.dispose();
      material.dispose();
      particleTexture.dispose();

      if (renderer && container) {
        if (container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div
      id="three-canvas-container"
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-hidden mix-blend-screen opacity-80"
    />
  );
}
