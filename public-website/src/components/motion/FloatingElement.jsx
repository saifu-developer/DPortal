import { motion } from 'framer-motion';

export default function FloatingElement({ children, className = '', duration = 5, ...props }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{ willChange: 'transform' }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
