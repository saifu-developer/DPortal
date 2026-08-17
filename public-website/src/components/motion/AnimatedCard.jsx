import { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cardHover, fadeUp, EASE_OUT } from '../../motion/constants';

export default function AnimatedCard({
  children,
  className = '',
  reveal = false,
  cursorEffect = true,
  ...props
}) {
  const cardRef = useRef(null);
  const [spotlight, setSpotlight] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback(
    (e) => {
      if (!cursorEffect || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setSpotlight({ x, y, opacity: 1 });
    },
    [cursorEffect]
  );

  const handleMouseLeave = useCallback(() => {
    setSpotlight((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={`card relative overflow-hidden ${className}`}
      initial={reveal ? 'hidden' : false}
      whileInView={reveal ? 'visible' : undefined}
      viewport={reveal ? { once: true, amount: 0.15 } : undefined}
      variants={reveal ? fadeUp : undefined}
      whileHover={{
        scale: 1.03,
        y: -8,
        boxShadow: '0 20px 40px -12px rgb(13 148 136 / 0.15)',
        borderColor: 'rgb(153 246 228)',
        transition: { duration: 0.35, ease: EASE_OUT },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ willChange: 'transform' }}
      {...props}
    >
      {cursorEffect && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
            style={{
              opacity: spotlight.opacity,
              background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(255,255,255,0.2) 0%, transparent 55%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-300"
            style={{
              opacity: spotlight.opacity * 0.7,
              background: `radial-gradient(circle at ${spotlight.x}% ${spotlight.y}%, rgba(13,148,136,0.1) 0%, transparent 50%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 z-10 rounded-2xl transition-opacity duration-200"
            style={{
              opacity: spotlight.opacity,
              boxShadow: `inset 0 0 0 1px rgba(13,148,136,${spotlight.opacity * 0.3})`,
            }}
          />
        </>
      )}
      <div className="relative z-20">{children}</div>
    </motion.div>
  );
}
