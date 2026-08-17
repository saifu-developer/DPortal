import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const PARTICLE_COUNT = 90;
const CONNECT_DISTANCE = 145;
const MOUSE_RADIUS = 240;
const MOUSE_FORCE = 0.04;

function createParticles(width, height) {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    radius: Math.random() * 1.2 + 1.2,
  }));
}

export default function BioTechLoginBackground({ mouse }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef(mouse);
  const particlesRef = useRef([]);
  const frameRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    mouseRef.current = mouse;
  }, [mouse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particlesRef.current = createParticles(width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const particles = particlesRef.current;
      const { x: mouseX, y: mouseY } = mouseRef.current;
      const mx = mouseX * width;
      const my = mouseY * height;

      ctx.clearRect(0, 0, width, height);

      if (!reducedMotion) {
        for (const particle of particles) {
          particle.x += particle.vx;
          particle.y += particle.vy;

          particle.vx += (Math.random() - 0.5) * 0.015;
          particle.vy += (Math.random() - 0.5) * 0.015;
          particle.vx *= 0.992;
          particle.vy *= 0.992;

          const dx = mx - particle.x;
          const dy = my - particle.y;
          const dist = Math.hypot(dx, dy);
          if (dist > 0 && dist < MOUSE_RADIUS) {
            const force = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE;
            particle.vx += (dx / dist) * force;
            particle.vy += (dy / dist) * force;
          }

          if (particle.x <= 0 || particle.x >= width) particle.vx *= -1;
          if (particle.y <= 0 || particle.y >= height) particle.vy *= -1;
          particle.x = Math.max(0, Math.min(width, particle.x));
          particle.y = Math.max(0, Math.min(height, particle.y));
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);

          if (dist >= CONNECT_DISTANCE) continue;

          const midX = (a.x + b.x) / 2;
          const midY = (a.y + b.y) / 2;
          const mouseDist = Math.hypot(mx - midX, my - midY);

          let alpha = (1 - dist / CONNECT_DISTANCE) * 0.42;
          if (mouseDist < MOUSE_RADIUS) {
            alpha += (1 - mouseDist / MOUSE_RADIUS) * 0.38;
          }

          ctx.beginPath();
          ctx.strokeStyle = `rgba(34, 211, 238, ${Math.min(alpha, 0.85)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      for (const particle of particles) {
        const dx = mx - particle.x;
        const dy = my - particle.y;
        const dist = Math.hypot(dx, dy);
        let alpha = 0.55;

        if (dist < MOUSE_RADIUS) {
          alpha += (1 - dist / MOUSE_RADIUS) * 0.45;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 1)})`;
        ctx.shadowColor = 'rgba(34, 211, 238, 0.9)';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className="bio-login-bg pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="bio-login-bg__base absolute inset-0" />
      <div className="bio-login-bg__orb bio-login-bg__orb--cyan absolute left-[10%] top-[15%] h-64 w-64 opacity-30" />
      <div className="bio-login-bg__orb bio-login-bg__orb--blue absolute bottom-[10%] right-[8%] h-72 w-72 opacity-25" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="bio-login-bg__grid absolute inset-0 opacity-[0.07]" />
      <div className="bio-login-bg__vignette absolute inset-0" />
    </div>
  );
}
