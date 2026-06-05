'use client';

import { useEffect, useRef } from 'react';

export default function CursorSparkle() {
  const lastRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastRef.current < 40) return; // throttle ~25fps
      lastRef.current = now;

      const size = Math.random() * 7 + 3;
      const color = Math.random() > 0.45 ? '#b89b6e' : Math.random() > 0.5 ? '#d8c6a8' : '#faf7f2';
      const tx = (Math.random() - 0.5) * 40;
      const ty = (Math.random() - 0.5) * 40;

      const el = document.createElement('span');
      el.style.cssText = `
        position:fixed;
        left:${e.clientX}px;
        top:${e.clientY}px;
        width:${size}px;
        height:${size}px;
        border-radius:50%;
        pointer-events:none;
        z-index:9999;
        background:${color};
        transform:translate(-50%,-50%) scale(1);
        transition:transform 600ms ease-out,opacity 600ms ease-out;
        opacity:1;
      `;
      document.body.appendChild(el);

      requestAnimationFrame(() => {
        el.style.transform = `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`;
        el.style.opacity = '0';
      });

      setTimeout(() => el.remove(), 650);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  return null;
}
