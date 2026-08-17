import { useEffect, useMemo, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

function parseStatValue(value) {
  const match = String(value).match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { number: parseInt(match[1], 10), suffix: match[2] || '' };
}

export default function CountUp({ value, className = '', duration = 1.8 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const parsed = useMemo(() => parseStatValue(value), [value]);
  const targetNumber = parsed?.number;
  const suffix = parsed?.suffix ?? '';
  const [display, setDisplay] = useState(() => (parsed ? `0${suffix}` : value));
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isInView || targetNumber == null || hasAnimated.current) return;

    let startTime = null;
    let frameId = null;
    let cancelled = false;

    const animate = (timestamp) => {
      if (cancelled) return;

      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - (1 - progress) ** 3;
      const current = Math.round(eased * targetNumber);
      setDisplay(`${current}${suffix}`);

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplay(`${targetNumber}${suffix}`);
        hasAnimated.current = true;
      }
    };

    frameId = requestAnimationFrame(animate);

    return () => {
      cancelled = true;
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [isInView, targetNumber, suffix, duration]);

  if (!parsed) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <motion.span ref={ref} className={className}>
      {display}
    </motion.span>
  );
}
