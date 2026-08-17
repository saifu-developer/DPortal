import { useState } from 'react';
import { motion } from 'framer-motion';
import { shakeKeyframes } from '../../motion/constants';

function FocusGlow({ focused }) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-0 z-0 rounded-xl"
      animate={{
        boxShadow: focused
          ? '0 0 0 2px rgba(13, 148, 136, 0.2), 0 0 12px rgba(13, 148, 136, 0.1)'
          : '0 0 0 0px rgba(13, 148, 136, 0)',
      }}
      transition={{ duration: 0.3 }}
    />
  );
}

export default function AnimatedInput({
  shake = false,
  className = '',
  ...props
}) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      animate={shake ? 'shake' : undefined}
      variants={shakeKeyframes}
      className="relative"
    >
      <FocusGlow focused={focused} />
      <input
        className={`input-field relative z-10 ${className}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </motion.div>
  );
}

export function AnimatedSelect({ shake = false, className = '', children, ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      animate={shake ? 'shake' : undefined}
      variants={shakeKeyframes}
      className="relative"
    >
      <FocusGlow focused={focused} />
      <select
        className={`input-field relative z-10 ${className}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      >
        {children}
      </select>
    </motion.div>
  );
}

export function AnimatedTextarea({ shake = false, className = '', ...props }) {
  const [focused, setFocused] = useState(false);

  return (
    <motion.div
      animate={shake ? 'shake' : undefined}
      variants={shakeKeyframes}
      className="relative"
    >
      <FocusGlow focused={focused} />
      <textarea
        className={`input-field relative z-10 resize-none ${className}`}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
    </motion.div>
  );
}
