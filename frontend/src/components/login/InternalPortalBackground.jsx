import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const MOUSE_RADIUS = 220;
const MOUSE_FORCE = 0.035;

function getCounts(width) {
  const mobile = width < 768;
  return {
    dna: mobile ? 3 : 5,
    particles: mobile ? 35 : 65,
  };
}

function createParticles(count, width, height) {
  return Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    radius: Math.random() * 1.1 + 0.9,
  }));
}

function createDnaMolecules(count, width, height) {
  return Array.from({ length: count }, (_, index) => ({
    x: width * (0.12 + (index / Math.max(count - 1, 1)) * 0.76) + (Math.random() - 0.5) * 40,
    y: height * (0.15 + Math.random() * 0.7),
    height: 90 + Math.random() * 70,
    scale: 0.65 + Math.random() * 0.45,
    rotation: (Math.random() - 0.5) * 0.5,
    rotationSpeed: (Math.random() - 0.5) * 0.0008,
    driftX: (Math.random() - 0.5) * 0.15,
    driftY: (Math.random() - 0.5) * 0.12,
    phase: Math.random() * Math.PI * 2,
  }));
}

function drawDna(ctx, molecule, time, mouseX, mouseY, reducedMotion) {
  const { x, y, height, scale, phase } = molecule;
  let rotation = molecule.rotation;
  let offsetX = 0;
  let offsetY = 0;

  if (!reducedMotion) {
    rotation += time * molecule.rotationSpeed;
    offsetX = Math.sin(time * 0.0006 + phase) * 6;
    offsetY = Math.cos(time * 0.0005 + phase) * 4;

    const dx = mouseX - (x + offsetX);
    const dy = mouseY - (y + offsetY);
    const dist = Math.hypot(dx, dy);
    if (dist > 0 && dist < MOUSE_RADIUS) {
      const influence = (1 - dist / MOUSE_RADIUS) * MOUSE_FORCE * 80;
      offsetX += (dx / dist) * influence;
      offsetY += (dy / dist) * influence;
      rotation += (dx / dist) * influence * 0.008;
    }
  }

  const segments = 14;
  const amplitude = 16 * scale;
  const strandGap = 7 * scale;
  const halfH = height / 2;

  ctx.save();
  ctx.translate(x + offsetX, y + offsetY);
  ctx.rotate(rotation);

  for (let i = 0; i <= segments; i += 1) {
    const t = i / segments;
    const py = t * height - halfH;
    const wave = Math.sin(t * Math.PI * 3.5 + phase) * amplitude;
    const x1 = wave - strandGap;
    const x2 = wave + strandGap;

    ctx.beginPath();
    ctx.arc(x1, py, 2.2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(34, 211, 238, 0.75)';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x2, py, 2.2 * scale, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(45, 212, 191, 0.7)';
    ctx.fill();

    if (i % 2 === 0) {
      ctx.beginPath();
      ctx.moveTo(x1, py);
      ctx.lineTo(x2, py);
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  ctx.restore();
}

export default function InternalPortalBackground({ mouse }) {
  const canvasRef = useRef(null);
  const mouseRef = useRef(mouse);
  const particlesRef = useRef([]);
  const dnaRef = useRef([]);
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

      const { dna, particles } = getCounts(width);
      particlesRef.current = createParticles(particles, width, height);
      dnaRef.current = createDnaMolecules(dna, width, height);
    };

    resize();
    window.addEventListener('resize', resize);

    let isVisible = document.visibilityState === 'visible';

    const draw = (time) => {
      const particles = particlesRef.current;
      const dnaMolecules = dnaRef.current;
      const { x: mouseNormX, y: mouseNormY } = mouseRef.current;
      const mouseX = mouseNormX * width;
      const mouseY = mouseNormY * height;

      ctx.clearRect(0, 0, width, height);

      if (!reducedMotion) {
        for (const particle of particles) {
          particle.x += particle.vx;
          particle.y += particle.vy;
          particle.vx *= 0.995;
          particle.vy *= 0.995;

          const dx = mouseX - particle.x;
          const dy = mouseY - particle.y;
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

        for (const molecule of dnaMolecules) {
          molecule.x += molecule.driftX * 0.02;
          molecule.y += molecule.driftY * 0.02;
        }
      }

      for (const molecule of dnaMolecules) {
        drawDna(ctx, molecule, time, mouseX, mouseY, reducedMotion);
      }

      for (const particle of particles) {
        const dx = mouseX - particle.x;
        const dy = mouseY - particle.y;
        const dist = Math.hypot(dx, dy);
        let alpha = 0.45;
        if (dist < MOUSE_RADIUS) {
          alpha += (1 - dist / MOUSE_RADIUS) * 0.4;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(186, 230, 253, ${Math.min(alpha, 0.9)})`;
        ctx.fill();
      }

      if (isVisible) {
        frameRef.current = requestAnimationFrame(draw);
      }
    };

    const startLoop = () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = requestAnimationFrame(draw);
    };

    const handleVisibilityChange = () => {
      isVisible = document.visibilityState === 'visible';
      if (isVisible) {
        startLoop();
      } else if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    if (isVisible) startLoop();

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [reducedMotion]);

  return (
    <div className="internal-portal-bg pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="internal-portal-bg__base absolute inset-0" />
      <div className="internal-portal-bg__orb internal-portal-bg__orb--cyan absolute left-[8%] top-[12%] h-72 w-72" />
      <div className="internal-portal-bg__orb internal-portal-bg__orb--teal absolute bottom-[8%] right-[10%] h-80 w-80" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="internal-portal-bg__grid absolute inset-0" />
      <div className="internal-portal-bg__vignette absolute inset-0" />
    </div>
  );
}
