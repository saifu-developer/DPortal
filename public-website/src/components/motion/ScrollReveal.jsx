import { motion } from 'framer-motion';
import { VIEWPORT } from '../../motion/constants';

export default function ScrollReveal({
  children,
  variants,
  className = '',
  as = 'div',
  delay = 0,
  viewport = VIEWPORT,
  ...props
}) {
  const Component = motion[as] || motion.div;

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={viewport}
      variants={variants}
      className={className}
      transition={{ delay }}
      {...props}
    >
      {children}
    </Component>
  );
}
