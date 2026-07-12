'use client';

import { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  w: number;
  h: number;
  opacity: number;
  color: string;
  wobbleSpeed: number;
  wobbleOffset: number;
  t: number;
}

const COLORS = [
  '#c5a25a', // antique gold
  '#ead8aa', // soft gold
  '#d8b8a8', // rose
  '#6f8d85', // eucalyptus
  '#fff8f0', // ivory
];

function makePetal(screenW: number, y?: number): Petal {
  return {
    x: Math.random() * screenW,
    y: y ?? -20,
    vx: (Math.random() - 0.5) * 0.6,
    vy: Math.random() * 0.7 + 0.25,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.025,
    w: Math.random() * 12 + 7,
    h: Math.random() * 6 + 3,
    opacity: Math.random() * 0.45 + 0.2,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    wobbleSpeed: Math.random() * 0.018 + 0.008,
    wobbleOffset: Math.random() * Math.PI * 2,
    t: 0,
  };
}

export default function FloatingPetals() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf: number;
    const petals: Petal[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Seed petals spread across full screen height on load
    for (let i = 0; i < 35; i++) {
      const p = makePetal(window.innerWidth, Math.random() * window.innerHeight);
      petals.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Trickle new petals in
      if (petals.length < 45 && Math.random() < 0.25) {
        petals.push(makePetal(window.innerWidth));
      }

      for (let i = petals.length - 1; i >= 0; i--) {
        const p = petals[i];
        p.t += p.wobbleSpeed;
        p.x += p.vx + Math.sin(p.t + p.wobbleOffset) * 0.55;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.y > canvas.height + 30) petals.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-10 pointer-events-none"
    />
  );
}
